import * as telefoneEmergenciaRepository from '../repository/telefoneEmergenciaRepository.js';
import { ApiError } from '../../utils/ApiError.js';

// Criar telefone de emergência
async function criar(dados, usuario_id) {
    const { nome_contato, telefone } = dados;

    const telefoneEmergencia = {
        usuario_id,
        nome_contato,
        telefone
    };

    return await telefoneEmergenciaRepository.criar(telefoneEmergencia);
}

// Listar telefones de emergência do usuário
async function listarPorUsuario(usuario_id) {
    return await telefoneEmergenciaRepository.listarPorUsuarioId(usuario_id);
}

// Buscar telefone por ID
async function buscarPorId(id, usuario_id) {
    const telefone = await telefoneEmergenciaRepository.buscarPorId(id);
    if (!telefone) {
        throw new ApiError('Telefone de emergência não encontrado', 404);
    }

    // Valida propriedade
    if (telefone.usuario_id !== usuario_id) {
        throw new ApiError('Você não tem permissão para acessar este telefone', 403);
    }

    return telefone;
}

// Atualizar telefone
async function atualizar(id, dados, usuario_id) {
    const telefone = await buscarPorId(id, usuario_id); // Já valida propriedade

    const dadosAtualizacao = {
        nome_contato: dados.nome_contato || telefone.nome_contato,
        telefone: dados.telefone || telefone.telefone
    };

    return await telefoneEmergenciaRepository.atualizar(id, dadosAtualizacao);
}

// Remover telefone
async function remover(id, usuario_id) {
    await buscarPorId(id, usuario_id); // Valida propriedade
    const removido = await telefoneEmergenciaRepository.remover(id);
    if (!removido) {
        throw new ApiError('Falha ao remover telefone de emergência', 500);
    }
    return { message: 'Telefone de emergência removido com sucesso' };
}

export {
    criar,
    listarPorUsuario,
    buscarPorId,
    atualizar,
    remover
};
