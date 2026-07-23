// ============================================================
// ADIÇÃO — lista as avaliações/comentários do NPS no painel
// ============================================================
// Você já colou o script completo antes (com resumoNPS, salvarNPS,
// cancelarPorDados). Esta é só uma ação NOVA para o card de NPS do painel
// abrir um modal com as avaliações e comentários individuais.
//
// PASSO 1 — no doGet, adicione esta linha junto de "resumoNPS":
//
//   if (action === 'listarNPS')               return resposta(listarNPS());
//
// PASSO 2 — cole a função abaixo no final do arquivo.
// Depois: Implantar → Gerenciar implantações → editar (lápis) →
// Nova versão → Implantar.
// ============================================================

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
