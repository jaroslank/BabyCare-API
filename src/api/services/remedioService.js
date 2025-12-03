import * as remedioRepository from '../repository/remedioRepository.js';
import * as criancaRepository from '../repository/criancaRepository.js';
import { ApiError } from '../../utils/ApiError.js';

// Criar remédio
async function criar(dados, usuario_id) {
    const { crianca_id, nome, horario, dosagem, observacoes, ativo } = dados;

    // Valida se a criança pertence ao usuário
    const crianca = await criancaRepository.buscarPorId(crianca_id);
    if (!crianca) {
        throw new ApiError('Criança não encontrada', 404);
    }
    if (crianca.usuario_id !== usuario_id) {
        throw new ApiError('Você não tem permissão para adicionar remédios a esta criança', 403);
    }

    const remedio = {
        crianca_id,
        nome,
        horario,
        dosagem,
        observacoes,
        ativo
    };

    return await remedioRepository.criar(remedio);
}

// Listar remédios do usuário
async function listarPorUsuario(usuario_id) {
    return await remedioRepository.listarPorUsuarioId(usuario_id);
}

// Buscar remédio por ID
async function buscarPorId(id, usuario_id) {
    const remedio = await remedioRepository.buscarPorId(id);
    if (!remedio) {
        throw new ApiError('Remédio não encontrado', 404);
    }

    // Valida propriedade via criança
    const crianca = await criancaRepository.buscarPorId(remedio.crianca_id);
    if (!crianca || crianca.usuario_id !== usuario_id) {
        throw new ApiError('Você não tem permissão para acessar este remédio', 403);
    }

    return remedio;
}

// Atualizar remédio
async function atualizar(id, dados, usuario_id) {
    const remedio = await buscarPorId(id, usuario_id); // Já valida propriedade

    const dadosAtualizacao = {
        nome: dados.nome || remedio.nome,
        horario: dados.horario || remedio.horario,
        dosagem: dados.dosagem !== undefined ? dados.dosagem : remedio.dosagem,
        observacoes: dados.observacoes !== undefined ? dados.observacoes : remedio.observacoes,
        ativo: dados.ativo !== undefined ? dados.ativo : remedio.ativo
    };

    return await remedioRepository.atualizar(id, dadosAtualizacao);
}

// Remover remédio
async function remover(id, usuario_id) {
    await buscarPorId(id, usuario_id); // Valida propriedade
    const removido = await remedioRepository.remover(id);
    if (!removido) {
        throw new ApiError('Falha ao remover remédio', 500);
    }
    return { message: 'Remédio removido com sucesso' };
}

export {
    criar,
    listarPorUsuario,
    buscarPorId,
    atualizar,
    remover
};
