import { Router } from 'express';
import quizRoutes from './quiz.routes';
import statsRoutes from './stats.routes';

const router = Router();

router.use('/quiz', quizRoutes);
router.use('/stats', statsRoutes);

export default router;
