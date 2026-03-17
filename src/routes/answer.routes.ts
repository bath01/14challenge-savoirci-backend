import { Router } from 'express';
import * as answerController from '../controllers/answer.controller';

const router = Router();

router.get('/', answerController.getAnswers);
router.post('/', answerController.createAnswer);
router.post('/bulk', answerController.bulkCreateAnswers);
router.get('/:id', answerController.getAnswerById);
router.put('/:id', answerController.updateAnswer);
router.delete('/:id', answerController.deleteAnswer);

export default router;
