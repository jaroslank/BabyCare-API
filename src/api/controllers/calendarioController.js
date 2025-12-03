import * as calendarioService from '../services/calendarioService.js';

// POST /api/calendario/eventos - Criar novo evento
async function criarEvento(req, res, next) {
    try {
        const usuario = req.user;
        
        if (!usuario || !usuario.google_access_token) {
            return res.status(401).json({ 
                message: 'Usuário não autenticado ou sem permissão para acessar o Google Calendar. Faça login novamente.' 
            });
        }

        const { titulo, descricao, data_inicio, data_fim } = req.body;

        if (!titulo || !data_inicio || !data_fim) {
            return res.status(400).json({ 
                message: 'Título, data_inicio e data_fim são obrigatórios' 
            });
        }

        const evento = {
            titulo,
            descricao,
            data_inicio,
            data_fim
        };

        const eventoGoogle = await calendarioService.criarEvento(usuario, evento);
        
        res.status(201).json({ 
            message: 'Evento criado no Google Calendar com sucesso',
            evento: eventoGoogle
        });
    } catch (error) {
        next(error);
    }
}

// GET /api/calendario/eventos - Listar eventos
async function listarEventos(req, res, next) {
    try {
        const usuario = req.user;
        
        if (!usuario || !usuario.google_access_token) {
            return res.status(401).json({ 
                message: 'Usuário não autenticado ou sem permissão para acessar o Google Calendar. Faça login novamente.' 
            });
        }

        const { data_inicio, data_fim } = req.query;

        const eventos = await calendarioService.listarEventos(usuario, data_inicio, data_fim);
        
        res.status(200).json(eventos);
    } catch (error) {
        // Se o erro for de scopes insuficientes, retorna mensagem específica
        if (error.message && error.message.includes('insufficient authentication scopes')) {
            return res.status(403).json({ 
                message: 'Permissões insuficientes. Faça logout e login novamente para autorizar acesso ao Google Calendar.' 
            });
        }
        next(error);
    }
}

// GET /api/calendario/eventos/:id - Buscar evento específico
async function buscarEvento(req, res, next) {
    try {
        const usuario = req.user;
        
        if (!usuario || !usuario.google_access_token) {
            return res.status(401).json({ 
                message: 'Usuário não autenticado ou sem permissão para acessar o Google Calendar. Faça login novamente.' 
            });
        }

        const { id } = req.params;

        const evento = await calendarioService.buscarEvento(usuario, id);
        
        res.status(200).json(evento);
    } catch (error) {
        next(error);
    }
}

// PUT /api/calendario/eventos/:id - Atualizar evento
async function atualizarEvento(req, res, next) {
    try {
        const usuario = req.user;
        
        if (!usuario || !usuario.google_access_token) {
            return res.status(401).json({ 
                message: 'Usuário não autenticado ou sem permissão para acessar o Google Calendar. Faça login novamente.' 
            });
        }

        const { id } = req.params;
        const { titulo, descricao, data_inicio, data_fim } = req.body;

        if (!titulo || !data_inicio || !data_fim) {
            return res.status(400).json({ 
                message: 'Título, data_inicio e data_fim são obrigatórios' 
            });
        }

        const evento = {
            titulo,
            descricao,
            data_inicio,
            data_fim
        };

        const eventoAtualizado = await calendarioService.atualizarEvento(usuario, id, evento);
        
        res.status(200).json({ 
            message: 'Evento atualizado no Google Calendar com sucesso',
            evento: eventoAtualizado
        });
    } catch (error) {
        next(error);
    }
}

// DELETE /api/calendario/eventos/:id - Deletar evento
async function deletarEvento(req, res, next) {
    try {
        const usuario = req.user;
        
        if (!usuario || !usuario.google_access_token) {
            return res.status(401).json({ 
                message: 'Usuário não autenticado ou sem permissão para acessar o Google Calendar. Faça login novamente.' 
            });
        }

        const { id } = req.params;

        const resultado = await calendarioService.deletarEvento(usuario, id);
        
        res.status(200).json(resultado);
    } catch (error) {
        next(error);
    }
}

export {
    criarEvento,
    listarEventos,
    buscarEvento,
    atualizarEvento,
    deletarEvento
};
