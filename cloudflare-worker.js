// ============================================================
// Cloudflare Worker — proxy da API Claude para o App CDA
// ------------------------------------------------------------
// A CHAVE DA API NÃO FICA MAIS NO APP. Ela fica aqui, como
// variável de ambiente secreta do Worker.
//
// COMO ATUALIZAR O WORKER (dash.cloudflare.com):
// 1. Workers & Pages → labcda-claude → Edit code → cole este arquivo → Deploy
// 2. Na aba Settings → Variables and Secrets → Add:
//       Nome:  ANTHROPIC_API_KEY   (tipo: Secret)
//       Valor: a NOVA chave gerada em console.anthropic.com
//    (a chave antiga sk-ant-...ZUXF-gAA deve ser REVOGADA no console)
// 3. Deploy de novo se pedir.
// ============================================================

const ALLOWED_ORIGINS = [
  'https://labcda.github.io',
  'http://localhost:8090',
  'http://127.0.0.1:8090'
];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, anthropic-version',
    'Access-Control-Max-Age': '86400'
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders(origin) });
    }
    if (!env.ANTHROPIC_API_KEY) {
      return new Response(JSON.stringify({ error: { message: 'ANTHROPIC_API_KEY não configurada no Worker.' } }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } });
    }

    let body;
    try { body = await request.json(); } catch {
      return new Response(JSON.stringify({ error: { message: 'JSON inválido.' } }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } });
    }

    // Trava de abuso: só aceita o formato que o app usa e limita o tamanho da resposta.
    body.model = 'claude-sonnet-5';
    body.max_tokens = Math.min(Number(body.max_tokens) || 2000, 2048);
    delete body.stream;

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': request.headers.get('anthropic-version') || '2023-06-01'
      },
      body: JSON.stringify(body)
    });

    const text = await resp.text();
    return new Response(text, {
      status: resp.status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
    });
  }
};
