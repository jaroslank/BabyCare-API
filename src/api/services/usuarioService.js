import * as usuarioRepository from '../repository/usuarioRepository.js';
// O caminho foi corrigido de '../error/ApiError.js' para o local correto.
import { ApiError } from '../../utils/ApiError.js';

async function listar() {
    return await usuarioRepository.listar();
}

async function buscarPorId(id) {
    if (!id) {
        throw new ApiError(400, 'ID de usuário inválido.');
    }

    const usuario = await usuarioRepository.buscarPorId(id);
    if (!usuario) {
        throw new ApiError(404, 'Usuário não encontrado.');
    }
    return usuario;
}

// A função agora desativa o usuário
async function deletar(id) {
    if (!id) {
        throw new ApiError(400, 'ID de usuário inválido.');
    }

    const sucesso = await usuarioRepository.desativar(id);
    if (!sucesso) {
        throw new ApiError(404, 'Usuário não encontrado para desativar.');
    }

    return;
}

async function reativar(id) {
    if (!id) {
        throw new ApiError(400, 'ID de usuário inválido.');
    }

    const sucesso = await usuarioRepository.reativar(id);
    if (!sucesso) {
        throw new ApiError(404, 'Usuário não encontrado para reativar.');
    }

    // Retorna o usuário completo após a reativação
    return await usuarioRepository.buscarPorId(id);
}

export {
    listar,
    buscarPorId,
    deletar,
    reativar
};
