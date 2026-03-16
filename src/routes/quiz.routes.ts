import { Router } from 'express';
import * as quizController from '../controllers/quiz.controller';

const router = Router();

router.post('/start/:categoryId', quizController.startQuiz);
router.post('/answer', quizController.submitAnswer);
router.get('/next', quizController.nextQuestion);
router.get('/result', quizController.getResult);

export default router;
