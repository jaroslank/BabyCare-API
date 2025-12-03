import * as remedioService from '../services/remedioService.js';

// Criar remédio
async function criar(req, res, next) {
    try {
        const usuario_id = req.user.id;
        const remedio = await remedioService.criar(req.body, usuario_id);
        res.status(201).json(remedio);
    } catch (error) {
        next(error);
    }
}

// Listar remédios
async function listar(req, res, next) {
    try {
        const usuario_id = req.user.id;
        const remedios = await remedioService.listarPorUsuario(usuario_id);
        res.json(remedios);
    } catch (error) {
        next(error);
    }
}

// Buscar remédio por ID
async function buscarPorId(req, res, next) {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;
        const remedio = await remedioService.buscarPorId(id, usuario_id);
        res.json(remedio);
    } catch (error) {
        next(error);
    }
}

// Atualizar remédio
async function atualizar(req, res, next) {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;
        const remedio = await remedioService.atualizar(id, req.body, usuario_id);
        res.json(remedio);
    } catch (error) {
        next(error);
    }
}

// Remover remédio
async function remover(req, res, next) {
    try {
        const usuario_id = req.user.id;
        const { id } = req.params;
        const resultado = await remedioService.remover(id, usuario_id);
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
