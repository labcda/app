var SPREADSHEET_ID  = '1dmz0TRnOupQoJCXIT5EOUwWsHdkxMHBPPzTCM65RnfE';
var TOKEN           = 'CDA-2025-xK9#mPqL';
var DRIVE_FOLDER_ID = '1AT2pQJhV-5oM5xGoKFkUJdb_EJfcJbc7';
var BOLETOS_PASTA_REFERENCIA_ID = '15_D-m_ZFmYGf6gajqEywE4jR_iN9XHUT'; // pasta de espelhos de 2026

// ==================== ROTEAMENTO ====================

function doGet(e) {
  var params = e.parameter || {};
  if (params.token !== TOKEN) return resposta({ ok: false, erro: 'Token inválido' });
  var action = params.action || '';
  if (action === 'verificarLogin')         return resposta(verificarLogin(params));
  if (action === 'login')                  return resposta(verificarLogin(params));
  if (action === 'contarOrcamentos')       return resposta(contarOrcamentos(params.mesAno || ''));
  if (action === 'listarOrcamentos')       return resposta(listarOrcamentos(params));
  if (action === 'contarRegistroAgen')     return resposta(contarRegistroAgen(params.mes || ''));
  if (action === 'listarRegistroAgen')     return resposta(listarRegistroAgen(params));
  if (action === 'contarAgendamentos')     return resposta(contarRegistroAgen(params.mes || ''));
  if (action === 'listarAgendamentos')     return resposta(listarRegistroAgen(params));
  if (action === 'contarAppOrcamentos')    return resposta(contarAppOrcamentos(params.mesAno || ''));
  if (action === 'listarAppOrcamentos')    return resposta(listarAppOrcamentos(params));
  if (action === 'contarAppRegistroAgen')  return resposta(contarAppRegistroAgen(params.mes || ''));
  if (action === 'listarAppRegistroAgen')  return resposta(listarAppRegistroAgen(params));
  if (action === 'contarRecoletas')        return resposta(contarRecoletas());
  if (action === 'consultarRecoletas')     return resposta(listarRecoletas(params));
  if (action === 'listarAtividades')       return resposta(listarAtividades());
  if (action === 'listarRecoletas')        return resposta(listarRecoletas(params));
  if (action === 'relatorioRecoletas')     return resposta(relatorioRecoletas(params));
  if (action === 'listarContatosRecoleta') return resposta(listarContatosRecoleta(params));
  if (action === 'listarBoletos')          return resposta(listarBoletos(params));
  if (action === 'listarParcelasBoletos')  return resposta(listarParcelasBoletos(params));
  if (action === 'listarEventosCalendario') return resposta(listarEventosCalendario(params));
  if (action === 'resumoNPS')              return resposta(resumoNPS());
  if (action === 'listarNPS')               return resposta(listarNPS());
  if (action === 'listarUsuarios') {
    if (!validarSessaoAdmin(params.sessionToken)) return resposta({ ok: false, erro: 'Não autorizado — faça login com uma conta de administrador.' });
    return resposta(listarUsuarios());
  }
  if (action === 'listar')                 return resposta(listarHorariosOcupados(params.data || ''));
  return resposta({ ok: false, erro: 'Acao nao reconhecida: ' + action });
}

function doPost(e) {
  var dados;
  try { dados = JSON.parse(e.postData.contents); } catch(ex) { return resposta({ ok: false, erro: 'JSON inválido' }); }
  if (dados.token !== TOKEN) return resposta({ ok: false, erro: 'Token inválido' });
  var action = dados.action || '';
  if (action === 'verificarLogin')         return resposta(verificarLogin(dados));
  if (action === 'login')                  return resposta(verificarLogin(dados));
  if (action === 'salvarOrcamento')        return resposta(salvarOrcamento(dados));
  if (action === 'salvarAppOrcamento')     return resposta(salvarAppOrcamento(dados));
  if (action === 'salvarAppRegistroAgen')  return resposta(salvarAppRegistroAgen(dados));
  if (action === 'salvarRegistroAgen')     return resposta(salvarRegistroAgen(dados));
  if (action === 'salvarAgendamentoDash')  return resposta(salvarRegistroAgenComCalendario(dados));
  if (action === 'criar')                  return resposta(salvarRegistroAgenComCalendario(dados));
  if (action === 'salvarRecoleta')         return resposta(salvarRecoleta(dados));
  if (action === 'atualizarRecoleta')      return resposta(atualizarRecoleta(dados));
  if (action === 'registrarContatoRecoleta') return resposta(registrarContatoRecoleta(dados));
  if (action === 'salvarBoleto')           return resposta(salvarBoleto(dados));
  if (action === 'atualizarRecebimento')   return resposta(atualizarRecebimento(dados));
  if (action === 'atualizarFinanceiro')    return resposta(atualizarFinanceiro(dados));
  if (action === 'darBaixaParcela')        return resposta(darBaixaParcela(dados));
  if (action === 'atualizarVencimentoParcela') return resposta(atualizarVencimentoParcela(dados));
  if (action === 'uploadEspelhoBoleto')    return resposta(uploadEspelhoBoleto(dados));
  if (action === 'salvarNPS')              return resposta(salvarNPS(dados));
  if (action === 'cancelarPorDados')       return resposta(cancelarPorDados(dados));
  if (action === 'cadastrarUsuario' || action === 'atualizarPermissoesUsuario' || action === 'excluirUsuario') {
    if (!validarSessaoAdmin(dados.sessionToken)) return resposta({ ok: false, erro: 'Não autorizado — faça login com uma conta de administrador.' });
  }
  if (action === 'cadastrarUsuario')       return resposta(cadastrarUsuario(dados));
  if (action === 'atualizarPermissoesUsuario') return resposta(atualizarPermissoesUsuario(dados));
  if (action === 'excluirUsuario')         return resposta(excluirUsuario(dados));
  if (action === 'excluirRecoleta')        return resposta(excluirRecoleta(dados));
  if (action === 'uploadPDF')              return resposta(uploadPDF(dados));
  if (action === 'marcarComparecimento')   return resposta(marcarComparecimento(dados));
  if (action === 'cancelarAgendamento')    return resposta(cancelarAgendamento(dados));
  return resposta({ ok: false, erro: 'Action POST nao encontrada: ' + action });
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatarData(val) {
  if (!val) return '';
  if (typeof val === 'object' && val.getTime) {
    return Utilities.formatDate(val, Session.getScriptTimeZone(), 'dd/MM/yyyy');
  }
  return val.toString();
}

// Colunas de HORA às vezes ficam formatadas como horário pelo Sheets, e af
// virem objeto Date (base 30/12/1899) em vez de texto — .toString() nesse
// caso devolve a data inteira por extenso. Formata como "HH:mm" quando for
// esse o caso, preservando o texto puro quando já estiver digitado assim.
function formatarHora(val) {
  if (!val) return '';
  if (typeof val === 'object' && val.getTime) {
    return Utilities.formatDate(val, Session.getScriptTimeZone(), 'HH:mm');
  }
  return val.toString();
}

// ==================== SHEETS ====================

function getSheet(nome, cabecalho) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sh = ss.getSheetByName(nome);
  if (!sh) {
    sh = ss.insertSheet(nome);
    if (cabecalho) sh.appendRow(cabecalho);
  }
  return sh;
}

// Usuários ficam na aba "Externos": USUARIO | SENHA | VENCIMENTO
function getUsuariosSheet() {
  return getSheet('Externos', ['USUARIO', 'SENHA', 'VENCIMENTO', 'PERMISSOES']);
}
function getLoginSheet() {
  return getSheet('LOGIN', ['USUARIO', 'SENHA', 'PERFIL', 'NOME']);
}
function getSessoesSheet() {
  return getSheet('SESSOES', ['TOKEN', 'USUARIO', 'PERFIL', 'CRIADO_EM']);
}

// Sessão de admin: emitida só para quem loga de verdade pela aba LOGIN (não
// para o atalho ADMIN/CDA2024 do front-end, que nunca chama o backend). É
// exigida para as ações administrativas sensíveis (gerenciar usuários).
var SESSAO_VALIDADE_HORAS = 12;
function criarSessao(usuario, perfil) {
  var sh = getSessoesSheet();
  var token = Utilities.getUuid();
  sh.appendRow([token, usuario, perfil, new Date()]);
  return token;
}
function validarSessaoAdmin(sessionToken) {
  if (!sessionToken) return false;
  var sh = getSessoesSheet();
  var rows = sh.getDataRange().getValues();
  var agora = new Date();
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0] === sessionToken) {
      var criadoEm = rows[i][3] instanceof Date ? rows[i][3] : new Date(rows[i][3]);
      var horasPassadas = (agora - criadoEm) / 36e5;
      if (isNaN(horasPassadas) || horasPassadas > SESSAO_VALIDADE_HORAS) return false;
      return rows[i][2] === 'ADMIN';
    }
  }
  return false;
}
function getRegistroOrcSheet() {
  return getSheet('REGISTRO-ORC', ['DATA','HORA','PACIENTE','EXAMES','CODIGOS','QTD_EXAMES','TOTAL_BRUTO','TOTAL_PIX','TOTAL_CREDI','ACAO','USUARIO']);
}
function getRegistroAgenSheet() {
  return getSheet('REGISTRO-AGEN', ['DATA','HORA','PACIENTE','TELEFONE','EXAMES','CODIGOS','QTD_EXAMES','TOTAL_BRUTO','FORMA_PGTO','STATUS','ORIGEM','USUARIO']);
}
function getRecoletasSheet() {
  return getSheet('RECOLETAS', ['CODIGO','NOME PACIENTE','EXAMES','TIPO','MOTIVO','OBSERVAÇÕES','DATA','USUARIO','STATUS','DATA_COMUNICACAO','QUEM_COMUNICOU','QUEM_RECEBEU','CONSEGUIU_COMUNICAR','DATA_VEIO','USUARIO_CONCLUSAO','PRIORIDADE']);
}
function getRecoletasContatosSheet() {
  return getSheet('RECOLETAS_CONTATOS', ['CODIGO','DATA','HORA','RESPONSAVEL','RESULTADO']);
}
var BOLETOS_CABECALHO = ['ID','FORNECEDOR','DATA_PEDIDO','QUEM_PEDIU','VALOR_TOTAL','ESPELHO_URL','ESPELHO_ID','DIVIDIDO','PARCELAS','STATUS','DATA_RECEBIMENTO','QUEM_RECEBEU','BOLETOS_CHEGARAM','CONFERENCIA_OK','ENTREGUE_PARA','DATA_CONFERENCIA','QUEM_CONFERIU','RECEBI_BOLETOS','CONFERI_BOLETOS','CRIADO_EM'];

function getBoletosSheet() {
  var sh = getSheet('BOLETOS', BOLETOS_CABECALHO);
  // Autocorreção: se a aba já existia mas ficou sem cabeçalho (ex: foi limpa
  // manualmente sem apagar a aba inteira), getSheet() não insere o cabeçalho
  // de novo — então garantimos aqui, empurrando dados existentes para baixo.
  if (sh.getRange(1, 1).getValue() !== 'ID') {
    sh.insertRowBefore(1);
    sh.getRange(1, 1, 1, BOLETOS_CABECALHO.length).setValues([BOLETOS_CABECALHO]);
  }
  return sh;
}

// Um boleto físico por parcela do pedido (se dividido em N vezes, N linhas
// aqui) — criadas quando o financeiro confere e informa vencimento/valor de
// cada uma (etapa 3 do fluxo). Permite controlar pagamento parcela a parcela.
var BOLETOS_PARCELAS_CABECALHO = ['PEDIDO_ID','FORNECEDOR','NUMERO_PARCELA','VALOR','DATA_VENCIMENTO','STATUS','DATA_PAGAMENTO','QUEM_PAGOU','PAGO_ANTECIPADO','QUEM_CADASTROU','CRIADO_EM','NUMERO_BOLETO'];

function getBoletosParcelasSheet() {
  var sh = getSheet('BOLETOS_PARCELAS', BOLETOS_PARCELAS_CABECALHO);
  if (sh.getRange(1, 1).getValue() !== 'PEDIDO_ID') {
    sh.insertRowBefore(1);
    sh.getRange(1, 1, 1, BOLETOS_PARCELAS_CABECALHO.length).setValues([BOLETOS_PARCELAS_CABECALHO]);
  } else if (sh.getLastColumn() < BOLETOS_PARCELAS_CABECALHO.length) {
    // Migração: aba criada antes da coluna NUMERO_BOLETO existir — só completa o cabeçalho.
    var faltantes = BOLETOS_PARCELAS_CABECALHO.slice(sh.getLastColumn());
    sh.getRange(1, sh.getLastColumn() + 1, 1, faltantes.length).setValues([faltantes]);
  }
  return sh;
}

// Acha (ou cria) a subpasta do ano dentro da mesma pasta-pai da pasta de
// referência de 2026, para que os espelhos de anos futuros sejam organizados
// automaticamente sem precisar mexer no código.
function obterPastaBoletosDoAno(ano) {
  var pastaReferencia = DriveApp.getFolderById(BOLETOS_PASTA_REFERENCIA_ID);
  var nomeAno = String(ano);
  if (pastaReferencia.getName().indexOf(nomeAno) !== -1) return pastaReferencia;
  var pais = pastaReferencia.getParents();
  if (!pais.hasNext()) return pastaReferencia; // fallback: sem pasta-pai, usa a de referência mesmo
  var pastaPai = pais.next();
  var existentes = pastaPai.getFoldersByName(nomeAno);
  if (existentes.hasNext()) return existentes.next();
  return pastaPai.createFolder(nomeAno);
}
function getAppRegistroOrcSheet() {
  return getSheet('APP-REGISTRO-ORC',  ['DATA','HORA','PACIENTE','EXAMES','CODIGOS','QTD_EXAMES','TOTAL_BRUTO','TOTAL_PIX','TOTAL_CREDI','ACAO','USUARIO']);
}
function getAppRegistroAgenSheet() {
  return getSheet('APP-REGISTRO-AGEN', ['DATA','HORA','PACIENTE','TELEFONE','EXAMES','CODIGOS','QTD_EXAMES','TOTAL_BRUTO','FORMA_PGTO','STATUS','ORIGEM','USUARIO']);
}

// Rode uma vez manualmente (menu Executar > migrarColunaPrioridade) para
// adicionar o cabeçalho PRIORIDADE na planilha RECOLETAS já existente.
function migrarColunaPrioridade() {
  var sh = getRecoletasSheet();
  var header = sh.getRange(1, 1, 1, 16).getValues()[0];
  if (header[15] !== 'PRIORIDADE') sh.getRange(1, 16).setValue('PRIORIDADE');
  return 'ok';
}

// Converte os valores antigos de STATUS (PENDENTE/COMUNICADO/CONCLUIDO) para
// o novo fluxo de 7 etapas, mantendo compatibilidade com registros antigos.
function normalizarStatusRecoleta(status) {
  var s = (status || '').toString().toUpperCase().trim();
  if (s === 'PENDENTE') return 'RECOLETA_ABERTA';
  if (s === 'COMUNICADO' || s === 'COMUNICADA') return 'CONTATO_REALIZADO';
  if (s === 'CONCLUIDO' || s === 'CONCLUIDA') return 'FINALIZADA';
  return s || 'RECOLETA_ABERTA';
}

// ==================== LOGIN / USUÁRIOS ====================

// Hash de senha (SHA-256 hex). Migração é automática: linhas antigas ficam em
// texto puro até o próximo login bem-sucedido, quando são reescritas com hash.
function hashSenha(senha) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, senha, Utilities.Charset.UTF_8);
  return bytes.map(function(b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); }).join('');
}
function pareceHash(valor) {
  return typeof valor === 'string' && /^[0-9a-f]{64}$/.test(valor);
}
function senhaConfere(senhaDigitada, senhaArmazenada) {
  return pareceHash(senhaArmazenada) ? (hashSenha(senhaDigitada) === senhaArmazenada) : (senhaArmazenada === senhaDigitada);
}
// Aba "Externos": col0=USUARIO, col1=SENHA, col2=VENCIMENTO (dd/MM/yyyy ou vazio)

function verificarLogin(params) {
  // Aceita &login=X (dashboard) ou &usuario=X
  var usuario = ((params.login || params.usuario || '')).toString().trim().toUpperCase();
  var senha   = (params.senha || '').toString().trim();
  if (!usuario || !senha) return { ok: false, erro: 'Usuário e senha obrigatórios' };

  // 1) Checa primeiro a aba LOGIN (usuários internos/admin, sem vencimento)
  var shLogin    = getLoginSheet();
  var rowsLogin  = shLogin.getDataRange().getValues();
  for (var i = 1; i < rowsLogin.length; i++) {
    if (!rowsLogin[i][0]) continue;
    var rowUserL  = rowsLogin[i][0].toString().trim().toUpperCase();
    var rowSenhaL = rowsLogin[i][1].toString().trim();
    if (rowUserL === usuario && senhaConfere(senha, rowSenhaL)) {
      if (!pareceHash(rowSenhaL)) shLogin.getRange(i + 1, 2).setValue(hashSenha(senha));
      var perfilLogin = rowsLogin[i][2] || 'ADMIN';
      return { ok: true, autorizado: true, usuario: usuario, perfil: perfilLogin, nome: rowsLogin[i][3] || usuario, sessionToken: criarSessao(usuario, perfilLogin) };
    }
  }

  // 2) Se não achou, checa a aba Externos (usuários externos com vencimento)
  var sh   = getUsuariosSheet();
  var rows = sh.getDataRange().getValues();
  var hoje = new Date();
  for (var j = 1; j < rows.length; j++) {
    if (!rows[j][0]) continue;
    var rowUser  = rows[j][0].toString().trim().toUpperCase();
    var rowSenha = rows[j][1].toString().trim();
    if (rowUser === usuario && senhaConfere(senha, rowSenha)) {
      if (!pareceHash(rowSenha)) sh.getRange(j + 1, 2).setValue(hashSenha(senha));
      var venc = rows[j][2];
      if (venc) {
        var vencDate = (venc instanceof Date) ? venc : new Date(venc.toString().split('/').reverse().join('-'));
        if (!isNaN(vencDate.getTime()) && vencDate < hoje) {
          return { ok: false, autorizado: false, erro: 'Acesso expirado em ' + formatarData(venc) };
        }
      }
      var permissoesLogin = null;
      try { permissoesLogin = rows[j][3] ? JSON.parse(rows[j][3]) : null; } catch(ePerm) { permissoesLogin = null; }
      return { ok: true, autorizado: true, usuario: usuario, permissoes: permissoesLogin, sessionToken: criarSessao(usuario, 'EXTERNO') };
    }
  }
  return { ok: false, autorizado: false, erro: 'Usuário ou senha incorretos' };
}

function listarUsuarios() {
  try {
    var sh   = getUsuariosSheet();
    var rows = sh.getDataRange().getValues();
    var lista = [];
    for (var i = 0; i < rows.length; i++) {
      if (!rows[i][0]) continue;
      var permissoes = null;
      try { permissoes = rows[i][3] ? JSON.parse(rows[i][3]) : null; } catch(ePerm) { permissoes = null; }
      lista.push({
        login: rows[i][0].toString().trim(),
        data:  rows[i][2] ? (rows[i][2] instanceof Date ? rows[i][2].toISOString() : rows[i][2].toString()) : '',
        permissoes: permissoes
      });
    }
    return { ok: true, usuarios: lista };
  } catch(e) { return { ok: false, usuarios: [], erro: e.message }; }
}

function cadastrarUsuario(dados) {
  try {
    var sh    = getUsuariosSheet();
    var login = (dados.login  || '').toString().trim().toUpperCase();
    var senha = (dados.senha  || '').toString().trim();
    var venc  = dados.vencimento || '';
    var permissoes = JSON.stringify(dados.permissoes || {});
    if (!login || !senha) return { ok: false, erro: 'Login e senha obrigatórios' };
    var senhaHash = hashSenha(senha);
    var rows = sh.getDataRange().getValues();
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][0].toString().trim().toUpperCase() === login) {
        sh.getRange(i + 1, 2).setValue(senhaHash);
        sh.getRange(i + 1, 3).setValue(venc);
        sh.getRange(i + 1, 4).setValue(permissoes);
        return { ok: true, atualizado: true };
      }
    }
    sh.appendRow([login, senhaHash, venc, permissoes]);
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function atualizarPermissoesUsuario(dados) {
  try {
    var sh    = getUsuariosSheet();
    var login = (dados.login || '').toString().trim().toUpperCase();
    if (!login) return { ok: false, erro: 'Login não informado' };
    var rows = sh.getDataRange().getValues();
    for (var i = 0; i < rows.length; i++) {
      if (rows[i][0].toString().trim().toUpperCase() === login) {
        sh.getRange(i + 1, 4).setValue(JSON.stringify(dados.permissoes || {}));
        return { ok: true };
      }
    }
    return { ok: false, erro: 'Usuário não encontrado' };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function excluirUsuario(dados) {
  try {
    var sh    = getUsuariosSheet();
    var login = (dados.login || '').toString().trim().toUpperCase();
    var rows  = sh.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 0; i--) {
      if (rows[i][0].toString().trim().toUpperCase() === login) {
        sh.deleteRow(i + 1);
        return { ok: true };
      }
    }
    return { ok: false, erro: 'Usuário não encontrado' };
  } catch(e) { return { ok: false, erro: e.message }; }
}

// ==================== REGISTRO-ORC ====================
// DATA | HORA | PACIENTE | EXAMES | CODIGOS | QTD_EXAMES | TOTAL_BRUTO | TOTAL_PIX | TOTAL_CREDI | ACAO | USUARIO

function salvarOrcamento(dados) {
  try {
    var sh    = getRegistroOrcSheet();
    var agora = new Date();
    sh.appendRow([
      dados.data || Utilities.formatDate(agora, Session.getScriptTimeZone(), 'dd/MM/yyyy'),
      dados.hora || Utilities.formatDate(agora, Session.getScriptTimeZone(), 'HH:mm'),
      (dados.paciente         || '').toString().toUpperCase(),
      (dados.exames           || '').toString(),
      (dados.codigos          || '').toString(),
      parseInt(dados.quantidadeExames) || 0,
      parseFloat(dados.totalBruto)     || 0,
      parseFloat(dados.totalPix)       || 0,
      parseFloat(dados.totalCredito)   || 0,
      (dados.acao    || 'BAIXADO').toString().toUpperCase(),
      (dados.usuario || 'ADMIN').toString().toUpperCase()
    ]);
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function contarOrcamentos(mesAno) {
  // mesAno = "MM/YYYY" ex: "06/2026"
  try {
    var sh    = getRegistroOrcSheet();
    var rows  = sh.getDataRange().getValues();
    var total = 0;
    for (var i = 1; i < rows.length; i++) {
      if (!rows[i][0]) continue;
      var p = formatarData(rows[i][0]).split('/');
      if (p.length !== 3) continue;
      if (!mesAno || (p[1] + '/' + p[2]) === mesAno) total++;
    }
    return { ok: true, total: total };
  } catch(e) { return { ok: false, total: 0, erro: e.message }; }
}

function listarOrcamentos(params) {
  try {
    var sh      = getRegistroOrcSheet();
    var rows    = sh.getDataRange().getValues();
    var lista   = [];
    var filtPac = (params.paciente || '').toString().toUpperCase().trim();
    var filtUsr = (params.usuario  || '').toString().toUpperCase().trim();
    var filtMes = (params.mesAno   || '').toString().trim(); // "MM/YYYY"
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[0]) continue;
      var dataStr = formatarData(r[0]);
      if (filtMes) {
        var p = dataStr.split('/');
        if (p.length !== 3 || (p[1] + '/' + p[2]) !== filtMes) continue;
      }
      if (filtPac && r[2].toString().toUpperCase().indexOf(filtPac) < 0) continue;
      if (filtUsr && r[10] && r[10].toString().toUpperCase().indexOf(filtUsr) < 0) continue;
      lista.push({
        data:         dataStr,
        hora:         formatarHora(r[1]),
        paciente:     r[2]  ? r[2].toString()  : '',
        exames:       r[3]  ? r[3].toString()  : '',
        codigos:      r[4]  ? r[4].toString()  : '',
        qtdExames:    r[5]  || 0,
        totalBruto:   r[6]  || 0,
        totalPix:     r[7]  || 0,
        totalCredito: r[8]  || 0,
        acao:         r[9]  ? r[9].toString()  : 'BAIXADO',
        usuario:      r[10] ? r[10].toString() : 'ADMIN'
      });
    }
    lista.reverse();
    return { ok: true, orcamentos: lista };
  } catch(e) { return { ok: false, orcamentos: [], erro: e.message }; }
}

// ==================== REGISTRO-AGEN ====================
// DATA | HORA | PACIENTE | TELEFONE | EXAMES | CODIGOS | QTD_EXAMES | TOTAL_BRUTO | FORMA_PGTO | STATUS | ORIGEM | USUARIO

function salvarRegistroAgen(dados) {
  try {
    var sh    = getRegistroAgenSheet();
    var agora = new Date();
    var paciente = dados.paciente || dados.nome || '';
    // Converte data ISO (YYYY-MM-DD) para dd/MM/yyyy se necessário
    var dataRaw = dados.data || Utilities.formatDate(agora, Session.getScriptTimeZone(), 'dd/MM/yyyy');
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataRaw)) {
      var p = dataRaw.split('-');
      dataRaw = p[2] + '/' + p[1] + '/' + p[0];
    }
    var horaRaw = (dados.hora || dados.horario || Utilities.formatDate(agora, Session.getScriptTimeZone(), 'HH:mm')).toString();
    sh.appendRow([
      dataRaw,
      horaRaw,
      paciente.toString().toUpperCase(),
      (dados.telefone  || '').toString(),
      (dados.exames    || '').toString(),
      (dados.codigos   || '').toString(),
      parseInt(dados.qtdExames)        || 0,
      parseFloat(dados.totalBruto)     || 0,
      (dados.formaPgto || dados.pagamento || 'PIX').toString().toUpperCase(),
      (dados.status    || 'CONFIRMADO').toString().toUpperCase(),
      (dados.origem    || 'DIRETO').toString().toUpperCase(),
      (dados.usuario   || 'ADMIN').toString().toUpperCase()
    ]);
    // Evita que o Sheets converta DATA/HORA em valores de Data automaticamente
    var linha = sh.getLastRow();
    sh.getRange(linha, 1, 1, 2).setNumberFormat('@').setValues([[dataRaw, horaRaw]]);
    SpreadsheetApp.flush();
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function contarRegistroAgen(mes) {
  // mes = "YYYY-MM" ex: "2026-06"
  try {
    var sh    = getRegistroAgenSheet();
    var rows  = sh.getDataRange().getValues();
    var total = 0;
    for (var i = 1; i < rows.length; i++) {
      if (!rows[i][0]) continue;
      var p = formatarData(rows[i][0]).split('/');
      if (p.length !== 3) continue;
      if (!mes || (p[2] + '-' + p[1]) === mes) total++;
    }
    return { ok: true, total: total };
  } catch(e) { return { ok: false, total: 0, erro: e.message }; }
}

function listarRegistroAgen(params) {
  try {
    var sh      = getRegistroAgenSheet();
    var rows    = sh.getDataRange().getValues();
    var lista   = [];
    var filtPac = (params.paciente || params.nome || '').toString().toUpperCase().trim();
    var filtUsr = (params.usuario  || '').toString().toUpperCase().trim();
    var filtMes = (params.mesAno   || '').toString().trim(); // "MM/YYYY"
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[0]) continue;
      var dataStr = formatarData(r[0]);
      if (filtMes) {
        var p = dataStr.split('/');
        if (p.length !== 3 || (p[1] + '/' + p[2]) !== filtMes) continue;
      }
      if (filtPac && r[2].toString().toUpperCase().indexOf(filtPac) < 0) continue;
      if (filtUsr && r[11] && r[11].toString().toUpperCase().indexOf(filtUsr) < 0) continue;
      lista.push({
        data:       dataStr,
        hora:       formatarHora(r[1]),
        paciente:   r[2]  ? r[2].toString()  : '',
        telefone:   r[3]  ? r[3].toString()  : '',
        exames:     r[4]  ? r[4].toString()  : '',
        codigos:    r[5]  ? r[5].toString()  : '',
        qtdExames:  r[6]  || 0,
        totalBruto: r[7]  || 0,
        formaPgto:  r[8]  ? r[8].toString()  : 'PIX',
        status:     r[9]  ? r[9].toString()  : 'CONFIRMADO',
        origem:     r[10] ? r[10].toString() : 'DIRETO',
        usuario:    r[11] ? r[11].toString() : 'ADMIN'
      });
    }
    lista.reverse();
    return { ok: true, agendamentos: lista };
  } catch(e) { return { ok: false, agendamentos: [], erro: e.message }; }
}

// ==================== ATIVIDADES RECENTES ====================

function listarAtividades() {
  try {
    var atividades = [];
    var hoje = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy');

    try {
      var rowsOrc = getRegistroOrcSheet().getDataRange().getValues();
      var co = 0;
      for (var i = rowsOrc.length - 1; i >= 1 && co < 5; i--) {
        if (!rowsOrc[i][0]) continue;
        var d = formatarData(rowsOrc[i][0]);
        atividades.push({
          tipo:   'orcamento',
          titulo: 'Orçamento' + (rowsOrc[i][2] ? ' — ' + rowsOrc[i][2] : '') + (rowsOrc[i][1] ? ' às ' + rowsOrc[i][1] : ''),
          tempo:  d === hoje ? 'hoje' : d,
          cor:    '#0F4C5C',
          bg:     'rgba(15,76,92,0.1)'
        });
        co++;
      }
    } catch(e) {}

    try {
      var rowsAgen = getRegistroAgenSheet().getDataRange().getValues();
      var ca = 0;
      for (var j = rowsAgen.length - 1; j >= 1 && ca < 3; j--) {
        if (!rowsAgen[j][0]) continue;
        var da = formatarData(rowsAgen[j][0]);
        atividades.push({
          tipo:   'agendamento',
          titulo: 'Agendamento' + (rowsAgen[j][2] ? ' — ' + rowsAgen[j][2] : '') + (rowsAgen[j][1] ? ' às ' + rowsAgen[j][1] : ''),
          tempo:  da === hoje ? 'hoje' : da,
          cor:    '#37A7AA',
          bg:     'rgba(55,167,170,0.1)'
        });
        ca++;
      }
    } catch(e) {}

    return { ok: true, atividades: atividades.slice(0, 8) };
  } catch(e) { return { ok: false, atividades: [], erro: e.message }; }
}

// ==================== RECOLETAS ====================

function contarRecoletas() {
  try {
    var sh          = getRecoletasSheet();
    var rows        = sh.getDataRange().getValues();
    var pendentes   = 0;
    var comunicadas = 0;
    for (var i = 1; i < rows.length; i++) {
      if (!rows[i][0] && !rows[i][1]) continue;
      var status = (rows[i][8] || '').toString().toUpperCase().trim();
      if (status === 'PENDENTE')                               pendentes++;
      if (status === 'COMUNICADA' || status === 'COMUNICADO') comunicadas++;
    }
    return { ok: true, pendentes: pendentes, comunicadas: comunicadas };
  } catch(e) { return { ok: false, pendentes: 0, comunicadas: 0, erro: e.message }; }
}

function listarRecoletas(params) {
  // Colunas reais: 0=CODIGO,1=NOME PACIENTE,2=EXAMES,3=TIPO,4=MOTIVO,5=OBSERVAÇÕES,
  // 6=DATA,7=USUARIO,8=STATUS,9=DATA_COMUNICACAO,10=QUEM_COMUNICOU,11=QUEM_RECEBEU,
  // 12=CONSEGUIU_COMUNICAR,13=DATA_VEIO,14=USUARIO_CONCLUSAO,15=PRIORIDADE
  try {
    var sh      = getRecoletasSheet();
    var rows    = sh.getDataRange().getValues();
    var lista   = [];
    var filtStRaw = (params.status || '').toString().toUpperCase().trim();
    var filtStList = filtStRaw ? filtStRaw.split(',').map(function(s) { return normalizarStatusRecoleta(s.trim()); }).filter(Boolean) : [];
    var filtPac = (params.paciente || params.nome || '').toString().toUpperCase().trim();
    var filtCod = (params.codigo   || '').toString().toUpperCase().trim();
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[0] && !r[1]) continue;
      var statusNorm = normalizarStatusRecoleta(r[8]);
      if (filtStList.length && filtStList.indexOf(statusNorm) === -1) continue;
      if (filtPac && (r[1] || '').toString().toUpperCase().indexOf(filtPac) < 0) continue;
      if (filtCod && (r[0] || '').toString().toUpperCase().indexOf(filtCod) < 0) continue;
      lista.push({
        codigo:              r[0]  ? r[0].toString()  : '',
        nome:                r[1]  ? r[1].toString()  : '',
        exames:              r[2]  ? r[2].toString()  : '',
        tipo:                r[3]  ? r[3].toString()  : '',
        motivo:              r[4]  ? r[4].toString()  : '',
        observacoes:         r[5]  ? r[5].toString()  : '',
        data:                formatarData(r[6]),
        usuario:             r[7]  ? r[7].toString()  : '',
        status:              statusNorm,
        dataComunicacao:     formatarData(r[9]),
        quemComunicou:       r[10] ? r[10].toString() : '',
        quemRecebeu:         r[11] ? r[11].toString() : '',
        conseguiuComunicar:  r[12] ? r[12].toString() : '',
        dataVeio:            formatarData(r[13]),
        usuarioConclusao:    r[14] ? r[14].toString() : '',
        prioridade:          r[15] ? r[15].toString().toUpperCase() : 'MEDIA',
        linha:               i + 1
      });
    }
    lista.reverse();
    return { ok: true, recoletas: lista };
  } catch(e) { return { ok: false, recoletas: [], erro: e.message }; }
}

function salvarRecoleta(dados) {
  try {
    var sh    = getRecoletasSheet();
    var agora = new Date();
    sh.appendRow([
      (dados.codigo      || '').toString().trim(),
      (dados.nome        || '').toString().toUpperCase(),
      (dados.exames      || '').toString(),
      (dados.tipo        || '').toString(),
      (dados.motivo      || '').toString(),
      (dados.observacoes || '').toString(),
      Utilities.formatDate(agora, Session.getScriptTimeZone(), 'dd/MM/yyyy'),
      (dados.usuario     || 'ADMIN').toString().toUpperCase(),
      (dados.status      || 'RECOLETA_ABERTA').toString().toUpperCase(),
      dados.dataComunicacao    || '',
      dados.quemComunicou      || '',
      dados.quemRecebeu        || '',
      dados.conseguiuComunicar || '',
      dados.dataVeio           || '',
      dados.usuarioConclusao   || '',
      (dados.prioridade  || 'MEDIA').toString().toUpperCase()
    ]);
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function atualizarRecoleta(dados) {
  try {
    var sh     = getRecoletasSheet();
    var rows   = sh.getDataRange().getValues();
    var codigo = (dados.codigo || '').toString().trim();
    var nome   = (dados.nome   || '').toString().trim().toUpperCase();
    var linha  = -1;
    for (var i = 1; i < rows.length; i++) {
      if (codigo && rows[i][0].toString().trim() === codigo && rows[i][1].toString().trim().toUpperCase() === nome) {
        linha = i + 1;
        break;
      }
    }
    if (linha === -1) return { ok: false, erro: 'Recoleta não encontrada' };
    if (dados.observacoes        !== undefined) sh.getRange(linha,  6).setValue(dados.observacoes        || '');
    if (dados.status             !== undefined) sh.getRange(linha,  9).setValue(dados.status             || '');
    if (dados.dataComunicacao    !== undefined) sh.getRange(linha, 10).setValue(dados.dataComunicacao    || '');
    if (dados.quemComunicou      !== undefined) sh.getRange(linha, 11).setValue(dados.quemComunicou      || '');
    if (dados.quemRecebeu        !== undefined) sh.getRange(linha, 12).setValue(dados.quemRecebeu        || '');
    if (dados.conseguiuComunicar !== undefined) sh.getRange(linha, 13).setValue(dados.conseguiuComunicar || '');
    if (dados.dataVeio           !== undefined) sh.getRange(linha, 14).setValue(dados.dataVeio           || '');
    if (dados.usuarioConclusao   !== undefined) sh.getRange(linha, 15).setValue(dados.usuarioConclusao   || '');
    if (dados.prioridade         !== undefined) sh.getRange(linha, 16).setValue((dados.prioridade || '').toString().toUpperCase());
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function excluirRecoleta(dados) {
  try {
    var sh     = getRecoletasSheet();
    var codigo = (dados.codigo || '').toString().trim();
    var nome   = (dados.nome   || '').toString().toUpperCase().trim();
    var rows   = sh.getDataRange().getValues();
    for (var i = rows.length - 1; i >= 1; i--) {
      if (codigo && rows[i][0].toString().trim() === codigo) { sh.deleteRow(i + 1); return { ok: true }; }
      if (!codigo && nome && rows[i][1].toString().toUpperCase() === nome) { sh.deleteRow(i + 1); return { ok: true }; }
    }
    return { ok: false, erro: 'Recoleta não encontrada' };
  } catch(e) { return { ok: false, erro: e.message }; }
}

// ==================== HISTÓRICO DE CONTATOS DA RECOLETA ====================
// Aba "RECOLETAS_CONTATOS": CODIGO | DATA | HORA | RESPONSAVEL | RESULTADO
// Cada linha é UMA tentativa de contato (permite múltiplas por recoleta).

function registrarContatoRecoleta(dados) {
  try {
    var sh = getRecoletasContatosSheet();
    var agora = new Date();
    var data = dados.data || Utilities.formatDate(agora, Session.getScriptTimeZone(), 'dd/MM/yyyy');
    var hora = dados.hora || Utilities.formatDate(agora, Session.getScriptTimeZone(), 'HH:mm');
    sh.appendRow([
      (dados.codigo || '').toString().trim(),
      data,
      hora,
      (dados.responsavel || dados.usuario || 'ADMIN').toString().toUpperCase(),
      (dados.resultado || '').toString()
    ]);
    // Evita que o Sheets converta DATA/HORA em valores de Data automaticamente
    var linha = sh.getLastRow();
    sh.getRange(linha, 2, 1, 2).setNumberFormat('@').setValues([[data, hora]]);
    SpreadsheetApp.flush();
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function listarContatosRecoleta(params) {
  try {
    var sh = getRecoletasContatosSheet();
    var rows = sh.getDataRange().getValues();
    var codigo = (params.codigo || '').toString().trim();
    var lista = [];
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[0]) continue;
      if (codigo && r[0].toString().trim() !== codigo) continue;
      lista.push({
        codigo:      r[0].toString(),
        data:        formatarData(r[1]),
        hora:        r[2] ? r[2].toString() : '',
        responsavel: r[3] ? r[3].toString() : '',
        resultado:   r[4] ? r[4].toString() : ''
      });
    }
    return { ok: true, contatos: lista };
  } catch(e) { return { ok: false, contatos: [], erro: e.message }; }
}

// ==================== RELATÓRIO DE RECOLETAS ====================

function relatorioRecoletas(params) {
  // mesAno = "MM/YYYY" (opcional) — filtra o detalhamento e o "total no período";
  // os tempos médios e o total geral sempre consideram a base inteira.
  try {
    var sh     = getRecoletasSheet();
    var rows   = sh.getDataRange().getValues();
    var mesAno = (params.mesAno || '').toString().trim();

    function paraData(str) {
      if (!str) return null;
      str = str.toString().trim();
      var m;
      if ((m = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/))) return new Date(+m[3], +m[2] - 1, +m[1]);
      if ((m = str.match(/^(\d{4})-(\d{2})-(\d{2})$/)))  return new Date(+m[1], +m[2] - 1, +m[3]);
      return null;
    }

    // Mapa do primeiro contato (mais antigo) por código, a partir do histórico real de contatos.
    // Para registros antigos que ainda não têm nenhuma linha no histórico, cai no campo
    // legado DATA_COMUNICACAO (coluna 9) como aproximação.
    var primeiroContatoPorCodigo = {};
    try {
      var rowsContatos = getRecoletasContatosSheet().getDataRange().getValues();
      for (var c = 1; c < rowsContatos.length; c++) {
        var rc = rowsContatos[c];
        if (!rc[0]) continue;
        var cod = rc[0].toString().trim();
        var dc = paraData(formatarData(rc[1]));
        if (!dc) continue;
        if (!primeiroContatoPorCodigo[cod] || dc < primeiroContatoPorCodigo[cod]) {
          primeiroContatoPorCodigo[cod] = dc;
        }
      }
    } catch(e) {}

    var totalGeral = 0, totalPeriodo = 0, naoConseguiuAvisar = 0;
    var somaDiasAviso = 0, qtdDiasAviso = 0;
    var somaDiasRetorno = 0, qtdDiasRetorno = 0;
    var detalhes = [];

    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[0] && !r[1]) continue;
      totalGeral++;

      var codigo  = r[0] ? r[0].toString().trim() : '';
      var dataReg = formatarData(r[6]);
      var pReg    = dataReg.split('/');
      var noPeriodo = !mesAno || (pReg.length === 3 && (pReg[1] + '/' + pReg[2]) === mesAno);
      if (noPeriodo) totalPeriodo++;

      var conseguiu = (r[12] || '').toString().toUpperCase().trim();
      if (noPeriodo && (conseguiu === 'NAO' || conseguiu === 'NAO_ATENDEU')) naoConseguiuAvisar++;

      var dReg  = paraData(dataReg);
      var dPrimeiroContato = primeiroContatoPorCodigo[codigo] || paraData(formatarData(r[9]));
      var dVeio = paraData(formatarData(r[13]));

      var diasAviso = null, diasRetorno = null;
      if (dReg && dPrimeiroContato) {
        diasAviso = Math.round((dPrimeiroContato - dReg) / 86400000);
        somaDiasAviso += diasAviso; qtdDiasAviso++;
      }
      if (dPrimeiroContato && dVeio) {
        diasRetorno = Math.round((dVeio - dPrimeiroContato) / 86400000);
        somaDiasRetorno += diasRetorno; qtdDiasRetorno++;
      }

      if (noPeriodo) {
        detalhes.push({
          codigo:              codigo,
          nome:                r[1] ? r[1].toString() : '',
          exames:              r[2] ? r[2].toString() : '',
          motivo:              r[4] ? r[4].toString() : '',
          status:              normalizarStatusRecoleta(r[8]),
          prioridade:          r[15] ? r[15].toString().toUpperCase() : 'MEDIA',
          data:                dataReg,
          dataComunicacao:     formatarData(r[9]),
          dataVeio:            formatarData(r[13]),
          diasAviso:           diasAviso,
          diasRetorno:         diasRetorno,
          conseguiuComunicar:  conseguiu
        });
      }
    }

    detalhes.reverse();
    return {
      ok: true,
      totalGeral: totalGeral,
      totalPeriodo: totalPeriodo,
      naoConseguiuAvisar: naoConseguiuAvisar,
      tempoMedioAvisoDias: qtdDiasAviso ? Math.round((somaDiasAviso / qtdDiasAviso) * 10) / 10 : null,
      tempoMedioRetornoDias: qtdDiasRetorno ? Math.round((somaDiasRetorno / qtdDiasRetorno) * 10) / 10 : null,
      detalhes: detalhes
    };
  } catch(e) { return { ok: false, erro: e.message }; }
}

// ==================== BOLETOS ====================

// Colunas: 0=ID,1=FORNECEDOR,2=DATA_PEDIDO,3=QUEM_PEDIU,4=VALOR_TOTAL,5=ESPELHO_URL,
// 6=ESPELHO_ID,7=DIVIDIDO,8=PARCELAS,9=STATUS,10=DATA_RECEBIMENTO,11=QUEM_RECEBEU,
// 12=BOLETOS_CHEGARAM,13=CONFERENCIA_OK,14=ENTREGUE_PARA,15=DATA_CONFERENCIA,
// 16=QUEM_CONFERIU,17=RECEBI_BOLETOS,18=CONFERI_BOLETOS,19=CRIADO_EM
// status: 'pendente' (Pedido Feito) -> 'recebido' (Mercadoria Recebida) -> 'finalizado' (Financeiro OK)

function listarBoletos(params) {
  try {
    var sh     = getBoletosSheet();
    var rows   = sh.getDataRange().getValues();
    var lista  = [];
    var filtSt = (params.status || '').toString().toLowerCase().trim();
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[0]) continue;
      var status = r[9] ? r[9].toString() : 'pendente';
      if (filtSt && filtSt !== 'todos' && status !== filtSt) continue;
      lista.push({
        id:               r[0].toString(),
        fornecedor:       r[1]  ? r[1].toString()  : '',
        dataPedido:       r[2]  ? r[2].toString()  : '',
        quemPedido:       r[3]  ? r[3].toString()  : '',
        valorTotal:       r[4]  || 0,
        espelhoUrl:       r[5]  ? r[5].toString()  : '',
        espelhoId:        r[6]  ? r[6].toString()  : '',
        dividido:         r[7]  ? r[7].toString()  : 'NÃO',
        parcelas:         r[8]  || 1,
        status:           status,
        dataRecebimento:  r[10] ? r[10].toString() : '',
        quemRecebeu:      r[11] ? r[11].toString() : '',
        boletosChegaram:  r[12] ? r[12].toString() : '',
        conferenciaOK:    r[13] ? r[13].toString() : '',
        entreguePara:     r[14] ? r[14].toString() : '',
        dataConferencia:  r[15] ? r[15].toString() : '',
        quemConferiu:     r[16] ? r[16].toString() : '',
        recebiBoletos:    r[17] ? r[17].toString() : '',
        conferiBoletos:   r[18] ? r[18].toString() : '',
        criadoEm:         formatarData(r[19]),
        linha:            i + 1
      });
    }
    lista.reverse();
    return { ok: true, dados: lista };
  } catch(e) { return { ok: false, dados: [], erro: e.message }; }
}

function salvarBoleto(dados) {
  try {
    var sh    = getBoletosSheet();
    var agora = new Date();
    var id    = 'BOL' + agora.getTime();
    var dataPedido = (dados.dataPedido || agora.toISOString()).toString();
    sh.appendRow([
      id,
      (dados.fornecedor  || '').toString().toUpperCase(),
      dataPedido,
      (dados.quemPedido   || 'DESCONHECIDO').toString().toUpperCase(),
      parseFloat(dados.valorTotal) || 0,
      dados.espelhoUrl || '',
      dados.espelhoId  || '',
      (dados.dividido  || 'NÃO').toString().toUpperCase(),
      parseInt(dados.parcelas) || 1,
      (dados.status    || 'pendente').toString(),
      '', '', '', '', '', '', '', '', '',
      Utilities.formatDate(agora, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm')
    ]);
    // Evita que o Sheets converta DATA_PEDIDO (string ISO) em valor de Data automaticamente
    var linha = sh.getLastRow();
    sh.getRange(linha, 3).setNumberFormat('@').setValue(dataPedido);
    SpreadsheetApp.flush();
    return { ok: true, id: id };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function atualizarRecebimento(dados) {
  try {
    var sh   = getBoletosSheet();
    var rows = sh.getDataRange().getValues();
    var id   = (dados.id || '').toString().trim();
    var linha = -1;
    for (var i = 1; i < rows.length; i++) { if (rows[i][0].toString().trim() === id) { linha = i + 1; break; } }
    if (linha === -1) return { ok: false, erro: 'Pedido não encontrado' };

    var dataRecebimento = (dados.dataRecebimento || new Date().toISOString()).toString();
    sh.getRange(linha, 10).setValue((dados.status || 'recebido').toString());
    sh.getRange(linha, 11, 1, 5).setValues([[
      dataRecebimento,
      (dados.quemRecebeu || '').toString().toUpperCase(),
      (dados.boletosChegaram || '').toString(),
      (dados.conferenciaOK   || '').toString(),
      (dados.entreguePara    || '').toString().toUpperCase()
    ]]);
    sh.getRange(linha, 11).setNumberFormat('@').setValue(dataRecebimento);
    SpreadsheetApp.flush();
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function atualizarFinanceiro(dados) {
  try {
    var sh   = getBoletosSheet();
    var rows = sh.getDataRange().getValues();
    var id   = (dados.id || '').toString().trim();
    var linha = -1;
    for (var i = 1; i < rows.length; i++) { if (rows[i][0].toString().trim() === id) { linha = i + 1; break; } }
    if (linha === -1) return { ok: false, erro: 'Pedido não encontrado' };
    var fornecedor = rows[linha - 1][1] ? rows[linha - 1][1].toString() : '';

    var dataConferencia = (dados.dataConferencia || new Date().toISOString()).toString();
    sh.getRange(linha, 10).setValue((dados.status || 'finalizado').toString());
    sh.getRange(linha, 16, 1, 4).setValues([[
      dataConferencia,
      (dados.quemConferiu  || '').toString().toUpperCase(),
      (dados.recebiBoletos  || '').toString(),
      (dados.conferiBoletos || '').toString()
    ]]);
    sh.getRange(linha, 16).setNumberFormat('@').setValue(dataConferencia);

    // Gera os boletos físicos (parcelas) com vencimento/valor informados pelo
    // financeiro nesta etapa — uma vez só por pedido, mesmo se reenviado (ex:
    // duplo clique no botão). O lock impede que duas execuções simultâneas
    // passem as duas pela checagem "já existe" antes de qualquer uma escrever.
    if (Array.isArray(dados.parcelas) && dados.parcelas.length > 0) {
      var lock = LockService.getScriptLock();
      lock.waitLock(15000);
      try {
        var shParc = getBoletosParcelasSheet();
        var existentes = shParc.getDataRange().getValues();
        var jaExiste = false;
        for (var k = 1; k < existentes.length; k++) {
          if (existentes[k][0] && existentes[k][0].toString().trim() === id) { jaExiste = true; break; }
        }
        if (!jaExiste) {
          var agoraParc = new Date();
          var criadoEmParc = Utilities.formatDate(agoraParc, Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm');
          dados.parcelas.forEach(function(p) {
            var venc = (p.dataVencimento || '').toString();
            var numeroBoleto = (p.numeroBoleto || '').toString().toUpperCase();
            shParc.appendRow([
              id, fornecedor.toUpperCase(), parseInt(p.numero) || 1, parseFloat(p.valor) || 0,
              venc, 'ABERTO', '', '', 'NÃO',
              (dados.quemConferiu || '').toString().toUpperCase(),
              criadoEmParc,
              numeroBoleto
            ]);
            var linhaParc = shParc.getLastRow();
            shParc.getRange(linhaParc, 5).setNumberFormat('@').setValue(venc);
            shParc.getRange(linhaParc, 11).setNumberFormat('@').setValue(criadoEmParc);
            shParc.getRange(linhaParc, 12).setNumberFormat('@').setValue(numeroBoleto);
          });
        }
      } finally {
        lock.releaseLock();
      }
    }
    SpreadsheetApp.flush();
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function listarParcelasBoletos(params) {
  try {
    var sh   = getBoletosParcelasSheet();
    var rows = sh.getDataRange().getValues();
    var lista = [];
    var filtStatus = (params.status || '').toString().toUpperCase().trim();
    var filtFornecedor = (params.fornecedor || '').toString().toUpperCase().trim();
    var filtNumeroBoleto = (params.numeroBoleto || '').toString().toUpperCase().trim();
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[0]) continue;
      var status = r[5] ? r[5].toString().toUpperCase() : 'ABERTO';
      if (filtStatus && filtStatus !== 'TODOS' && status !== filtStatus) continue;
      if (filtFornecedor && (r[1] || '').toString().toUpperCase().indexOf(filtFornecedor) < 0) continue;
      if (filtNumeroBoleto && (r[11] || '').toString().toUpperCase().indexOf(filtNumeroBoleto) < 0) continue;
      lista.push({
        pedidoId:       r[0].toString(),
        fornecedor:     r[1] ? r[1].toString() : '',
        numeroParcela:  r[2] || 1,
        valor:          r[3] || 0,
        dataVencimento: formatarData(r[4]),
        status:         status,
        dataPagamento:  formatarData(r[6]),
        quemPagou:      r[7] ? r[7].toString() : '',
        pagoAntecipado: r[8] ? r[8].toString() : 'NÃO',
        quemCadastrou:  r[9] ? r[9].toString() : '',
        criadoEm:       formatarData(r[10]),
        numeroBoleto:   r[11] ? r[11].toString() : '',
        linha:          i + 1
      });
    }
    return { ok: true, parcelas: lista };
  } catch(e) { return { ok: false, parcelas: [], erro: e.message }; }
}

function darBaixaParcela(dados) {
  try {
    var sh = getBoletosParcelasSheet();
    var rows = sh.getDataRange().getValues();
    var linha = parseInt(dados.linha) || -1;
    if (linha < 2 || linha > rows.length) return { ok: false, erro: 'Parcela não encontrada' };
    var dataPagamento = (dados.dataPagamento || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'dd/MM/yyyy')).toString();
    sh.getRange(linha, 6, 1, 4).setValues([[
      'PAGO', dataPagamento, (dados.quemPagou || '').toString().toUpperCase(), (dados.pagoAntecipado || 'NÃO').toString().toUpperCase()
    ]]);
    sh.getRange(linha, 7).setNumberFormat('@').setValue(dataPagamento);
    SpreadsheetApp.flush();
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function atualizarVencimentoParcela(dados) {
  try {
    var sh = getBoletosParcelasSheet();
    var rows = sh.getDataRange().getValues();
    var linha = parseInt(dados.linha) || -1;
    if (linha < 2 || linha > rows.length) return { ok: false, erro: 'Parcela não encontrada' };
    var venc = (dados.dataVencimento || '').toString();
    var numeroBoleto = (dados.numeroBoleto || '').toString().toUpperCase();
    sh.getRange(linha, 4).setValue(parseFloat(dados.valor) || 0);
    sh.getRange(linha, 5).setNumberFormat('@').setValue(venc);
    sh.getRange(linha, 12).setNumberFormat('@').setValue(numeroBoleto);
    SpreadsheetApp.flush();
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

// Recebe o PDF em base64, monta o nome "FORNECEDOR - DD-MM-AAAA.pdf" e salva
// na pasta do Drive do ano correspondente à data do pedido (criando-a se
// ainda não existir).
function uploadEspelhoBoleto(dados) {
  try {
    var base64 = dados.base64 || '';
    if (!base64) return { ok: false, erro: 'base64 vazio' };
    var fornecedor = (dados.fornecedor || 'FORNECEDOR').toString().trim();
    var dataObj = dados.dataPedido ? new Date(dados.dataPedido) : new Date();
    if (isNaN(dataObj.getTime())) dataObj = new Date();
    var dataFormatada = Utilities.formatDate(dataObj, Session.getScriptTimeZone(), 'dd-MM-yyyy');
    var ano = dataObj.getFullYear();

    var nomeArquivo = (fornecedor + ' - ' + dataFormatada).replace(/[\\\/:*?"<>|]/g, '-') + '.pdf';
    var pasta = obterPastaBoletosDoAno(ano);
    var blob  = Utilities.newBlob(Utilities.base64Decode(base64), 'application/pdf', nomeArquivo);
    var file  = pasta.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return { ok: true, fileId: file.getId(), fileUrl: 'https://drive.google.com/file/d/' + file.getId() + '/view', pasta: pasta.getName() };
  } catch(e) { return { ok: false, erro: e.message }; }
}

// ==================== APP-REGISTRO-ORC ====================

function salvarAppOrcamento(dados) {
  try {
    var sh    = getAppRegistroOrcSheet();
    var agora = new Date();
    sh.appendRow([
      dados.data || Utilities.formatDate(agora, Session.getScriptTimeZone(), 'dd/MM/yyyy'),
      dados.hora || Utilities.formatDate(agora, Session.getScriptTimeZone(), 'HH:mm'),
      (dados.paciente         || '').toString().toUpperCase(),
      (dados.exames           || '').toString(),
      (dados.codigos          || '').toString(),
      parseInt(dados.quantidadeExames) || 0,
      parseFloat(dados.totalBruto)     || 0,
      parseFloat(dados.totalPix)       || 0,
      parseFloat(dados.totalCredito)   || 0,
      (dados.acao    || 'BAIXADO').toString().toUpperCase(),
      (dados.usuario || 'APP').toString().toUpperCase()
    ]);
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function contarAppOrcamentos(mesAno) {
  try {
    var sh    = getAppRegistroOrcSheet();
    var rows  = sh.getDataRange().getValues();
    var total = 0;
    for (var i = 1; i < rows.length; i++) {
      if (!rows[i][0]) continue;
      var p = formatarData(rows[i][0]).split('/');
      if (p.length !== 3) continue;
      if (!mesAno || (p[1] + '/' + p[2]) === mesAno) total++;
    }
    return { ok: true, total: total };
  } catch(e) { return { ok: false, total: 0, erro: e.message }; }
}

function listarAppOrcamentos(params) {
  try {
    var sh      = getAppRegistroOrcSheet();
    var rows    = sh.getDataRange().getValues();
    var lista   = [];
    var filtPac = (params.paciente || '').toString().toUpperCase().trim();
    var filtUsr = (params.usuario  || '').toString().toUpperCase().trim();
    var filtMes = (params.mesAno   || '').toString().trim();
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[0]) continue;
      var dataStr = formatarData(r[0]);
      if (filtMes) {
        var p = dataStr.split('/');
        if (p.length !== 3 || (p[1] + '/' + p[2]) !== filtMes) continue;
      }
      if (filtPac && r[2].toString().toUpperCase().indexOf(filtPac) < 0) continue;
      if (filtUsr && r[10] && r[10].toString().toUpperCase().indexOf(filtUsr) < 0) continue;
      lista.push({
        data:         dataStr,
        hora:         formatarHora(r[1]),
        paciente:     r[2]  ? r[2].toString()  : '',
        exames:       r[3]  ? r[3].toString()  : '',
        codigos:      r[4]  ? r[4].toString()  : '',
        qtdExames:    r[5]  || 0,
        totalBruto:   r[6]  || 0,
        totalPix:     r[7]  || 0,
        totalCredito: r[8]  || 0,
        acao:         r[9]  ? r[9].toString()  : 'BAIXADO',
        usuario:      r[10] ? r[10].toString() : 'APP'
      });
    }
    lista.reverse();
    return { ok: true, orcamentos: lista };
  } catch(e) { return { ok: false, orcamentos: [], erro: e.message }; }
}

// ==================== APP-REGISTRO-AGEN ====================

function salvarAppRegistroAgen(dados) {
  try {
    var sh    = getAppRegistroAgenSheet();
    var agora = new Date();
    var paciente = dados.paciente || dados.nome || '';
    var dataRaw = (dados.data || Utilities.formatDate(agora, Session.getScriptTimeZone(), 'dd/MM/yyyy')).toString();
    var horaRaw = (dados.hora || dados.horario || Utilities.formatDate(agora, Session.getScriptTimeZone(), 'HH:mm')).toString();
    sh.appendRow([
      dataRaw,
      horaRaw,
      paciente.toString().toUpperCase(),
      (dados.telefone  || '').toString(),
      (dados.exames    || '').toString(),
      (dados.codigos   || '').toString(),
      parseInt(dados.qtdExames)        || 0,
      parseFloat(dados.totalBruto)     || 0,
      (dados.formaPgto || dados.pagamento || 'PIX').toString().toUpperCase(),
      (dados.status    || 'CONFIRMADO').toString().toUpperCase(),
      (dados.origem    || 'APP').toString().toUpperCase(),
      (dados.usuario   || 'APP').toString().toUpperCase()
    ]);
    // Evita que o Sheets converta DATA/HORA em valores de Data automaticamente
    var linha = sh.getLastRow();
    sh.getRange(linha, 1, 1, 2).setNumberFormat('@').setValues([[dataRaw, horaRaw]]);
    SpreadsheetApp.flush();
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function contarAppRegistroAgen(mes) {
  try {
    var sh    = getAppRegistroAgenSheet();
    var rows  = sh.getDataRange().getValues();
    var total = 0;
    for (var i = 1; i < rows.length; i++) {
      if (!rows[i][0]) continue;
      var p = formatarData(rows[i][0]).split('/');
      if (p.length !== 3) continue;
      if (!mes || (p[2] + '-' + p[1]) === mes) total++;
    }
    return { ok: true, total: total };
  } catch(e) { return { ok: false, total: 0, erro: e.message }; }
}

function listarAppRegistroAgen(params) {
  try {
    var sh      = getAppRegistroAgenSheet();
    var rows    = sh.getDataRange().getValues();
    var lista   = [];
    var filtPac = (params.paciente || params.nome || '').toString().toUpperCase().trim();
    var filtUsr = (params.usuario  || '').toString().toUpperCase().trim();
    var filtMes = (params.mesAno   || '').toString().trim();
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[0]) continue;
      var dataStr = formatarData(r[0]);
      if (filtMes) {
        var p = dataStr.split('/');
        if (p.length !== 3 || (p[1] + '/' + p[2]) !== filtMes) continue;
      }
      if (filtPac && r[2].toString().toUpperCase().indexOf(filtPac) < 0) continue;
      if (filtUsr && r[11] && r[11].toString().toUpperCase().indexOf(filtUsr) < 0) continue;
      lista.push({
        data:       dataStr,
        hora:       formatarHora(r[1]),
        paciente:   r[2]  ? r[2].toString()  : '',
        telefone:   r[3]  ? r[3].toString()  : '',
        exames:     r[4]  ? r[4].toString()  : '',
        codigos:    r[5]  ? r[5].toString()  : '',
        qtdExames:  r[6]  || 0,
        totalBruto: r[7]  || 0,
        formaPgto:  r[8]  ? r[8].toString()  : 'PIX',
        status:     r[9]  ? r[9].toString()  : 'CONFIRMADO',
        origem:     r[10] ? r[10].toString() : 'APP',
        usuario:    r[11] ? r[11].toString() : 'APP'
      });
    }
    lista.reverse();
    return { ok: true, agendamentos: lista };
  } catch(e) { return { ok: false, agendamentos: [], erro: e.message }; }
}

// ==================== AGENDA: HORÁRIOS OCUPADOS ====================

function listarHorariosOcupados(dataISO) {
  // dataISO = "YYYY-MM-DD", DATA na planilha está em "dd/MM/yyyy"
  try {
    if (!dataISO) return { ok: true, ocupados: [] };
    var partes = dataISO.split('-');
    if (partes.length !== 3) return { ok: true, ocupados: [] };
    var ocupados = [];

    // Fonte única de verdade: eventos reais no Google Agenda nesse dia.
    // (Não usamos a planilha REGISTRO-AGEN aqui — ela é histórico e não reflete
    // cancelamentos; se o evento foi apagado do Google Agenda, o horário deve
    // voltar a ficar disponível.)
    var ano = parseInt(partes[0], 10), mes = parseInt(partes[1], 10), dia = parseInt(partes[2], 10);
    var inicioDia = new Date(ano, mes - 1, dia, 0, 0, 0);
    var fimDia    = new Date(ano, mes - 1, dia, 23, 59, 59);
    var calendar  = CalendarApp.getDefaultCalendar();
    var eventos   = calendar.getEvents(inicioDia, fimDia);
    for (var e = 0; e < eventos.length; e++) {
      ocupados.push(Utilities.formatDate(eventos[e].getStartTime(), Session.getScriptTimeZone(), 'HH:mm'));
    }

    return { ok: true, ocupados: ocupados };
  } catch(e) { return { ok: false, ocupados: [], erro: e.message }; }
}

// ==================== AGENDA: EVENTOS DO GOOGLE CALENDAR (MÊS) ====================

function listarEventosCalendario(params) {
  try {
    var mes = params.mes || ''; // "YYYY-MM"
    var partes = mes.split('-');
    if (partes.length !== 2) return { ok: false, eventos: [], erro: 'Mês inválido' };
    var ano = parseInt(partes[0], 10), mesNum = parseInt(partes[1], 10);
    var inicioMes = new Date(ano, mesNum - 1, 1, 0, 0, 0);
    var fimMes    = new Date(ano, mesNum, 0, 23, 59, 59);
    var calendar   = CalendarApp.getDefaultCalendar();
    var eventosCal = calendar.getEvents(inicioMes, fimMes);
    var eventos = [];
    for (var i = 0; i < eventosCal.length; i++) {
      var ev = eventosCal[i];
      eventos.push({
        id:         ev.getId(),
        titulo:     ev.getTitle(),
        descricao:  ev.getDescription(),
        local:      ev.getLocation(),
        inicio:     ev.getStartTime().toISOString(),
        fim:        ev.getEndTime().toISOString(),
        diaTodo:    ev.isAllDayEvent(),
        compareceu: ev.getTag('compareceu') === 'true'
      });
    }
    eventos.sort(function(a, b) { return new Date(a.inicio) - new Date(b.inicio); });
    return { ok: true, eventos: eventos };
  } catch(e) { return { ok: false, eventos: [], erro: e.message }; }
}

// ==================== AGENDA: MARCAR PACIENTE COMO COMPARECIDO ====================
// Usa uma tag no próprio evento do Google Calendar como fonte da verdade,
// assim o status fica sincronizado entre todos os usuários do painel.

function marcarComparecimento(dados) {
  try {
    var id = dados.id || '';
    if (!id) return { ok: false, erro: 'ID do evento não informado' };
    var evento = CalendarApp.getEventById(id);
    if (!evento) return { ok: false, erro: 'Evento não encontrado no Google Calendar' };
    evento.setTag('compareceu', dados.compareceu ? 'true' : 'false');
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

// ==================== AGENDA: CANCELAR AGENDAMENTO (DESMARCOU / REAGENDAR) ====================
// Exclui o evento do Google Calendar — libera o horário imediatamente para
// outro paciente, já que listarHorariosOcupados() consulta a agenda ao vivo.

function cancelarAgendamento(dados) {
  try {
    var id = dados.id || '';
    if (!id) return { ok: false, erro: 'ID do evento não informado' };
    var evento = CalendarApp.getEventById(id);
    if (!evento) return { ok: false, erro: 'Evento não encontrado no Google Calendar' };
    evento.deleteEvent();
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

// ==================== UPLOAD PDF AO DRIVE ====================

function uploadPDF(dados) {
  try {
    var base64   = dados.base64   || '';
    var filename = dados.filename || ('arquivo_' + new Date().getTime() + '.pdf');
    var mimeType = dados.mimeType || 'application/pdf';
    if (!base64) return { ok: false, erro: 'base64 vazio' };
    var blob     = Utilities.newBlob(Utilities.base64Decode(base64), mimeType, filename);
    var folder   = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    var file     = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return {
      ok:          true,
      fileId:      file.getId(),
      webViewLink: 'https://drive.google.com/file/d/' + file.getId() + '/view',
      fileUrl:     file.getDownloadUrl()
    };
  } catch(e) { return { ok: false, erro: e.message }; }
}


// ==================== SALVAR AGENDAMENTO + GOOGLE CALENDAR ====================

function salvarRegistroAgenComCalendario(dados) {
  // Cria o evento no Google Calendar — salvo na planilha via salvarRegistroAgen
  // Sempre retorna ok:true para que o dashboard prossiga com o salvamento na planilha
  try {
    var startTime = dados.startTime || '';
    var endTime   = dados.endTime   || '';
    if (startTime && endTime) {
      var calendar  = CalendarApp.getDefaultCalendar();
      var startDate = new Date(startTime);
      var endDate   = new Date(endTime);
      var titulo    = 'CDA - ' + (dados.nome || dados.paciente || 'Paciente');
      var descricao = dados.descricao || '';
      if (dados.pdfDriveUrl) descricao += '\n\nPDF: ' + dados.pdfDriveUrl;
      calendar.createEvent(titulo, startDate, endDate, { description: descricao });
    }
  } catch(e) {
    // Falha no Calendar não impede o fluxo — dashboard ainda salva na planilha
    return { ok: true, avisoCalendario: e.message };
  }
  return { ok: true };
}

// ==================== NPS (PESQUISA DE SATISFAÇÃO DO APP) ====================
// Aba "NPS": DATA | HORA | PACIENTE | NOTA | COMENTARIO | ORIGEM

function getNPSSheet() {
  return getSheet('NPS', ['DATA', 'HORA', 'PACIENTE', 'NOTA', 'COMENTARIO', 'ORIGEM']);
}

function salvarNPS(dados) {
  try {
    var sh = getNPSSheet();
    var agora = new Date();
    var data = (dados.data || Utilities.formatDate(agora, Session.getScriptTimeZone(), 'dd/MM/yyyy')).toString();
    var hora = (dados.hora || Utilities.formatDate(agora, Session.getScriptTimeZone(), 'HH:mm')).toString();
    var nota = parseInt(dados.nota);
    if (isNaN(nota) || nota < 0 || nota > 10) return { ok: false, erro: 'Nota inválida' };
    sh.appendRow([
      data,
      hora,
      (dados.paciente || '').toString().toUpperCase(),
      nota,
      (dados.comentario || '').toString(),
      (dados.origem || 'APP').toString().toUpperCase()
    ]);
    // Evita que o Sheets converta DATA/HORA em valores de Data automaticamente
    var linha = sh.getLastRow();
    sh.getRange(linha, 1, 1, 2).setNumberFormat('@').setValues([[data, hora]]);
    SpreadsheetApp.flush();
    return { ok: true };
  } catch(e) { return { ok: false, erro: e.message }; }
}

function resumoNPS() {
  try {
    var sh = getNPSSheet();
    var rows = sh.getDataRange().getValues();
    var promotores = 0, detratores = 0, soma = 0, total = 0;
    for (var i = 1; i < rows.length; i++) {
      var nota = parseInt(rows[i][3]);
      if (isNaN(nota)) continue;
      total++;
      soma += nota;
      if (nota >= 9) promotores++;
      else if (nota <= 6) detratores++;
    }
    if (total === 0) return { ok: true, total: 0, nps: null, media: null };
    return {
      ok: true,
      total: total,
      nps: Math.round(((promotores - detratores) / total) * 100),
      media: Math.round((soma / total) * 10) / 10
    };
  } catch(e) { return { ok: false, erro: e.message }; }
}

// Lista as últimas avaliações (nota + comentário) para o painel exibir —
// mais recentes primeiro, limitado a 50 para não sobrecarregar a resposta.
function listarNPS() {
  try {
    var sh = getNPSSheet();
    var rows = sh.getDataRange().getValues();
    var lista = [];
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][3] === '' || rows[i][3] === null) continue;
      lista.push({
        data:       rows[i][0] ? rows[i][0].toString() : '',
        hora:       rows[i][1] ? rows[i][1].toString() : '',
        paciente:   rows[i][2] ? rows[i][2].toString() : '',
        nota:       rows[i][3],
        comentario: rows[i][4] ? rows[i][4].toString() : ''
      });
    }
    lista.reverse();
    return { ok: true, avaliacoes: lista.slice(0, 50) };
  } catch(e) { return { ok: false, avaliacoes: [], erro: e.message }; }
}

// ==================== CANCELAMENTO PELO APP DO PACIENTE ====================
// O app grava "Codigo de cancelamento: CDA-XXXXXX" na descrição do evento ao
// agendar. Aqui o evento é localizado por data + horário e o cancelamento só
// acontece se o código bater (ou, sem código, se o nome bater no título) —
// impede que um paciente cancele o horário de outro. Como o evento é apagado
// do Google Calendar, o horário volta a aparecer livre na hora (o
// listarHorariosOcupados consulta a agenda ao vivo). Também marca CANCELADO
// na aba APP-REGISTRO-AGEN para o histórico ficar coerente.

function cancelarPorDados(dados) {
  try {
    var partes = (dados.data || '').toString().split('-'); // YYYY-MM-DD
    if (partes.length !== 3) return { ok: false, erro: 'Data inválida' };
    var ano = parseInt(partes[0], 10), mes = parseInt(partes[1], 10), dia = parseInt(partes[2], 10);
    var inicioDia = new Date(ano, mes - 1, dia, 0, 0, 0);
    var fimDia    = new Date(ano, mes - 1, dia, 23, 59, 59);
    var horario = (dados.horario || '').toString().trim();
    var nome    = (dados.nome    || '').toString().trim().toUpperCase();
    var codigo  = (dados.codigo  || '').toString().trim().toUpperCase();
    if (!horario) return { ok: false, erro: 'Horário não informado' };

    var calendar = CalendarApp.getDefaultCalendar();
    var eventos  = calendar.getEvents(inicioDia, fimDia);
    for (var i = 0; i < eventos.length; i++) {
      var ev = eventos[i];
      var hStr = Utilities.formatDate(ev.getStartTime(), Session.getScriptTimeZone(), 'HH:mm');
      if (hStr !== horario) continue;
      var desc = (ev.getDescription() || '').toUpperCase();
      var codigoOk = codigo && desc.indexOf(codigo) !== -1;
      var nomeOk   = nome && ev.getTitle().toUpperCase().indexOf(nome) !== -1;
      if (codigoOk || (!codigo && nomeOk)) {
        ev.deleteEvent();
        marcarAppAgenCancelado(ano, mes, dia, horario, nome);
        return { ok: true };
      }
    }
    return { ok: false, erro: 'Agendamento não encontrado (pode já ter sido cancelado)' };
  } catch(e) { return { ok: false, erro: e.message }; }
}

// Marca STATUS = CANCELADO na aba APP-REGISTRO-AGEN (melhor esforço: se a
// linha não for encontrada, o cancelamento no Calendar já valeu).
function marcarAppAgenCancelado(ano, mes, dia, horario, nome) {
  try {
    var sh = getAppRegistroAgenSheet();
    var rows = sh.getDataRange().getValues();
    var dataBR = ('0' + dia).slice(-2) + '/' + ('0' + mes).slice(-2) + '/' + ano;
    for (var i = rows.length - 1; i >= 1; i--) {
      var rData = formatarData(rows[i][0]);
      var rHora = formatarHora(rows[i][1]);
      var rNome = (rows[i][2] || '').toString().toUpperCase();
      if (rData === dataBR && rHora === horario && (!nome || rNome.indexOf(nome) !== -1)) {
        sh.getRange(i + 1, 10).setValue('CANCELADO');
        SpreadsheetApp.flush();
        return;
      }
    }
  } catch(e) {}
}
