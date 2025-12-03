import { Router } from 'express';
import * as refeicaoController from '../controllers/refeicaoController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = Router();

// Todas as rotas de refeições são protegidas
router.use(isLoggedIn);

// POST /api/refeicoes - Criar uma nova refeição
router.post('/', refeicaoController.createRefeicao);

// GET /api/refeicoes - Obter todas as refeições do usuário logado
router.get('/', refeicaoController.getRefeicoes);

// GET /api/refeicoes/:id - Obter uma refeição específica
router.get('/:id', refeicaoController.getRefeicaoById);

// PUT /api/refeicoes/:id - Atualizar uma refeição
router.put('/:id', refeicaoController.updateRefeicao);

// DELETE /api/refeicoes/:id - Deletar uma refeição
router.delete('/:id', refeicaoController.deleteRefeicao);

export default router;
