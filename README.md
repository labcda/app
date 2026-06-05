# 🏥 Laboratório CDA - PWA

**Aplicativo Web Progressivo do Laboratório CDA** - Diagnóstico de Confiança

## 🚀 Funcionalidades

### ✅ Instalação como App Nativo
- **iPhone (Safari)**: Compartilhar → Adicionar à Tela de Início
- **Android (Chrome)**: Menu → Instalar Aplicativo
- **Funciona Offline**: Cache inteligente com Service Worker

### 📋 Recurso de Orçamento com IA
- ✓ Tire foto do pedido médico
- ✓ IA lê automaticamente os exames
- ✓ Calcula o preço com nossa tabela
- ✓ Envia direto via WhatsApp

### 🔧 Como Configurar a IA de Orçamento

#### 1. **Obtenha uma Chave API**

Escolha uma destas opções:

**Opção A: OpenAI (Recomendado - Mais fácil)**
- Acesse: https://platform.openai.com/api-keys
- Crie uma conta ou faça login
- Gere uma nova chave API
- Copia a chave (formato: `sk-...`)

**Opção B: Google Cloud Vision**
- Acesse: https://console.cloud.google.com
- Crie um projeto
- Ative a API: "Vision API"
- Crie uma chave de serviço (Service Account)

**Opção C: Azure Computer Vision**
- Acesse: https://portal.azure.com
- Crie um recurso "Computer Vision"
- Copie a chave de acesso

#### 2. **Adicione a Chave no Arquivo de Configuração**

Abra o arquivo `orçamento-config.js`:

```javascript
const ORCAMENTO_CONFIG = {
  API_KEY: 'sua-chave-api-aqui', // ← SUBSTITUA AQUI!
  // ... resto do código
}
```

**Exemplo com OpenAI:**
```javascript
const ORCAMENTO_CONFIG = {
  API_KEY: 'sk-proj-1A2B3C4D5E6F7G8H9I0J', // Sua chave real
  OPENAI_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
  OPENAI_MODEL: 'gpt-4-vision-preview',
  // ...
}
```

#### 3. **Tabela de Preços**

Atualize os preços dos exames em `orçamento-config.js`:

```javascript
TABELA_PRECOS: {
  'hemograma': 45.00,
  'glicose': 25.00,
  'urina': 35.00,
  'tsh': 50.00,
  // ... adicione mais exames
}
```

#### 4. **Teste**

- Abra o app
- Vá para "Orçamento"
- Tire uma foto de um pedido médico
- A IA deverá reconhecer automaticamente!

---

## 📱 Instalação para Usuários Finais

### iPhone (Safari)
1. Abra o app no Safari
2. Toque no ícone **Compartilhar** (↗️)
3. Procure por **"Adicionar à Tela de Início"**
4. Toque em **"Adicionar"**
✅ Pronto! O app está na sua tela inicial

### Android (Chrome)
1. Abra o app no Chrome
2. Toque no **Menu** (⋮)
3. Selecione **"Instalar aplicativo"**
4. Confirme a instalação
✅ Pronto! O app está em sua biblioteca

---

## 🛠️ Estrutura do Projeto

```
appteste/
├── index.html                 # App principal
├── manifest.json              # Metadados do PWA
├── service-worker.js          # Cache offline
├── orçamento-config.js        # Config da IA + Tabela de preços
├── install-info-modal.js      # Modal com instruções
└── logo CDA Transparente.png  # Logo do app
```

---

## 🔄 Service Worker

Implementado com estratégia **Network First**:
1. Tenta carregar da internet (mais rápido e atual)
2. Se falhar, usa o cache (funciona offline)
3. Atualiza o cache automaticamente

---

## 📞 Suporte

- **WhatsApp**: (27) 99898-0658
- **Instagram**: @cdalaboratorio
- **E-mail**: laboratoriocda.recepcao@gmail.com

---

## 📋 Checklist de Deploy

- [x] Service Worker corrigido
- [x] Manifest melhorado
- [x] Modal de instalação (iOS + Android)
- [x] Sistema de orçamento com IA
- [x] Cache offline funcional
- [] Chave API configurada (⚠️ VOCÊ PRECISA FAZER!)
- [ ] Testar em iPhone
- [ ] Testar em Android

---

**Laboratório CDA LTDA © 2026**
*Diagnósticos com Rigor Científico e Humanização*
