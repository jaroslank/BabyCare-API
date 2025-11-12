import * as localizacaoService from '../services/localizacaoService.js';

export const createLocalizacao = async (req, res, next) => {
    try {
        // MUDANÇA: Passar req.body e o ID do usuário logado
        const localizacao = await localizacaoService.createLocalizacao(req.body, req.user.id);
        res.status(201).json(localizacao);
    } catch (error) {
        next(error);
    }
};

export const getLatestLocalizacao = async (req, res, next) => {
    try {
        const { crianca_id } = req.params;
        // MUDANÇA: Passar o ID da criança e o ID do usuário logado
        const localizacao = await localizacaoService.getLatestLocalizacao(crianca_id, req.user.id);
        res.json(localizacao);
    } catch (error) {
        next(error);
    }
};

export const getAllLocalizacoes = async (req, res, next) => {
    try {
        const { crianca_id } = req.params;
        // MUDANÇA: Passar o ID da criança e o ID do usuário logado
        const localizacoes = await localizacaoService.getAllLocalizacoes(crianca_id, req.user.id);
        res.json(localizacoes);
    } catch (error) {
        next(error);
    }
};

export const getLocalizacaoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        // MUDANÇA: Passar o ID da localização e o ID do usuário logado
        const localizacao = await localizacaoService.getLocalizacaoById(id, req.user.id);
        res.json(localizacao);
    } catch (error) {
        next(error);
    }
};

export const deleteLocalizacao = async (req, res, next) => {
    try {
        const { id } = req.params;
        // MUDANÇA: Passar o ID da localização e o ID do usuário logado
        const localizacao = await localizacaoService.deleteLocalizacao(id, req.user.id);
        res.json(localizacao);
    } catch (error) {
        next(error);
    }
};