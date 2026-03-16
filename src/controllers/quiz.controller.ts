import { Request, Response, NextFunction } from 'express';
import prisma from '../config/prisma';
import * as sessionService from '../services/session.service';
import * as quizService from '../services/quiz.service';

const QUESTION_TIME_LIMIT = parseInt(process.env.QUESTION_TIME_LIMIT || '15');

export const startQuiz = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoryId = parseInt(req.params.categoryId);

    if (isNaN(categoryId)) {
      res.status(400).json({ error: 'categoryId invalide' });
      return;
    }

    const category = await quizService.getCategoryById(categoryId);
    if (!category) {
      res.status(404).json({ error: 'Catégorie introuvable' });
      return;
    }

    const questionIds = await quizService.getQuestionsByCategory(categoryId);
    if (questionIds.length === 0) {
      res.status(404).json({ error: 'Aucune question disponible dans cette catégorie' });
      return;
    }

    const session = await sessionService.createSession(categoryId, questionIds);
    const firstQuestion = await quizService.getQuestionWithAnswers(questionIds[0]);

    res.status(201).json({
      sessionId: session.sessionId,
      category: { id: category.id, name: category.name, slug: category.slug },
      question: firstQuestion,
      meta: {
        totalQuestions: questionIds.length,
        currentQuestion: 1,
        timeLimit: QUESTION_TIME_LIMIT,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const submitAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId, answerId } = req.body;

    if (!sessionId || !answerId) {
      res.status(400).json({ error: 'sessionId et answerId sont requis' });
      return;
    }

    const session = await sessionService.getSession(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session introuvable ou expirée' });
      return;
    }

    if (session.status === 'completed') {
      res.status(400).json({ error: 'Le quiz est déjà terminé' });
      return;
    }

    const currentQuestionId = session.questionIds[session.currentIndex];

    if (session.answers[currentQuestionId.toString()]) {
      res.status(400).json({ error: 'Cette question a déjà été répondue, passez à la suivante' });
      return;
    }

    const elapsed = Date.now() - session.questionStartedAt;
    const timeExpired = elapsed > QUESTION_TIME_LIMIT * 1000;

    const correctAnswer = await quizService.getCorrectAnswer(currentQuestionId);
    const providedAnswer = await quizService.getAnswerById(parseInt(answerId));

    if (!providedAnswer || providedAnswer.questionId !== currentQuestionId) {
      res.status(400).json({ error: 'Réponse invalide pour cette question' });
      return;
    }

    let isCorrect = false;
    let message = '';

    if (timeExpired) {
      isCorrect = false;
      message = 'Temps écoulé ! La réponse est incorrecte';
    } else {
      isCorrect = providedAnswer.isCorrect;
      message = isCorrect ? 'Bonne réponse !' : 'Mauvaise réponse !';
    }

    await sessionService.markAnswer(session, currentQuestionId, parseInt(answerId), isCorrect, timeExpired);

    res.json({
      isCorrect,
      timeExpired,
      message,
      correctAnswer: correctAnswer ? { id: correctAnswer.id, text: correctAnswer.text } : null,
      providedAnswer: { id: providedAnswer.id, text: providedAnswer.text },
      timeElapsed: Math.floor(elapsed / 1000),
    });
  } catch (err) {
    next(err);
  }
};

export const nextQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).json({ error: 'sessionId est requis' });
      return;
    }

    const session = await sessionService.getSession(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session introuvable ou expirée' });
      return;
    }

    if (session.status === 'completed') {
      res.json({
        completed: true,
        message: 'Le quiz est terminé. Consultez vos résultats.',
      });
      return;
    }

    const updatedSession = await sessionService.advanceToNext(session);

    if (updatedSession.status === 'completed') {
      res.json({
        completed: true,
        message: 'Quiz terminé ! Consultez vos résultats.',
      });
      return;
    }

    const nextQuestionId = updatedSession.questionIds[updatedSession.currentIndex];
    const question = await quizService.getQuestionWithAnswers(nextQuestionId);

    res.json({
      question,
      meta: {
        totalQuestions: updatedSession.questionIds.length,
        currentQuestion: updatedSession.currentIndex + 1,
        timeLimit: QUESTION_TIME_LIMIT,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getResult = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      res.status(400).json({ error: 'sessionId est requis' });
      return;
    }

    const session = await sessionService.getSession(sessionId);
    if (!session) {
      res.status(404).json({ error: 'Session introuvable ou expirée' });
      return;
    }

    const detailsPromises = session.questionIds.map(async (questionId, index) => {
      const answerRecord = session.answers[questionId.toString()];
      const question = await prisma.question.findUnique({
        where: { id: questionId },
        select: { text: true },
      });
      const correctAnswer = await quizService.getCorrectAnswer(questionId);

      let providedAnswerText: string | null = null;
      if (answerRecord?.providedAnswerId) {
        const provided = await quizService.getAnswerById(answerRecord.providedAnswerId);
        providedAnswerText = provided?.text ?? null;
      }

      const status = !answerRecord
        ? 'not_reached'
        : answerRecord.skipped
        ? 'skipped'
        : answerRecord.timeExpired
        ? 'time_expired'
        : answerRecord.isCorrect
        ? 'correct'
        : 'incorrect';

      return {
        questionNumber: index + 1,
        questionId,
        question: question?.text ?? '',
        status,
        isCorrect: answerRecord?.isCorrect ?? false,
        timeExpired: answerRecord?.timeExpired ?? false,
        skipped: answerRecord?.skipped ?? false,
        providedAnswer: providedAnswerText,
        correctAnswer: correctAnswer?.text ?? null,
        timeElapsed: answerRecord
          ? Math.floor(((answerRecord.answeredAt ?? answerRecord.startedAt) - answerRecord.startedAt) / 1000)
          : null,
      };
    });

    const details = await Promise.all(detailsPromises);
    const totalQuestions = session.questionIds.length;
    const answeredCount = Object.keys(session.answers).length;
    const correctCount = details.filter((d) => d.isCorrect).length;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    const totalDuration =
      session.status === 'completed' ? Math.floor((Date.now() - session.startedAt) / 1000) : null;

    res.json({
      sessionId: session.sessionId,
      status: session.status,
      score: {
        correct: correctCount,
        total: totalQuestions,
        answered: answeredCount,
        percentage,
      },
      duration: totalDuration,
      details,
    });
  } catch (err) {
    next(err);
  }
};
