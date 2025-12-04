/**
 * INSTRUÇÕES DE TESTE (Browser Console):
 * 
 * 1. Abra seu navegador e faça login na aplicação (https://babycare-api.onrender.com ou similar).
 * 2. Abra o Console do Desenvolvedor (F12 -> Console).
 * 3. Copie e cole todo o código abaixo e aperte Enter.
 */

(async () => {
    const API_URL = 'https://babycare-api.onrender.com/api'; // Ajuste a porta se necessário

    console.log('🚀 Iniciando teste de Refeições...');

    try {
        // 1. Buscar uma criança existente para associar a refeição
        console.log('1️⃣ Buscando crianças...');
        const resCriancas = await fetch(`${API_URL}/criancas`, { method: 'GET' });
        const criancas = await resCriancas.json();

        if (!criancas || criancas.length === 0) {
            console.error('❌ Nenhuma criança encontrada. Crie uma criança antes de testar refeições.');
            return;
        }

        const criancaId = criancas[0].id;
        console.log(`✅ Criança encontrada: ${criancas[0].nome} (ID: ${criancaId})`);

        // 2. Criar uma nova refeição
        console.log('2️⃣ Criando nova refeição...');
        const novaRefeicao = {
            crianca_id: criancaId,
            tipo_refeicao: 'almoco',
            descricao: 'Arroz, feijão e frango',
            horario: '12:30',
            data: new Date().toISOString().split('T')[0] // Hoje
        };

        const resCreate = await fetch(`${API_URL}/refeicoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaRefeicao)
        });

        if (!resCreate.ok) throw new Error(`Erro ao criar: ${resCreate.statusText}`);
        const refeicaoCriada = await resCreate.json();
        console.log('✅ Refeição criada com sucesso:', refeicaoCriada);

        // 3. Listar refeições
        console.log('3️⃣ Listando refeições...');
        const resList = await fetch(`${API_URL}/refeicoes`);
        const lista = await resList.json();
        console.log(`✅ Total de refeições encontradas: ${lista.length}`);
        console.table(lista);

        // 4. Atualizar a refeição
        console.log('4️⃣ Atualizando refeição...');
        const updateData = { descricao: 'Arroz, feijão, frango e salada' };
        const resUpdate = await fetch(`${API_URL}/refeicoes/${refeicaoCriada.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        const refeicaoAtualizada = await resUpdate.json();
        console.log('✅ Refeição atualizada:', refeicaoAtualizada);

        // 5. Deletar a refeição (Opcional - descomente para testar)
        /*
        console.log('5️⃣ Deletando refeição...');
        const resDelete = await fetch(`${API_URL}/refeicoes/${refeicaoCriada.id}`, { method: 'DELETE' });
        if (resDelete.ok) console.log('✅ Refeição deletada com sucesso.');
        else console.error('❌ Erro ao deletar.');
        */

        console.log('🎉 Teste finalizado!');

    } catch (err) {
        console.error('❌ Erro durante o teste:', err);
    }
})();
