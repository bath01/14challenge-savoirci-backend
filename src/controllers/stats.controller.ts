import { Request, Response, NextFunction } from 'express';
import * as quizService from '../services/quiz.service';

export const getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await quizService.getCategories();
    res.json({ categories });
  } catch (err) {
    next(err);
  }
};

export const getStats = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const stats = await quizService.getStatsData();
    res.json(stats);
  } catch (err) {
    next(err);
  }
};
