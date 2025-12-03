import * as refeicaoService from '../services/refeicaoService.js';
import { validationResult } from 'express-validator';

// Cria uma nova refeição (somente usuário autenticado)
const createRefeicao = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const {
            crianca_id,
            tipo_refeicao,
            tipo,
            descricao,
            observacoes,
            horario,
            data
        } = req.body;

        const payload = {
            usuario_id: req.user && req.user.id,
            crianca_id,
            tipo_refeicao: tipo_refeicao || tipo,
            descricao: descricao || observacoes,
            horario,
            data
        };

        const refeicao = await refeicaoService.criar(payload);
        return res.status(201).json(refeicao);
    } catch (error) {
        return next(error);
    }
};

// Lista refeições do usuário autenticado
const getRefeicoes = async (req, res, next) => {
    try {
        const usuario_id = req.user && req.user.id;
        const refeicoes = await refeicaoService.listarPorUsuario(usuario_id);
        return res.status(200).json(refeicoes);
    } catch (error) {
        return next(error);
    }
};

// Busca uma refeição pelo id (verifica propriedade)
const getRefeicaoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const refeicao = await refeicaoService.buscarPorId(id, req.user && req.user.id);
        return res.status(200).json(refeicao);
    } catch (error) {
        return next(error);
    }
};

// Atualiza uma refeição (somente dono)
const updateRefeicao = async (req, res, next) => {
    try {
        const { id } = req.params;
        const atualizado = await refeicaoService.atualizar(id, req.body, req.user && req.user.id);
        return res.status(200).json(atualizado);
    } catch (error) {
        return next(error);
    }
};

// Remove uma refeição
const deleteRefeicao = async (req, res, next) => {
    try {
        const { id } = req.params;
        await refeicaoService.remover(id, req.user && req.user.id);
        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
};

export {
    createRefeicao,
    getRefeicoes,
    getRefeicaoById,
    updateRefeicao,
    deleteRefeicao
};
