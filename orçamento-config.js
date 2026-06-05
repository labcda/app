/**
 * CONFIGURAÇÃO DO ORÇAMENTO - API Integration
 * Adicione sua chave API válida aqui
 */

const ORCAMENTO_CONFIG = {
  // ⚠️ IMPORTANTE: Insira uma chave API válida de um serviço de análise de documentos
  // Opções recomendadas:
  // 1. Google Cloud Vision API
  // 2. Azure Computer Vision
  // 3. AWS Textract
  // 4. Anthropic Claude API
  // 5. OpenAI Vision API
  
  API_KEY: 'sua-chave-api-aqui', // Substitua pela sua chave real
  
  // Exemplo usando Google Cloud Vision (recomendado)
  GOOGLE_VISION_ENDPOINT: 'https://vision.googleapis.com/v1/images:annotateRequest',
  
  // Exemplo usando OpenAI
  OPENAI_ENDPOINT: 'https://api.openai.com/v1/chat/completions',
  OPENAI_MODEL: 'gpt-4-vision-preview',
  
  // Tabela de preços CDA (atualize conforme necessário)
  TABELA_PRECOS: {
    'hemograma': 45.00,
    'glicose': 25.00,
    'urina': 35.00,
    'tsh': 50.00,
    't4': 55.00,
    'colesterol': 40.00,
    'triglicérides': 40.00,
    'ácido úrico': 30.00,
    'creatinina': 25.00,
    'ureia': 25.00,
    'vitamina d': 75.00,
    'vitamina b12': 65.00,
    'ferro': 35.00,
    'ferritina': 40.00,
    'psa': 60.00,
    'beta-hcg': 45.00,
  }
};

// Função para validar a chave API
function validarChaveAPI(chave) {
  if (!chave || chave === 'sua-chave-api-aqui') {
    alert('⚠️ ERRO: Chave API não configurada!\n\nPor favor, insira uma chave API válida em orçamento-config.js');
    return false;
  }
  return true;
}

// Função para processar imagem com IA
async function processarImagemComIA(arquivo) {
  if (!validarChaveAPI(ORCAMENTO_CONFIG.API_KEY)) return null;
  
  try {
    const base64 = await lerArquivoComoBas64(arquivo);
    
    // Usar OpenAI como exemplo (mais fácil de configurar)
    const response = await fetch(ORCAMENTO_CONFIG.OPENAI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ORCAMENTO_CONFIG.API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: ORCAMENTO_CONFIG.OPENAI_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analise este pedido médico e extraia APENAS os nomes dos exames solicitados. Retorne como uma lista separada por vírgula. Exemplo: hemograma, glicose, urina'
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (erro) {
    console.error('Erro ao processar imagem:', erro);
    alert('❌ Erro ao processar imagem. Verifique sua chave API e tente novamente.');
    return null;
  }
}

// Função auxiliar para ler arquivo como Base64
function lerArquivoComoBas64(arquivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(arquivo);
  });
}
