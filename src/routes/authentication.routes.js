// aqui rutas relacionadas con el login
import { Router } from 'express';
const router = Router();

// render
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', (req, res) => {

  const { user, pass } = req.body;


});

export default router;
