/**
 * CONFIGURAÇÃO DO ORÇAMENTO COM IA - FUNCIONANDO
 * Sistema robusto que realmente processa orçamentos
 */

const ORCAMENTO_CONFIG = {
  // ⚠️ INSERIR UMA DAS CHAVES ABAIXO (escolha apenas uma)
  
  // Opção 1: OpenAI (RECOMENDADO - mais fácil)
  // Obtenha em: https://platform.openai.com/api-keys
  PROVIDER: 'openai', // ou 'google' ou 'azure'
  API_KEY: '', // Cole sua chave aqui
  
  // Tabela de preços completa - EDITE CONFORME NECESSÁRIO
  TABELA_PRECOS: {
    'hemograma completo': 45.00,
    'hemograma': 45.00,
    'glicose': 25.00,
    'glicose em jejum': 25.00,
    'glicemia': 25.00,
    'urina': 35.00,
    'urina rotina': 35.00,
    'sumário de urina': 35.00,
    'tsh': 50.00,
    'hormônio tsh': 50.00,
    't4': 55.00,
    't4 livre': 55.00,
    'colesterol total': 40.00,
    'colesterol': 40.00,
    'triglicérides': 40.00,
    'hdl': 35.00,
    'ldl': 35.00,
    'vldl': 35.00,
    'ácido úrico': 30.00,
    'uréia': 25.00,
    'creatinina': 25.00,
    'vitamina d': 75.00,
    'vitamina b12': 65.00,
    'ácido fólico': 55.00,
    'ferro': 35.00,
    'ferritina': 40.00,
    'psa': 60.00,
    'psa total': 60.00,
    'beta-hcg': 45.00,
    'bhcg': 45.00,
    'tsh + t4 livre': 95.00,
    'perfil tiroideo': 100.00,
    'lipidograma': 60.00,
    'perfil renal': 70.00,
    'perfil hepático': 80.00,
    'enzimas hepáticas': 80.00,
    'eletroforese de proteínas': 55.00,
    'proteína total': 25.00,
    'albumina': 25.00,
    'globulinas': 25.00,
    'bilirrubina': 30.00,
    'bilirrubina total': 30.00,
    'bilirrubina direta': 30.00,
    'fosfatase alcalina': 25.00,
    'gama gt': 25.00,
    'tgo': 25.00,
    'tgp': 25.00,
    'ast': 25.00,
    'alt': 25.00,
    'ldh': 30.00,
    'cpk': 40.00,
    'amilase': 35.00,
    'lipase': 35.00,
    'próstata': 40.00,
    'toque retal': 50.00,
    'coagulograma': 55.00,
    'tempo protrombina': 35.00,
    'tempo tromboplastina': 35.00,
    'plaquetas': 25.00,
    'contagem plaquetas': 25.00,
    'hematócrito': 25.00,
    'hemoglobina': 25.00,
    'vhs': 35.00,
    'velocidade hemossedimentação': 35.00,
    'pcr': 45.00,
    'proteína c reativa': 45.00,
    'fator reumatóide': 50.00,
    'fr': 50.00,
    'fta-abs': 55.00,
    'vdrl': 40.00,
    'hiv': 65.00,
    'teste hiv': 65.00,
    'hepatite a': 60.00,
    'hepatite b': 65.00,
    'hepatite c': 70.00,
    'toxoplasmose': 55.00,
    'rubéola': 50.00,
    'citomegalovírus': 60.00,
    'iga': 45.00,
    'igg': 45.00,
    'igm': 45.00,
    'imunoglobulinas': 50.00,
    'curva glicêmica': 75.00,
    'teste de tolerância': 80.00,
    'hemoglobina glicada': 55.00,
    'hba1c': 55.00,
    'frutosamina': 45.00,
    'troponina': 65.00,
    'mioglobina': 55.00,
    'bnp': 75.00,
    'peptídeo natriurético': 75.00,
    'lactato': 40.00,
    'espermograma': 85.00,
    'semem': 85.00,
    'análise de sêmen': 85.00,
    'cultura urina': 55.00,
    'urinocultura': 55.00,
    'coprocultura': 60.00,
    'hemocultura': 75.00,
    'bacterioscopia': 40.00,
    'teste de gravidez': 30.00,
    'ultra-som': 150.00,
    'ultrassom': 150.00,
    'radiografia': 120.00,
    'tomografia': 400.00,
    'ressonância': 600.00,
    'ecocardiograma': 250.00,
    'eletrocardiograma': 80.00,
    'ecg': 80.00,
    'endoscopia': 300.00,
    'colonoscopia': 350.00,
    'biopsia': 200.00,
    'biópsia': 200.00,
    'citologia': 90.00,
    'papanicolau': 85.00,
    'mamografia': 280.00,
    'densitometria': 180.00,
  }
};

// ==========================================
// FUNÇÃO PRINCIPAL - Gerar Orçamento
// ==========================================
async function gerarOrcamentoIA() {
  const nomePaciente = document.getElementById('iaOrcNome')?.value?.trim();
  const examesTexto = document.getElementById('iaOrcExames')?.value?.trim();
  const apiKey = document.getElementById('orcApiKey')?.value?.trim();
  
  // Validação
  if (!nomePaciente) {
    alert('⚠️ Por favor, insira o nome do paciente');
    return;
  }

  if (!examesTexto) {
    alert('⚠️ Por favor, insira pelo menos um exame');
    return;
  }

  if (!apiKey && ORCAMENTO_CONFIG.API_KEY === '') {
    alert('⚠️ ERRO: Chave API não configurada!\n\nOPÇÕES:\n1. Cole a chave no campo "Chave API" acima\n2. Ou configure em orçamento-config.js\n\nObtenha em: https://platform.openai.com/api-keys');
    return;
  }

  // Usar chave do campo ou da config
  const chaveUsada = apiKey || ORCAMENTO_CONFIG.API_KEY;

  // Mostrar loader
  document.getElementById('iaOrcLoader').classList.remove('hidden');
  document.getElementById('iaOrcResultado').classList.add('hidden');
  document.getElementById('orcLoaderMsg').textContent = '🔍 Processando pedido médico...';

  try {
    // PRIMEIRA TENTATIVA: Extrair exames com IA (se arquivo)
    const pedidoInput = document.getElementById('orcPedidoInput');
    let examesExtraidos = examesTexto;

    if (pedidoInput?.files?.length > 0) {
      document.getElementById('orcLoaderMsg').textContent = '📸 Lendo foto do pedido médico com IA...';
      examesExtraidos = await extrairExamesDeImagem(pedidoInput.files[0], chaveUsada);
      if (!examesExtraidos) {
        throw new Error('Falha ao processar imagem');
      }
    }

    // SEGUNDA FASE: Processar lista de exames
    document.getElementById('orcLoaderMsg').textContent = '💰 Consultando tabela de preços...';
    await new Promise(r => setTimeout(r, 800));

    // Normalizar e processar exames
    const examesLista = examesExtraidos
      .split(/,|;|\n/)
      .map(e => e.trim().toLowerCase())
      .filter(e => e.length > 3);

    if (examesLista.length === 0) {
      throw new Error('Nenhum exame válido foi encontrado');
    }

    // Calcular preços
    let precoTotal = 0;
    let descricaoExames = [];
    let naoEncontrados = [];

    examesLista.forEach(exame => {
      const preco = ORCAMENTO_CONFIG.TABELA_PRECOS[exame];
      
      if (preco) {
        precoTotal += preco;
        descricaoExames.push({
          nome: exame.charAt(0).toUpperCase() + exame.slice(1),
          preco: preco
        });
      } else {
        naoEncontrados.push(exame);
      }
    });

    if (descricaoExames.length === 0) {
      throw new Error('⚠️ Nenhum exame da nossa tabela foi reconhecido. Verifique os nomes dos exames.');
    }

    // Mostrar resultado
    document.getElementById('iaOrcLoader').classList.add('hidden');
    exibirResultadoOrcamento(nomePaciente, descricaoExames, precoTotal, naoEncontrados);

  } catch (erro) {
    document.getElementById('iaOrcLoader').classList.add('hidden');
    console.error('Erro completo:', erro);
    alert(`❌ ERRO: ${erro.message}\n\nDicas:\n• Verifique sua chave API\n• Confira nomes dos exames\n• Tente novamente em alguns segundos`);
  }
}

// ==========================================
// EXTRAIR EXAMES DE IMAGEM COM OPENAI
// ==========================================
async function extrairExamesDeImagem(arquivo, chaveAPI) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const base64 = e.target.result.split(',')[1];
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${chaveAPI}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4-vision-preview',
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'Analise esta imagem de um pedido médico. Extraia APENAS os nomes dos exames solicitados. Retorne como lista separada por vírgula, sem numeração. Exemplo: hemograma, glicose em jejum, tsh'
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
            max_tokens: 200
          })
        });

        if (!response.ok) {
          const erro = await response.json();
          throw new Error(`OpenAI: ${erro.error?.message || 'Erro na API'}`);
        }

        const data = await response.json();
        const exames = data.choices[0]?.message?.content || '';
        
        if (!exames) {
          throw new Error('IA não conseguiu extrair os exames da imagem');
        }

        resolve(exames);
      } catch (erro) {
        reject(erro);
      }
    };

    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsDataURL(arquivo);
  });
}

// ==========================================
// EXIBIR RESULTADO DO ORÇAMENTO
// ==========================================
function exibirResultadoOrcamento(nomePaciente, exames, total, naoEncontrados) {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  document.getElementById('orcDataHeader').textContent = dataAtual;
  
  let html = `
    <div class="space-y-3">
      <div class="pb-3 border-b border-slate-200">
        <p class="font-bold text-slate-800 text-lg">👤 ${nomePaciente}</p>
        <p class="text-xs text-slate-500">📅 ${dataAtual}</p>
      </div>
      
      <div class="space-y-2">
  `;

  exames.forEach(e => {
    html += `<div class="flex justify-between text-sm"><span>• ${e.nome}</span><span class="font-semibold text-slate-700">R$ ${e.preco.toFixed(2)}</span></div>`;
  });

  html += `
      </div>
      
      <div class="pt-3 border-t-2 border-slate-200 flex justify-between items-center">
        <span class="font-bold text-slate-800">TOTAL:</span>
        <span class="font-bold text-2xl text-emerald-600">R$ ${total.toFixed(2)}</span>
      </div>
  `;

  if (naoEncontrados.length > 0) {
    html += `
      <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
        <p class="text-xs font-semibold text-yellow-800">⚠️ Exames não encontrados na tabela:</p>
        <p class="text-xs text-yellow-700 mt-1">${naoEncontrados.join(', ')}</p>
        <p class="text-xs text-yellow-600 mt-2">Consulte conosco para cotação especial.</p>
      </div>
    `;
  }

  html += `</div>`;

  document.getElementById('iaOrcTexto').innerHTML = html;
  document.getElementById('iaOrcResultado').classList.remove('hidden');

  window.oracamentoAtual = {
    paciente: nomePaciente,
    exames: exames,
    total: total,
    data: dataAtual
  };
}

// ==========================================
// AÇÕES DOS BOTÕES
// ==========================================
window.enviarOrcamentoWhats = function() {
  if (!window.oracamentoAtual) return;
  
  const { paciente, exames, total, data } = window.oracamentoAtual;
  
  let msg = `🏥 *ORÇAMENTO - LABORATÓRIO CDA*\n\n`;
  msg += `📋 *Paciente:* ${paciente}\n`;
  msg += `📅 *Data:* ${data}\n\n`;
  msg += `*Exames Solicitados:*\n`;
  
  exames.forEach(e => {
    msg += `• ${e.nome}: R$ ${e.preco.toFixed(2)}\n`;
  });
  
  msg += `\n💰 *TOTAL: R$ ${total.toFixed(2)}*\n\n`;
  msg += `Clique para confirmar ou solicitar ajustes! ✅`;

  window.open(`https://wa.me/5527998980658?text=${encodeURIComponent(msg)}`, '_blank');
};

window.copyOrcamento = function() {
  if (!window.oracamentoAtual) return;
  
  const { paciente, exames, total, data } = window.oracamentoAtual;
  
  let txt = `ORÇAMENTO - LABORATÓRIO CDA\n`;
  txt += `${paciente}\n`;
  txt += `${data}\n\n`;
  txt += `EXAMES:\n`;
  
  exames.forEach(e => {
    txt += `• ${e.nome}: R$ ${e.preco.toFixed(2)}\n`;
  });
  
  txt += `\nTOTAL: R$ ${total.toFixed(2)}`;

  navigator.clipboard.writeText(txt).then(() => {
    alert('✅ Orçamento copiado!');
  }).catch(() => {
    alert('❌ Erro ao copiar');
  });
};

window.limparOrcamento = function() {
  document.getElementById('iaOrcNome').value = '';
  document.getElementById('iaOrcExames').value = '';
  document.getElementById('orcApiKey').value = '';
  document.getElementById('orcPedidoInput').value = '';
  document.getElementById('orcPedidoPreview').classList.add('hidden');
  document.getElementById('iaOrcResultado').classList.add('hidden');
  window.oracamentoAtual = null;
};

window.onPedidoSelecionado = function(event) {
  const preview = document.getElementById('orcPedidoPreview');
  preview.innerHTML = '';
  
  if (event.target.files.length > 0) {
    preview.classList.remove('hidden');
    
    for (let i = 0; i < event.target.files.length; i++) {
      const file = event.target.files[i];
      const item = document.createElement('div');
      item.className = 'flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-sm';
      item.innerHTML = `
        <span class="text-emerald-700 font-semibold flex items-center gap-2">
          <i class="fa-solid fa-file"></i> ${file.name}
        </span>
        <span class="text-emerald-600 text-xs font-semibold">${(file.size / 1024).toFixed(1)} KB</span>
      `;
      preview.appendChild(item);
    }
  } else {
    preview.classList.add('hidden');
  }
};
