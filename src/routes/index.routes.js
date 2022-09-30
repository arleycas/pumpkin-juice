import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.redirect('/tarea/lista/1');
});

router.get('/tarea', (req, res) => {
  res.redirect('/tarea/lista/1');
});

router.get('/tarea/lista', (req, res) => {
  res.redirect('/tarea/lista/1');
});

export default router;