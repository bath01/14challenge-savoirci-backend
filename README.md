# SavoirCI — Backend API

API REST pour le quiz de culture générale sur la Côte d'Ivoire. Sans création de compte, chaque session de jeu est gérée via Redis.

---

## Stack technique

- **Runtime** : Node.js 20 + TypeScript
- **Framework** : Express.js
- **ORM** : Prisma 5
- **Base de données** : MySQL
- **Sessions** : Redis (ioredis)
- **Conteneurisation** : Docker (multi-stage)

---

## Prérequis

- Node.js >= 20
- MySQL >= 8
- Redis >= 7
- npm >= 10

---

## Installation

```bash
git clone https://github.com/bath01/14challenge-savoirci-backend.git
cd 14challenge-savoirci-backend
npm install
```

Copier le fichier d'environnement et le remplir :

```bash
cp .env.example .env
```

```env
PORT=3000
DATABASE_URL="mysql://user:password@localhost:3306/savoirci_quiz"
REDIS_URL="redis://localhost:6379"
SESSION_TTL=3600          # Durée de vie de la session en secondes
QUESTION_TIME_LIMIT=15    # Temps imparti par question en secondes
```

---

## Base de données

```bash
# Créer et appliquer les migrations
npm run prisma:migrate

# Générer le client Prisma
npm run prisma:generate

# Insérer les données initiales (5 catégories, 50 questions)
npm run prisma:seed

# Ouvrir Prisma Studio (interface visuelle)
npm run prisma:studio
```

---

## Lancement

```bash
# Développement (hot-reload)
npm run dev

# Production
npm run build
npm start
```

---

## Déploiement Docker

```bash
# Builder l'image
docker build -t savoirci-backend .

# Lancer le conteneur
docker run -p 3000:3000 \
  -e DATABASE_URL="mysql://user:password@host:3306/savoirci_quiz" \
  -e REDIS_URL="redis://host:6379" \
  -e SESSION_TTL=3600 \
  -e QUESTION_TIME_LIMIT=15 \
  savoirci-backend
```

> Au démarrage, le conteneur exécute automatiquement `prisma migrate deploy` avant de lancer le serveur.

---

## Endpoints

Base URL : `http://localhost:3000/api/v1`

### Health check

```
GET /health
```

```json
{ "status": "ok", "timestamp": "2026-03-16T10:00:00.000Z" }
```

---

### Statistiques

#### `GET /stats`

Retourne le nombre total de catégories et de questions.

**Réponse**

```json
{
  "totalCategories": 5,
  "totalQuestions": 50,
  "categories": [
    { "id": 1, "name": "Histoire",            "slug": "histoire",   "description": "...", "questionCount": 10 },
    { "id": 2, "name": "Géographie",          "slug": "geographie", "description": "...", "questionCount": 10 },
    { "id": 3, "name": "Culture & Traditions","slug": "culture",    "description": "...", "questionCount": 10 },
    { "id": 4, "name": "Économie",            "slug": "economie",   "description": "...", "questionCount": 10 },
    { "id": 5, "name": "Sport",               "slug": "sport",      "description": "...", "questionCount": 10 }
  ]
}
```

#### `GET /stats/categories`

Retourne la liste de toutes les catégories disponibles avec le nombre de questions associées.

**Réponse**

```json
{
  "categories": [
    { "id": 1, "name": "Histoire",             "slug": "histoire",   "description": "...", "questionCount": 10 },
    { "id": 2, "name": "Géographie",           "slug": "geographie", "description": "...", "questionCount": 10 },
    { "id": 3, "name": "Culture & Traditions", "slug": "culture",    "description": "...", "questionCount": 10 },
    { "id": 4, "name": "Économie",             "slug": "economie",   "description": "...", "questionCount": 10 },
    { "id": 5, "name": "Sport",                "slug": "sport",      "description": "...", "questionCount": 10 }
  ]
}
```

---

### Quiz

#### `POST /quiz/start/:categoryId`

Démarre une nouvelle session de quiz sur la catégorie donnée. Les questions et les réponses sont mélangées aléatoirement. Retourne un `sessionId` à conserver pour tous les appels suivants.

**Paramètre URL**

| Paramètre    | Type    | Description          |
|--------------|---------|----------------------|
| `categoryId` | integer | ID de la catégorie   |

**Réponse `201`**

```json
{
  "sessionId": "a1b2c3d4-...",
  "category": { "id": 1, "name": "Histoire", "slug": "histoire" },
  "question": {
    "id": 7,
    "text": "Qui était le premier président de la Côte d'Ivoire ?",
    "answers": [
      { "id": 28, "text": "Laurent Gbagbo" },
      { "id": 25, "text": "Félix Houphouët-Boigny" },
      { "id": 27, "text": "Henri Konan Bédié" },
      { "id": 26, "text": "Alassane Ouattara" }
    ]
  },
  "meta": {
    "totalQuestions": 10,
    "currentQuestion": 1,
    "timeLimit": 15
  }
}
```

---

#### `POST /quiz/answer`

Soumet la réponse à la question en cours. Si le temps imparti (15s) est dépassé, la réponse est automatiquement marquée incorrecte.

**Corps de la requête**

```json
{ "sessionId": "a1b2c3d4-...", "answerId": 25 }
```

**Réponse `200` — bonne réponse**

```json
{
  "isCorrect": true,
  "timeExpired": false,
  "message": "Bonne réponse !",
  "correctAnswer": { "id": 25, "text": "Félix Houphouët-Boigny" },
  "providedAnswer": { "id": 25, "text": "Félix Houphouët-Boigny" },
  "timeElapsed": 4
}
```

**Réponse `200` — mauvaise réponse**

```json
{
  "isCorrect": false,
  "timeExpired": false,
  "message": "Mauvaise réponse !",
  "correctAnswer": { "id": 25, "text": "Félix Houphouët-Boigny" },
  "providedAnswer": { "id": 28, "text": "Laurent Gbagbo" },
  "timeElapsed": 8
}
```

**Réponse `200` — temps écoulé**

```json
{
  "isCorrect": false,
  "timeExpired": true,
  "message": "Temps écoulé ! La réponse est incorrecte",
  "correctAnswer": { "id": 25, "text": "Félix Houphouët-Boigny" },
  "providedAnswer": { "id": 28, "text": "Laurent Gbagbo" },
  "timeElapsed": 17
}
```

---

#### `GET /quiz/next?sessionId=`

Passe à la question suivante. Si la question en cours n'a pas été répondue, elle est automatiquement marquée :
- `time_expired` si les 15s sont dépassées
- `skipped` sinon

Retourne `completed: true` quand toutes les questions ont été parcourues.

**Paramètre query**

| Paramètre   | Type   | Description       |
|-------------|--------|-------------------|
| `sessionId` | string | ID de la session  |

**Réponse `200` — question suivante**

```json
{
  "question": {
    "id": 12,
    "text": "En quelle année la Côte d'Ivoire a-t-elle obtenu son indépendance ?",
    "answers": [
      { "id": 45, "text": "1958" },
      { "id": 46, "text": "1962" },
      { "id": 43, "text": "1960" },
      { "id": 44, "text": "1955" }
    ]
  },
  "meta": {
    "totalQuestions": 10,
    "currentQuestion": 2,
    "timeLimit": 15
  }
}
```

**Réponse `200` — quiz terminé**

```json
{
  "completed": true,
  "message": "Quiz terminé ! Consultez vos résultats."
}
```

---

#### `GET /quiz/result?sessionId=`

Retourne les résultats complets du quiz : score, pourcentage de réussite et détail question par question.

**Paramètre query**

| Paramètre   | Type   | Description       |
|-------------|--------|-------------------|
| `sessionId` | string | ID de la session  |

**Réponse `200`**

```json
{
  "sessionId": "a1b2c3d4-...",
  "status": "completed",
  "score": {
    "correct": 7,
    "total": 10,
    "answered": 10,
    "percentage": 70
  },
  "duration": 98,
  "details": [
    {
      "questionNumber": 1,
      "questionId": 7,
      "question": "Qui était le premier président de la Côte d'Ivoire ?",
      "status": "correct",
      "isCorrect": true,
      "timeExpired": false,
      "skipped": false,
      "providedAnswer": "Félix Houphouët-Boigny",
      "correctAnswer": "Félix Houphouët-Boigny",
      "timeElapsed": 4
    },
    {
      "questionNumber": 2,
      "questionId": 12,
      "question": "En quelle année la Côte d'Ivoire a-t-elle obtenu son indépendance ?",
      "status": "incorrect",
      "isCorrect": false,
      "timeExpired": false,
      "skipped": false,
      "providedAnswer": "1958",
      "correctAnswer": "1960",
      "timeElapsed": 6
    },
    {
      "questionNumber": 3,
      "questionId": 5,
      "question": "Quelle est la capitale officielle de la Côte d'Ivoire ?",
      "status": "time_expired",
      "isCorrect": false,
      "timeExpired": true,
      "skipped": false,
      "providedAnswer": null,
      "correctAnswer": "Yamoussoukro",
      "timeElapsed": 15
    }
  ]
}
```

**Valeurs possibles pour `status` dans `details`**

| Valeur         | Signification                                  |
|----------------|------------------------------------------------|
| `correct`      | Bonne réponse donnée dans le temps imparti     |
| `incorrect`    | Mauvaise réponse donnée dans le temps imparti  |
| `time_expired` | Temps dépassé (avec ou sans réponse soumise)   |
| `skipped`      | Passée sans réponse avant la fin du temps      |
| `not_reached`  | Question non atteinte (résultats partiels)     |

---

## Flux de jeu

```
POST /quiz/start/:categoryId
        │
        ▼
   sessionId + question 1
        │
        ├──► POST /quiz/answer  (optionnel, dans les 15s)
        │
        ▼
   GET /quiz/next
        │
        ▼
   question 2 ... N
        │
        ▼  (après la dernière question)
   { completed: true }
        │
        ▼
   GET /quiz/result
```

---

## Codes d'erreur

| Code | Cas                                                  |
|------|------------------------------------------------------|
| 400  | Paramètre manquant, quiz déjà terminé, déjà répondu  |
| 404  | Session expirée / introuvable, catégorie inexistante |
| 500  | Erreur interne                                       |

---

## Catégories disponibles

| ID | Nom                  | Slug        |
|----|----------------------|-------------|
| 1  | Histoire             | histoire    |
| 2  | Géographie           | geographie  |
| 3  | Culture & Traditions | culture     |
| 4  | Économie             | economie    |
| 5  | Sport                | sport       |
