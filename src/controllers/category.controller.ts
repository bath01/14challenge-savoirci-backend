import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/prisma';

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { questions: true } } },
      orderBy: { id: 'asc' },
    });
    res.json({
      categories: categories.map(({ _count, ...c }) => ({ ...c, questionCount: _count.questions })),
    });
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'id invalide' }); return; }

    const category = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { questions: true } } },
    });
    if (!category) { res.status(404).json({ error: 'Catégorie introuvable' }); return; }

    const { _count, ...rest } = category;
    res.json({ ...rest, questionCount: _count.questions });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, slug } = req.body;
    if (!name || !slug) { res.status(400).json({ error: 'name et slug sont requis' }); return; }

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) { res.status(409).json({ error: 'Ce slug est déjà utilisé' }); return; }

    const category = await prisma.category.create({
      data: { name, description: description ?? null, slug },
    });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'id invalide' }); return; }

    const { name, description, slug } = req.body;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'Catégorie introuvable' }); return; }

    if (slug && slug !== existing.slug) {
      const slugConflict = await prisma.category.findUnique({ where: { slug } });
      if (slugConflict) { res.status(409).json({ error: 'Ce slug est déjà utilisé' }); return; }
    }

    const category = await prisma.category.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(slug !== undefined && { slug }),
      },
    });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) { res.status(400).json({ error: 'id invalide' }); return; }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) { res.status(404).json({ error: 'Catégorie introuvable' }); return; }

    await prisma.category.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const bulkCreateCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories) || categories.length === 0) {
      res.status(400).json({ error: 'categories doit être un tableau non vide' });
      return;
    }

    for (let i = 0; i < categories.length; i++) {
      const { name, slug } = categories[i];
      if (!name || !slug) {
        res.status(400).json({ error: `Entrée [${i}] : name et slug sont requis` });
        return;
      }
    }

    const slugs = categories.map((c: { slug: string }) => c.slug);
    const duplicateSlug = slugs.find((s: string, i: number) => slugs.indexOf(s) !== i);
    if (duplicateSlug) {
      res.status(400).json({ error: `Slug dupliqué dans la requête : "${duplicateSlug}"` });
      return;
    }

    const existingSlugs = await prisma.category.findMany({
      where: { slug: { in: slugs } },
      select: { slug: true },
    });
    if (existingSlugs.length > 0) {
      res.status(409).json({ error: `Slugs déjà utilisés : ${existingSlugs.map((c) => c.slug).join(', ')}` });
      return;
    }

    const created = await prisma.$transaction(
      categories.map((c: { name: string; slug: string; description?: string }) =>
        prisma.category.create({ data: { name: c.name, slug: c.slug, description: c.description ?? null } })
      )
    );

    res.status(201).json({ count: created.length, categories: created });
  } catch (err) {
    next(err);
  }
};
