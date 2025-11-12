import { Router } from 'express';
import { body } from 'express-validator';

// Importa os controllers e o middleware de autenticação usando a sintaxe moderna
import * as usuarioController from '../controllers/usuarioController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = Router();

// Regras de validação para a rota de atualização
const regrasDeAtualizacao = [
  body('nome').optional().isString().withMessage('Nome deve ser um texto.').trim().notEmpty().withMessage('Nome não pode ser vazio.'),
  body('curso').optional().isString().withMessage('Curso deve ser um texto.').trim(),
  body('semestre').optional().isInt({ min: 1, max: 20 }).withMessage('Semestre deve ser um número entre 1 e 20.')
];

// --- ROTAS DE USUÁRIO ---
// Todas as rotas são protegidas e requerem login.
// As rotas foram ajustadas para usar os nomes de função corretos do controller.

// GET / -> Listar todos os usuários ativos
router.get('/', isLoggedIn, usuarioController.listarTodos);

// GET /:id -> Buscar um usuário específico pelo ID
router.get('/:id', isLoggedIn, usuarioController.buscarUm);


// DELETE /:id -> Desativar um usuário (soft delete)
router.delete('/:id', isLoggedIn, usuarioController.deletarUm);

//PATCH /:id/reativar -> Reativa um usuário
router.patch('/:id/reativar', isLoggedIn, usuarioController.reativarUm);

export default router;
