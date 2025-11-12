import * as criancaService from '../services/criancaService.js';
import { validationResult } from 'express-validator';

// Cria uma nova criança (somente usuário autenticado)
const createCrianca = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { nome, data_nascimento, avatar_url } = req.body;
        const payload = {
            usuario_id: req.user && req.user.id,
            nome,
            data_nascimento,
            avatar_url
        };

        const crianca = await criancaService.criar(payload);
        return res.status(201).json(crianca);
    } catch (error) {
        return next(error);
    }
};

// Lista crianças do usuário autenticado
const getCriancas = async (req, res, next) => {
    try {
        const usuario_id = req.user && req.user.id;
        const criancas = await criancaService.listarPorUsuario(usuario_id);
        return res.status(200).json(criancas);
    } catch (error) {
        return next(error);
    }
};

// Busca uma criança pelo id (verifica propriedade)
const getCriancaById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const crianca = await criancaService.buscarPorId(id, req.user && req.user.id);
        return res.status(200).json(crianca);
    } catch (error) {
        return next(error);
    }
};

// Atualiza uma criança (somente dono)
const updateCrianca = async (req, res, next) => {
    try {
        const { id } = req.params;
        const atualizado = await criancaService.atualizar(id, req.body, req.user && req.user.id);
        return res.status(200).json(atualizado);
    } catch (error) {
        return next(error);
    }
};

// Remove uma criança (somente dono)
const deleteCrianca = async (req, res, next) => {
    try {
        const { id } = req.params;
        await criancaService.remover(id, req.user && req.user.id);
        return res.status(204).send();
    } catch (error) {
        return next(error);
    }
};

export {
    createCrianca,
    getCriancas,
    getCriancaById,
    updateCrianca,
    deleteCrianca
};
