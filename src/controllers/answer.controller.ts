import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

export const getAnswers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const questionId = req.query.questionId ? parseInt(req.query.questionId as string) : undefined;
    if (req.query.questionId && isNaN(questionId!)) {
      res.status(400).json({ error: 'questionId invalide' });
      return;
    }

    const answers = await prisma.answer.findMany({
      where: questionId ? { questionId } : undefined,
      orderBy: { id: 'asc' },
    });
    res.json({ answers });
  } catch (err) {
    next(err);
  }
};

export const getAnswerById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'id invalide' }); return; }

    const answer = await prisma.answer.findUnique({ where: { id } });
    if (!answer) { res.status(404).json({ error: 'Réponse introuvable' }); return; }

    res.json(answer);
  } catch (err) {
    next(err);
  }
};

export const createAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { text, isCorrect, questionId } = req.body;
    if (!text || questionId === undefined) {
      res.status(400).json({ error: 'text et questionId sont requis' });
      return;
    }

    const parsedQuestionId = parseInt(questionId);
    if (isNaN(parsedQuestionId)) { res.status(400).json({ error: 'questionId invalide' }); return; }

    const question = await prisma.question.findUnique({ where: { id: parsedQuestionId } });
    if (!question) { res.status(404).json({ error: 'Question introuvable' }); return; }

    const answer = await prisma.answer.create({
      data: { text, isCorrect: Boolean(isCorrect), questionId: parsedQuestionId },
    });
    res.status(201).json(answer);
  } catch (err) {
    next(err);
  }
};

export const updateAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'id invalide' }); return; }

    const { text, isCorrect } = req.body;

    const existing = await prisma.answer.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'Réponse introuvable' }); return; }

    const answer = await prisma.answer.update({
      where: { id },
      data: {
        ...(text !== undefined && { text }),
        ...(isCorrect !== undefined && { isCorrect: Boolean(isCorrect) }),
      },
    });
    res.json(answer);
  } catch (err) {
    next(err);
  }
};

export const deleteAnswer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'id invalide' }); return; }

    const existing = await prisma.answer.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'Réponse introuvable' }); return; }

    await prisma.answer.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const bulkCreateAnswers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length === 0) {
      res.status(400).json({ error: 'answers doit être un tableau non vide' });
      return;
    }

    for (let i = 0; i < answers.length; i++) {
      const { text, questionId } = answers[i];
      if (!text || questionId === undefined) {
        res.status(400).json({ error: `Entrée [${i}] : text et questionId sont requis` });
        return;
      }
      if (isNaN(parseInt(questionId))) {
        res.status(400).json({ error: `Entrée [${i}] : questionId invalide` });
        return;
      }
    }

    const questionIds = [...new Set(answers.map((a: { questionId: number }) => parseInt(a.questionId as unknown as string)))];
    const existingQuestions = await prisma.question.findMany({
      where: { id: { in: questionIds } },
      select: { id: true },
    });
    const foundIds = existingQuestions.map((q) => q.id);
    const missingIds = questionIds.filter((id) => !foundIds.includes(id));
    if (missingIds.length > 0) {
      res.status(404).json({ error: `Questions introuvables : ${missingIds.join(', ')}` });
      return;
    }

    const created = await prisma.$transaction(
      answers.map((a: { text: string; isCorrect?: boolean; questionId: number }) =>
        prisma.answer.create({
          data: {
            text: a.text,
            isCorrect: Boolean(a.isCorrect),
            questionId: parseInt(a.questionId as unknown as string),
          },
        })
      )
    );

    res.status(201).json({ count: created.length, answers: created });
  } catch (err) {
    next(err);
  }
};
