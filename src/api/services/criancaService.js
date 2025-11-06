import * as criancaRepository from '../repository/criancaRepository.js';
import { ApiError } from '../../utils/ApiError.js';

// Cria uma nova criança ligada ao usuário
async function criar(crianca) {
    const { usuario_id, nome } = crianca;
    if (!usuario_id) throw new ApiError(400, 'ID do usuário é obrigatório.');
    if (!nome) throw new ApiError(400, 'Nome da criança é obrigatório.');

    // Validação mínima concluída — delega ao repository
    return await criancaRepository.criar(crianca);
}

// Lista todas as crianças de um usuário
async function listarPorUsuario(usuario_id) {
    if (!usuario_id) throw new ApiError(400, 'ID do usuário é obrigatório.');
    return await criancaRepository.listarPorUsuarioId(usuario_id);
}

// Busca uma criança por id e valida propriedade do usuário
async function buscarPorId(id, usuario_id) {
    if (!id) throw new ApiError(400, 'ID da criança é obrigatório.');
    const crianca = await criancaRepository.buscarPorId(id);
    if (!crianca) throw new ApiError(404, 'Criança não encontrada.');
    if (crianca.usuario_id !== usuario_id) throw new ApiError(403, 'Acesso negado.');
    return crianca;
}

// Atualiza uma criança (somente pelo dono)
async function atualizar(id, criancaData, usuario_id) {
    if (!id) throw new ApiError(400, 'ID da criança é obrigatório.');
    const existente = await criancaRepository.buscarPorId(id);
    if (!existente) throw new ApiError(404, 'Criança não encontrada.');
    if (existente.usuario_id !== usuario_id) throw new ApiError(403, 'Acesso negado.');

    const atualizada = await criancaRepository.atualizar(id, criancaData);
    return atualizada;
}

// Remove uma criança (somente pelo dono)
async function remover(id, usuario_id) {
    if (!id) throw new ApiError(400, 'ID da criança é obrigatório.');
    const existente = await criancaRepository.buscarPorId(id);
    if (!existente) throw new ApiError(404, 'Criança não encontrada.');
    if (existente.usuario_id !== usuario_id) throw new ApiError(403, 'Acesso negado.');

    return await criancaRepository.removerPorId(id);
}

export {
    criar,
    listarPorUsuario,
    buscarPorId,
    atualizar,
    remover
};