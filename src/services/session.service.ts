import { v4 as uuidv4 } from 'uuid';
import redis from '../config/redis';
import { QuizSession, QuizAnswer } from '../types/quiz.types';

const SESSION_TTL = parseInt(process.env.SESSION_TTL || '3600');

export const createSession = async (categoryId: number, questionIds: number[]): Promise<QuizSession> => {
  const sessionId = uuidv4();
  const now = Date.now();

  const session: QuizSession = {
    sessionId,
    categoryId,
    questionIds,
    currentIndex: 0,
    answers: {},
    questionStartedAt: now,
    startedAt: now,
    status: 'in_progress',
  };

  await redis.set(`session:${sessionId}`, JSON.stringify(session), 'EX', SESSION_TTL);
  return session;
};

export const getSession = async (sessionId: string): Promise<QuizSession | null> => {
  const data = await redis.get(`session:${sessionId}`);
  if (!data) return null;
  return JSON.parse(data) as QuizSession;
};

export const updateSession = async (session: QuizSession): Promise<void> => {
  await redis.set(`session:${session.sessionId}`, JSON.stringify(session), 'EX', SESSION_TTL);
};

export const markAnswer = async (
  session: QuizSession,
  questionId: number,
  providedAnswerId: number | null,
  isCorrect: boolean,
  timeExpired: boolean,
  skipped: boolean = false
): Promise<QuizSession> => {
  const answer: QuizAnswer = {
    providedAnswerId,
    isCorrect,
    timeExpired,
    skipped,
    startedAt: session.questionStartedAt,
    answeredAt: Date.now(),
  };

  session.answers[questionId.toString()] = answer;
  await updateSession(session);
  return session;
};

export const advanceToNext = async (session: QuizSession): Promise<QuizSession> => {
  const QUESTION_TIME_LIMIT = parseInt(process.env.QUESTION_TIME_LIMIT || '15') * 1000;
  const currentQuestionId = session.questionIds[session.currentIndex];

  // Auto-mark current question if not answered
  if (currentQuestionId && !session.answers[currentQuestionId.toString()]) {
    const elapsed = Date.now() - session.questionStartedAt;
    const timeExpired = elapsed >= QUESTION_TIME_LIMIT;

    session.answers[currentQuestionId.toString()] = {
      providedAnswerId: null,
      isCorrect: false,
      timeExpired,
      skipped: !timeExpired,
      startedAt: session.questionStartedAt,
      answeredAt: Date.now(),
    };
  }

  session.currentIndex += 1;

  if (session.currentIndex >= session.questionIds.length) {
    session.status = 'completed';
  } else {
    session.questionStartedAt = Date.now();
  }

  await updateSession(session);
  return session;
};
