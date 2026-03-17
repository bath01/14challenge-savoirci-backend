import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

export const getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    if (req.query.categoryId && isNaN(categoryId!)) {
      res.status(400).json({ error: 'categoryId invalide' });
      return;
    }

    const questions = await prisma.question.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: { _count: { select: { answers: true } } },
      orderBy: { id: 'asc' },
    });
    res.json({
      questions: questions.map(({ _count, ...q }) => ({ ...q, answerCount: _count.answers })),
    });
  } catch (err) {
    next(err);
  }
};

export const getQuestionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'id invalide' }); return; }

    const question = await prisma.question.findUnique({
      where: { id },
      include: { answers: { orderBy: { id: 'asc' } } },
    });
    if (!question) { res.status(404).json({ error: 'Question introuvable' }); return; }

    res.json(question);
  } catch (err) {
    next(err);
  }
};

export const createQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { text, categoryId } = req.body;
    if (!text || categoryId === undefined) {
      res.status(400).json({ error: 'text et categoryId sont requis' });
      return;
    }

    const parsedCategoryId = parseInt(categoryId);
    if (isNaN(parsedCategoryId)) { res.status(400).json({ error: 'categoryId invalide' }); return; }

    const category = await prisma.category.findUnique({ where: { id: parsedCategoryId } });
    if (!category) { res.status(404).json({ error: 'Catégorie introuvable' }); return; }

    const question = await prisma.question.create({
      data: { text, categoryId: parsedCategoryId },
    });
    res.status(201).json(question);
  } catch (err) {
    next(err);
  }
};

export const updateQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'id invalide' }); return; }

    const { text, categoryId } = req.body;

    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'Question introuvable' }); return; }

    if (categoryId !== undefined) {
      const parsedCategoryId = parseInt(categoryId);
      if (isNaN(parsedCategoryId)) { res.status(400).json({ error: 'categoryId invalide' }); return; }
      const category = await prisma.category.findUnique({ where: { id: parsedCategoryId } });
      if (!category) { res.status(404).json({ error: 'Catégorie introuvable' }); return; }
    }

    const question = await prisma.question.update({
      where: { id },
      data: {
        ...(text !== undefined && { text }),
        ...(categoryId !== undefined && { categoryId: parseInt(categoryId) }),
      },
    });
    res.json(question);
  } catch (err) {
    next(err);
  }
};

export const deleteQuestion = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'id invalide' }); return; }

    const existing = await prisma.question.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'Question introuvable' }); return; }

    await prisma.question.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const bulkCreateQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      res.status(400).json({ error: 'questions doit être un tableau non vide' });
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const { text, categoryId } = questions[i];
      if (!text || categoryId === undefined) {
        res.status(400).json({ error: `Entrée [${i}] : text et categoryId sont requis` });
        return;
      }
      if (isNaN(parseInt(categoryId))) {
        res.status(400).json({ error: `Entrée [${i}] : categoryId invalide` });
        return;
      }
    }

    const categoryIds = [...new Set(questions.map((q: { categoryId: number }) => parseInt(q.categoryId)))];
    const existingCategories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true },
    });
    const foundIds = existingCategories.map((c) => c.id);
    const missingIds = categoryIds.filter((id) => !foundIds.includes(id));
    if (missingIds.length > 0) {
      res.status(404).json({ error: `Catégories introuvables : ${missingIds.join(', ')}` });
      return;
    }

    const created = await prisma.$transaction(
      questions.map((q: { text: string; categoryId: number }) =>
        prisma.question.create({ data: { text: q.text, categoryId: parseInt(q.categoryId as unknown as string) } })
      )
    );

    res.status(201).json({ count: created.length, questions: created });
  } catch (err) {
    next(err);
  }
};
