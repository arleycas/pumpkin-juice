import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.redirect('/tarea/lista');
});

router.get('/tarea', (req, res) => {
  res.redirect('/tarea/lista');
});

export default router;