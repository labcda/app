// ============================================================
// ADIÇÕES AO APPS SCRIPT — novas funcionalidades do App CDA
// ============================================================
// Existem DOIS scripts. Cole cada bloco no script certo:
//
//  BLOCO 1 → script da AGENDA (o que tem as actions 'criar' e 'listar'
//            do Google Calendar — URL AKfycbyaCe1...)
//  BLOCO 2 → script do PAINEL (o que tem 'salvarAppOrcamento',
//            'contarOrcamentos' etc. — URL AKfycbyNAnEv...)
//
// Em cada script: adicione o "case" no switch do doPost e cole a função.
// Depois: Implantar → Gerenciar implantações → editar → Nova versão.
// ============================================================


// ================= BLOCO 1 — SCRIPT DA AGENDA =================
// No switch do doPost, adicione:
//   case 'cancelarPorDados': return cancelarPorDados(dados);

// Cancela um evento do calendário localizado por data + horário + nome.
// O código de cancelamento (gravado na descrição pelo app) é conferido
// quando presente, impedindo que um paciente cancele o horário de outro.
function cancelarPorDados(dados) {
  try {
    var partes = String(dados.data || '').split('-'); // YYYY-MM-DD
    if (partes.length !== 3) return _json({ ok: false, erro: 'Data inválida' });
    var inicio = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]), 0, 0);
    var fim    = new Date(Number(partes[0]), Number(partes[1]) - 1, Number(partes[2]), 23, 59);
    var cal = CalendarApp.getDefaultCalendar(); // ajuste se usar calendário específico
    var eventos = cal.getEvents(inicio, fim);
    var horario = String(dados.horario || '').trim();
    var nome = String(dados.nome || '').trim().toUpperCase();
    var codigo = String(dados.codigo || '').trim().toUpperCase();

    for (var i = 0; i < eventos.length; i++) {
      var ev = eventos[i];
      var h = ev.getStartTime();
      var hStr = ('0' + h.getHours()).slice(-2) + ':' + ('0' + h.getMinutes()).slice(-2);
      if (hStr !== horario) continue;
      var tituloOk = ev.getTitle().toUpperCase().indexOf(nome) !== -1;
      var desc = String(ev.getDescription() || '').toUpperCase();
      var codigoOk = codigo ? desc.indexOf(codigo) !== -1 : false;
      // Cancela se o código bater; sem código, exige que o nome bata
      if (codigoOk || (tituloOk && !codigo)) {
        ev.deleteEvent();
        return _json({ ok: true });
      }
    }
    return _json({ ok: false, erro: 'Agendamento não encontrado' });
  } catch (e) {
    return _json({ ok: false, erro: String(e) });
  }
}

// Se o script da agenda não tiver um helper de resposta JSON, cole também:
function _json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}


// ================= BLOCO 2 — SCRIPT DO PAINEL =================
// No switch do doPost, adicione:
//   case 'salvarNPS': return salvarNPS(dados);
// No switch do doGet, adicione:
//   case 'resumoNPS': return resumoNPS();

var NPS_ABA = 'NPS'; // aba criada automaticamente na planilha do painel

function salvarNPS(dados) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName(NPS_ABA);
    if (!aba) {
      aba = ss.insertSheet(NPS_ABA);
      aba.appendRow(['DATA', 'HORA', 'PACIENTE', 'NOTA', 'COMENTARIO', 'ORIGEM']);
    }
    aba.appendRow([
      String(dados.data || ''),
      String(dados.hora || ''),
      String(dados.paciente || ''),
      Number(dados.nota),
      String(dados.comentario || ''),
      String(dados.origem || 'APP')
    ]);
    return _json({ ok: true });
  } catch (e) {
    return _json({ ok: false, erro: String(e) });
  }
}

function resumoNPS() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName(NPS_ABA);
    if (!aba || aba.getLastRow() < 2) {
      return _json({ ok: true, total: 0, nps: null, media: null });
    }
    var valores = aba.getRange(2, 4, aba.getLastRow() - 1, 1).getValues();
    var promotores = 0, detratores = 0, soma = 0, total = 0;
    for (var i = 0; i < valores.length; i++) {
      var nota = Number(valores[i][0]);
      if (isNaN(nota)) continue;
      total++;
      soma += nota;
      if (nota >= 9) promotores++;
      else if (nota <= 6) detratores++;
    }
    if (total === 0) return _json({ ok: true, total: 0, nps: null, media: null });
    var nps = Math.round(((promotores - detratores) / total) * 100);
    return _json({ ok: true, total: total, nps: nps, media: Math.round((soma / total) * 10) / 10 });
  } catch (e) {
    return _json({ ok: false, erro: String(e) });
  }
}
