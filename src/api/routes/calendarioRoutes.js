import express from 'express';
import * as calendarioController from '../controllers/calendarioController.js';
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = express.Router();

// Todas as rotas de calendário exigem autenticação
router.use(isLoggedIn);

// POST /api/calendario/eventos - Criar novo evento no Google Calendar
router.post('/eventos', calendarioController.criarEvento);

// GET /api/calendario/eventos - Listar eventos do Google Calendar
router.get('/eventos', calendarioController.listarEventos);

// GET /api/calendario/eventos/:id - Buscar evento específico
router.get('/eventos/:id', calendarioController.buscarEvento);

// PUT /api/calendario/eventos/:id - Atualizar evento
router.put('/eventos/:id', calendarioController.atualizarEvento);

// DELETE /api/calendario/eventos/:id - Deletar evento
router.delete('/eventos/:id', calendarioController.deletarEvento);

export default router;
