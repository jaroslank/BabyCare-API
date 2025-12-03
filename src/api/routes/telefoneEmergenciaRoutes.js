import express from 'express';
import * as telefoneEmergenciaController from '../controllers/telefoneEmergenciaController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(isLoggedIn);

// Criar telefone de emergência
router.post('/', telefoneEmergenciaController.criar);

// Listar telefones do usuário
router.get('/', telefoneEmergenciaController.listar);

// Buscar telefone por ID
router.get('/:id', telefoneEmergenciaController.buscarPorId);

// Atualizar telefone
router.put('/:id', telefoneEmergenciaController.atualizar);

// Remover telefone
router.delete('/:id', telefoneEmergenciaController.remover);

export default router;
