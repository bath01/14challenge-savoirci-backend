import { QuestionWithAnswers } from '../types/quiz.types';
import { prisma } from '../utils/prisma';

export const getCategoryById = async (categoryId: number) => {
  return prisma.category.findUnique({
    where: { id: categoryId },
  });
};

export const getQuestionsByCategory = async (categoryId: number): Promise<number[]> => {
  const questions = await prisma.question.findMany({
    where: { categoryId },
    select: { id: true },
  });

  // Shuffle questions
  const ids = questions.map((q) => q.id);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ids[i], ids[j]] = [ids[j], ids[i]];
  }

  return ids;
};

export const getQuestionWithAnswers = async (questionId: number): Promise<QuestionWithAnswers | null> => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      answers: {
        select: { id: true, text: true },
        orderBy: { id: 'asc' },
      },
    },
  });

  if (!question) return null;

  // Shuffle answers
  const answers = [...question.answers];
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }

  return {
    id: question.id,
    text: question.text,
    answers,
  };
};

export const getCorrectAnswer = async (questionId: number) => {
  return prisma.answer.findFirst({
    where: { questionId, isCorrect: true },
    select: { id: true, text: true },
  });
};

export const checkAnswer = async (answerId: number): Promise<boolean> => {
  const answer = await prisma.answer.findUnique({
    where: { id: answerId },
    select: { isCorrect: true },
  });
  return answer?.isCorrect ?? false;
};

export const getAnswerById = async (answerId: number) => {
  return prisma.answer.findUnique({
    where: { id: answerId },
    select: { id: true, text: true, isCorrect: true, questionId: true },
  });
};

export const getCategories = async () => {
  return prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      _count: { select: { questions: true } },
    },
    orderBy: { id: 'asc' },
  }).then((categories) =>
    categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      questionCount: c._count.questions,
    }))
  );
};

export const getStatsData = async () => {
  const [totalCategories, totalQuestions, categoriesWithCount] = await Promise.all([
    prisma.category.count(),
    prisma.question.count(),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        _count: { select: { questions: true } },
      },
      orderBy: { id: 'asc' },
    }),
  ]);

  return {
    totalCategories,
    totalQuestions,
    categories: categoriesWithCount.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      questionCount: c._count.questions,
    })),
  };
};
