import { Router } from 'express';
import * as questionController from '../controllers/question.controller';

const router = Router();

router.get('/', questionController.getQuestions);
router.post('/', questionController.createQuestion);
router.post('/bulk', questionController.bulkCreateQuestions);
router.get('/:id', questionController.getQuestionById);
router.put('/:id', questionController.updateQuestion);
router.delete('/:id', questionController.deleteQuestion);

export default router;
