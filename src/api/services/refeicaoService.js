import * as refeicaoRepository from '../repository/refeicaoRepository.js';
import * as criancaRepository from '../repository/criancaRepository.js';
import { ApiError } from '../../utils/ApiError.js';

// Cria uma nova refeição ligada ao usuário (verifica propriedade da criança)
async function criar(refeicao) {
    const { usuario_id, crianca_id, tipo_refeicao } = refeicao;
    if (!usuario_id) throw new ApiError(400, 'ID do usuário é obrigatório.');
    if (!crianca_id) throw new ApiError(400, 'ID da criança é obrigatório.');

    const crianca = await criancaRepository.buscarPorId(crianca_id);
    if (!crianca) throw new ApiError(404, 'Criança não encontrada.');
    if (crianca.usuario_id !== usuario_id) throw new ApiError(403, 'Acesso negado.');

    // tipo_refeicao can be optional (db default 'outro')
    return await refeicaoRepository.criar(refeicao);
}

// Lista todas as refeições de um usuário
async function listarPorUsuario(usuario_id) {
    if (!usuario_id) throw new ApiError(400, 'ID do usuário é obrigatório.');
    return await refeicaoRepository.listarPorUsuarioId(usuario_id);
}

// Busca uma refeição por id e valida propriedade do usuário
async function buscarPorId(id, usuario_id) {
    if (!id) throw new ApiError(400, 'ID da refeição é obrigatório.');
    const refeicao = await refeicaoRepository.buscarPorId(id);
    if (!refeicao) throw new ApiError(404, 'Refeição não encontrada.');

    const crianca = await criancaRepository.buscarPorId(refeicao.crianca_id);
    if (!crianca) throw new ApiError(404, 'Criança não encontrada.');
    if (crianca.usuario_id !== usuario_id) throw new ApiError(403, 'Acesso negado.');

    return refeicao;
}

// Atualiza uma refeição (somente pelo dono)
async function atualizar(id, refeicaoData, usuario_id) {
    if (!id) throw new ApiError(400, 'ID da refeição é obrigatório.');
    const existente = await refeicaoRepository.buscarPorId(id);
    if (!existente) throw new ApiError(404, 'Refeição não encontrada.');

    const criancaExistente = await criancaRepository.buscarPorId(existente.crianca_id);
    if (!criancaExistente) throw new ApiError(404, 'Criança não encontrada.');
    if (criancaExistente.usuario_id !== usuario_id) throw new ApiError(403, 'Acesso negado.');

    // If changing the target child, ensure the new child belongs to the same user
    if (refeicaoData.crianca_id && refeicaoData.crianca_id !== existente.crianca_id) {
        const novaCrianca = await criancaRepository.buscarPorId(refeicaoData.crianca_id);
        if (!novaCrianca) throw new ApiError(404, 'Criança (nova) não encontrada.');
        if (novaCrianca.usuario_id !== usuario_id) throw new ApiError(403, 'Acesso negado para a nova criança.');
    }

    const atualizada = await refeicaoRepository.atualizar(id, refeicaoData);
    return atualizada;
}

// Remove uma refeição (somente pelo dono)
async function remover(id, usuario_id) {
    if (!id) throw new ApiError(400, 'ID da refeição é obrigatório.');
    const existente = await refeicaoRepository.buscarPorId(id);
    if (!existente) throw new ApiError(404, 'Refeição não encontrada.');

    const crianca = await criancaRepository.buscarPorId(existente.crianca_id);
    if (!crianca) throw new ApiError(404, 'Criança não encontrada.');
    if (crianca.usuario_id !== usuario_id) throw new ApiError(403, 'Acesso negado.');

    return await refeicaoRepository.removerPorId(id);
}

export {
    criar,
    listarPorUsuario,
    buscarPorId,
    atualizar,
    remover
};
