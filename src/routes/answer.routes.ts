import { Router } from 'express';
import * as answerController from '../controllers/answer.controller';

const router = Router();

router.get('/', answerController.getAnswers);
router.get('/:id', answerController.getAnswerById);
router.post('/', answerController.createAnswer);
router.put('/:id', answerController.updateAnswer);
router.delete('/:id', answerController.deleteAnswer);

export default router;
