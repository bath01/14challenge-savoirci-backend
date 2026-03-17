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
