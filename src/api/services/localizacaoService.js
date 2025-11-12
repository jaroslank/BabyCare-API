import * as localizacaoRepository from '../repository/localizacaoRepository.js';
// ADIÇÃO: Importar o repositório da criança para checar permissão
import * as criancaRepository from '../repository/criancaRepository.js';
import { ApiError } from '../../utils/ApiError.js';
// ADIÇÃO: Importar o cliente do Google Maps
import { Client } from "@googlemaps/google-maps-services-js";
import 'dotenv/config';

// --- ADIÇÕES ---
// Instancia o cliente do Google Maps
const mapsClient = new Client({});
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// Função helper para checar se o usuário logado é dono da criança
async function checkPermission(crianca_id, usuario_id) {
    if (!usuario_id) {
        throw new ApiError('Usuário não autenticado', 401);
    }
    const crianca = await criancaRepository.buscarPorId(crianca_id);
    if (!crianca) {
        throw new ApiError('Criança não encontrada.', 404);
    }
    // Compara o dono da criança com o usuário logado
    if (crianca.usuario_id !== usuario_id) {
        throw new ApiError('Acesso não autorizado a esta criança.', 403);
    }
}

// Função helper para buscar o endereço no Google
async function getAddressFromCoordinates(latitude, longitude) {
    if (!GOOGLE_MAPS_API_KEY) {
        console.warn('GOOGLE_MAPS_API_KEY não definida. Pulando busca de endereço.');
        return 'Endereço não obtido (API Key ausente)';
    }
    try {
        const response = await mapsClient.reverseGeocode({
            params: {
                latlng: { latitude, longitude },
                key: GOOGLE_MAPS_API_KEY,
            },
            timeout: 2000,
        });
        if (response.data.results && response.data.results[0]) {
            return response.data.results[0].formatted_address;
        }
        return 'Endereço não encontrado';
    } catch (e) {
        console.error("Erro na API Google Reverse Geocode:", e.message);
        return 'Erro ao buscar endereço';
    }
}
// --- FIM DAS ADIÇÕES ---


// MUDANÇA: Aceitar 'usuario_id' para checar permissão
export const createLocalizacao = async (localizacaoData, usuario_id) => {
    const { crianca_id, latitude, longitude } = localizacaoData;

    if (!crianca_id || latitude === undefined || longitude === undefined) {
        throw new ApiError('Dados de localização incompletos (crianca_id, latitude, longitude são obrigatórios)', 400);
    }
    
    // 1. Checa a permissão
    await checkPermission(crianca_id, usuario_id);

    // 2. Busca o endereço no Google
    const endereco = await getAddressFromCoordinates(latitude, longitude);

    try {
        // 3. Salva no banco
        return await localizacaoRepository.create({
            crianca_id,
            endereco, // Salva o endereço obtido
            latitude,
            longitude
        });
    } catch (error) {
        throw new ApiError('Erro ao criar localização', 500);
    }
};

// MUDANÇA: Aceitar 'usuario_id' para checar permissão
export const getLatestLocalizacao = async (crianca_id, usuario_id) => {
    await checkPermission(crianca_id, usuario_id); // Checa permissão
    try {
        const localizacao = await localizacaoRepository.findLatestByCriancaId(crianca_id);
        if (!localizacao) {
            throw new ApiError('Localização não encontrada', 404);
        }
        return localizacao;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError('Erro ao buscar localização', 500);
    }
};

// MUDANÇA: Aceitar 'usuario_id' para checar permissão
export const getAllLocalizacoes = async (crianca_id, usuario_id) => {
    await checkPermission(crianca_id, usuario_id); // Checa permissão
    try {
        const localizacoes = await localizacaoRepository.findAllByCriancaId(crianca_id);
        return localizacoes;
    } catch (error) {
        throw new ApiError('Erro ao buscar histórico de localizações', 500);
    }
};

// MUDANÇA: Aceitar 'usuario_id' para checar permissão
export const getLocalizacaoById = async (id, usuario_id) => {
    try {
        const localizacao = await localizacaoRepository.findById(id);
        if (!localizacao) {
            throw new ApiError('Localização não encontrada', 404);
        }
        // Checa permissão DEPOIS de buscar a localização
        await checkPermission(localizacao.crianca_id, usuario_id);
        return localizacao;
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError('Erro ao buscar localização', 500);
    }
};

// MUDANÇA: Aceitar 'usuario_id' para checar permissão
export const deleteLocalizacao = async (id, usuario_id) => {
    // Reutiliza a função anterior para buscar E checar a permissão
    await getLocalizacaoById(id, usuario_id); 
    
    try {
        const deletedLocalizacao = await localizacaoRepository.deleteById(id);
        return deletedLocalizacao;
    } catch (error) {
        throw new ApiError('Erro ao deletar localização', 500);
    }
};