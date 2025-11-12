import { Router } from 'express';
import * as localizacaoController from '../controllers/localizacaoController.js';
// CORREÇÃO: Importar a função correta do middleware
import { isLoggedIn } from '../middleware/authMiddleware.js';

const router = Router();

router.use(isLoggedIn);

// POST /api/localizacao - Criar um novo registro de localização
router.post('/', localizacaoController.createLocalizacao);

// GET /api/localizacao/crianca/:crianca_id/latest - Obter a última localização de uma criança
router.get('/crianca/:crianca_id/latest', localizacaoController.getLatestLocalizacaoByCrianca);

// GET /api/localizacao/crianca/:crianca_id/history - Obter o histórico de localização de uma criança
router.get('/crianca/:crianca_id/history', localizacaoController.getLocalizacaoHistoryByCrianca);

// Obter localização específica por ID
router.get('/:id', localizacaoController.getLocalizacaoById);

// DELETE /api/localizacao/:id - Deletar um registro de localização
router.delete('/:id', localizacaoController.deleteLocalizacao);

export default router;
