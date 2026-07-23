// ============================================================
// ADIÇÕES AO APPS SCRIPT DO CDA — cancelamento pelo app + NPS
// ============================================================
// Feito sob medida para o script atual (o que tem doGet/doPost com
// resposta(), getSheet(), TOKEN etc.). São 3 passos:
//
// PASSO 1 — no doGet, adicione esta linha junto das outras actions:
//
//   if (action === 'resumoNPS')              return resposta(resumoNPS());
//
// PASSO 2 — no doPost, adicione estas duas linhas junto das outras:
//
//   if (action === 'salvarNPS')              return resposta(salvarNPS(dados));
//   if (action === 'cancelarPorDados')       return resposta(cancelarPorDados(dados));
//
// PASSO 3 — cole as funções abaixo no final do arquivo.
// Depois: Implantar → Gerenciar implantações → editar (lápis) →
// Nova versão → Implantar. (A URL /exec continua a mesma.)
// ============================================================

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
    // Evita que o Sheets converta DATA/HORA automaticamente (mesmo padrão do resto do script)
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
