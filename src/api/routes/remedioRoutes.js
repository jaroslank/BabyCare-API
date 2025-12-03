import express from 'express';
import * as remedioController from '../controllers/remedioController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(isLoggedIn);

// Criar remédio
router.post('/', remedioController.criar);

// Listar remédios do usuário
router.get('/', remedioController.listar);

// Buscar remédio por ID
router.get('/:id', remedioController.buscarPorId);

// Atualizar remédio
router.put('/:id', remedioController.atualizar);

// Remover remédio
router.delete('/:id', remedioController.remover);

export default router;
