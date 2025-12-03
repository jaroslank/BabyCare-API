import * as telefoneEmergenciaService from '../services/telefoneEmergenciaService.js';

// Criar telefone de emergência
async function criar(req, res, next) {
    try {
        const usuario_id = req.user.id;
        const telefone = await telefoneEmergenciaService.criar(req.body, usuario_id);
        res.status(201).json(telefone);
    } catch (error) {
        next(error);
    }
}

// Listar telefones
async function listar(req, res, next) {
    try {
        const usuario_id = req.user.id;
        const telefones = await telefoneEmergenciaService.listarPorUsuario(usuario_id);
        res.json(telefones);
    } catch (error) {
        next(error);
    }
}

// Buscar telefone por ID
async function buscarPorId(req, res, next) {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;
        const telefone = await telefoneEmergenciaService.buscarPorId(id, usuario_id);
        res.json(telefone);
    } catch (error) {
        next(error);
    }
}

// Atualizar telefone
async function atualizar(req, res, next) {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;
        const telefone = await telefoneEmergenciaService.atualizar(id, req.body, usuario_id);
        res.json(telefone);
    } catch (error) {
        next(error);
    }
}

// Remover telefone
async function remover(req, res, next) {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;
        const resultado = await telefoneEmergenciaService.remover(id, usuario_id);
        res.json(resultado);
    } catch (error) {
        next(error);
    }
}

export {
    criar,
    listar,
    buscarPorId,
    atualizar,
    remover
};
