# Testes da API - Remédios e Telefones de Emergência

## 🚀 Pré-requisitos
Antes de testar, certifique-se de:
1. O servidor está rodando: `npm start`
2. Você está autenticado (faça login via Google primeiro)
3. Você possui pelo menos uma criança cadastrada (para testar remédios)

## 📋 Testes de Remédios (`/api/remedios`)

### 1. Criar Remédio
```bash
curl -X POST https://babycare-api.onrender.com/api/remedios \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "crianca_id": "UUID_DA_CRIANCA",
    "nome": "Paracetamol",
    "horario": "08:00",
    "dosagem": "5ml",
    "observacoes": "Tomar após café da manhã",
    "ativo": true
  }'
```

### 2. Listar Remédios
```bash
curl -X GET https://babycare-api.onrender.com/api/remedios \
  -b cookies.txt
```

### 3. Buscar Remédio por ID
```bash
curl -X GET https://babycare-api.onrender.com/api/remedios/UUID_DO_REMEDIO \
  -b cookies.txt
```

### 4. Atualizar Remédio
```bash
curl -X PUT https://babycare-api.onrender.com/api/remedios/UUID_DO_REMEDIO \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "dosagem": "10ml",
    "observacoes": "Aumentar dosagem conforme prescrição médica"
  }'
```

### 5. Deletar Remédio
```bash
curl -X DELETE https://babycare-api.onrender.com/api/remedios/UUID_DO_REMEDIO \
  -b cookies.txt
```

---

## 📞 Testes de Telefones de Emergência (`/api/telefones-emergencia`)

### 1. Criar Telefone de Emergência
```bash
curl -X POST https://babycare-api.onrender.com/api/telefones-emergencia \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "nome_contato": "SAMU",
    "telefone": "192"
  }'
```

### 2. Listar Telefones de Emergência
```bash
curl -X GET https://babycare-api.onrender.com/api/telefones-emergencia \
  -b cookies.txt
```

### 3. Buscar Telefone por ID
```bash
curl -X GET https://babycare-api.onrender.com/api/telefones-emergencia/UUID_DO_TELEFONE \
  -b cookies.txt
```

### 4. Atualizar Telefone
```bash
curl -X PUT https://babycare-api.onrender.com/api/telefones-emergencia/UUID_DO_TELEFONE \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "nome_contato": "SAMU - Emergência",
    "telefone": "192"
  }'
```

### 5. Deletar Telefone
```bash
curl -X DELETE https://babycare-api.onrender.com/api/telefones-emergencia/UUID_DO_TELEFONE \
  -b cookies.txt
```

---

## 🍪 Salvando Cookies de Sessão

Para testar via curl, você precisa salvar os cookies da sessão após fazer login:

```bash
# Fazer login e salvar cookies
curl -X GET https://babycare-api.onrender.com/auth/google \
  -c cookies.txt \
  -L
```

Ou simplesmente faça login no navegador e copie o cookie `connect.sid` das DevTools.

---

## ✅ Testes Esperados

### Remédios
- ✅ Criar remédio vinculado a criança do usuário
- ✅ Listar todos os remédios das crianças do usuário
- ✅ Buscar remédio específico (validação de propriedade)
- ✅ Atualizar dosagem, horário, observações
- ✅ Desativar/deletar remédio
- ❌ Tentar criar remédio para criança de outro usuário (deve retornar 403)

### Telefones de Emergência
- ✅ Criar contato de emergência
- ✅ Listar todos os contatos do usuário
- ✅ Buscar contato específico (validação de propriedade)
- ✅ Atualizar nome/telefone
- ✅ Deletar contato
- ❌ Tentar acessar contato de outro usuário (deve retornar 403)

---

## 🧪 Testes via Front-End

Após criar as páginas `remedios.html` e `telefones.html`, teste:

1. **Remédios**:
   - Selecionar criança no dropdown
   - Inserir nome, horário, dosagem
   - Marcar como ativo/inativo
   - Editar remédio existente
   - Deletar remédio

2. **Telefones de Emergência**:
   - Adicionar contato (nome + telefone)
   - Listar todos os contatos
   - Editar contato
   - Deletar contato

---

## 📝 Notas
- Todos os endpoints requerem autenticação via `isLoggedIn` middleware
- UUIDs são gerados automaticamente pelo PostgreSQL
- Remédios são vinculados a crianças (cascade delete)
- Telefones são vinculados diretamente ao usuário (cascade delete)
