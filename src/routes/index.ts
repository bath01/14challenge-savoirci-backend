import { Router } from 'express';
import quizRoutes from './quiz.routes';
import statsRoutes from './stats.routes';
import categoryRoutes from './category.routes';
import questionRoutes from './question.routes';
import answerRoutes from './answer.routes';

const router = Router();

router.use('/quiz', quizRoutes);
router.use('/stats', statsRoutes);
router.use('/admin/categories', categoryRoutes);
router.use('/admin/questions', questionRoutes);
router.use('/admin/answers', answerRoutes);

export default router;
