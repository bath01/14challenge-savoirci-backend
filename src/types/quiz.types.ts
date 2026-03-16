export interface QuizAnswer {
  providedAnswerId: number | null;
  isCorrect: boolean;
  timeExpired: boolean;
  skipped: boolean;
  startedAt: number; // timestamp ms
  answeredAt: number | null;
}

export interface QuizSession {
  sessionId: string;
  categoryId: number;
  questionIds: number[];
  currentIndex: number;
  answers: Record<string, QuizAnswer>; // key = questionId.toString()
  questionStartedAt: number; // when current question was served
  startedAt: number;
  status: 'in_progress' | 'completed';
}

export interface QuestionWithAnswers {
  id: number;
  text: string;
  answers: {
    id: number;
    text: string;
  }[];
}

export interface QuizMeta {
  totalQuestions: number;
  currentQuestion: number;
  timeLimit: number; // seconds
  timeRemaining?: number; // seconds remaining
}
