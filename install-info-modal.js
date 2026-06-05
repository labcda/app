/**
 * MODAL DE INFORMAÇÕES DE INSTALAÇÃO
 * Com instruções detalhadas para iOS (Safari) e Android (Chrome/Firefox)
 */

let deferredPrompt = null;

// Detecta se o dispositivo é iOS ou Android
function detectarDispositivo() {
  const ua = navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  return 'desktop';
}

// Cria o modal de informações
function criarModalInstalacao() {
  const html = `
    <div id="installInfoModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 hidden">
      <div class="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-fade-in">
        <!-- Header -->
        <div class="bg-gradient-to-r from-cda-primary to-cda-primary-dark px-6 py-6 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <i class="fa-solid fa-download text-white text-lg"></i>
            </div>
            <h3 class="text-white font-bold text-lg">Como Instalar o App</h3>
          </div>
          <button onclick="fecharModalInstalacao()" class="text-white/70 hover:text-white transition">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <!-- Conteúdo -->
        <div id="installContent" class="p-6 space-y-4 max-h-96 overflow-y-auto">
          <!-- Será preenchido dinamicamente -->
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
          <button onclick="fecharModalInstalacao()" class="flex-1 px-4 py-2.5 rounded-xl font-semibold text-slate-700 hover:bg-slate-200 transition">
            Entendi
          </button>
          <button id="btnInstalarAgora" onclick="triggerInstall()" class="flex-1 px-4 py-2.5 rounded-xl font-semibold btn-cda-primary text-white transition">
            Instalar Agora
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', html);
  preencherInstrucoesInstalacao();
}

// Preenche as instruções de instalação baseado no dispositivo
function preencherInstrucoesInstalacao() {
  const dispositivo = detectarDispositivo();
  const content = document.getElementById('installContent');
  
  if (dispositivo === 'ios') {
    content.innerHTML = `
      <div class="space-y-4">
        <div class="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p class="text-sm font-semibold text-blue-900 mb-2">📱 iPhone ou iPad</p>
          <div class="text-sm text-blue-800 space-y-2">
            <p><strong>Passo 1:</strong> Toque no ícone de <strong>Compartilhar</strong> (seta saindo da caixa) na barra inferior do Safari.</p>
            <p><strong>Passo 2:</strong> Role para baixo e procure por <strong>"Adicionar à Tela de Início"</strong>.</p>
            <p><strong>Passo 3:</strong> Escolha o nome do app (pode deixar como está: "Laboratório CDA").</p>
            <p><strong>Passo 4:</strong> Toque em <strong>"Adicionar"</strong> no canto superior direito.</p>
            <p><strong>Pronto!</strong> O app agora está na sua tela inicial com ícone e tudo! 🎉</p>
          </div>
        </div>
        
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p class="text-sm font-semibold text-amber-900 mb-2">💡 Dica:</p>
          <p class="text-sm text-amber-800">Após instalar, o app funcionará como um aplicativo nativo, mesmo sem internet! Todos os dados são salvos no seu telefone.</p>
        </div>
      </div>
    `;
  } else if (dispositivo === 'android') {
    content.innerHTML = `
      <div class="space-y-4">
        <div class="bg-green-50 border border-green-200 rounded-xl p-4">
          <p class="text-sm font-semibold text-green-900 mb-2">🤖 Android</p>
          <div class="text-sm text-green-800 space-y-2">
            <p><strong>Passo 1:</strong> Toque no menu (três pontos ⋮) no canto superior direito do navegador.</p>
            <p><strong>Passo 2:</strong> Procure por <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à Tela de Início"</strong>.</p>
            <p><strong>Passo 3:</strong> Uma tela pode aparecer perguntando permissão - toque em <strong>"Instalar"</strong>.</p>
            <p><strong>Passo 4:</strong> Pronto! O app aparecerá na sua biblioteca de apps e na tela inicial! 🎉</p>
          </div>
        </div>
        
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p class="text-sm font-semibold text-amber-900 mb-2">💡 Dicas:</p>
          <ul class="text-sm text-amber-800 space-y-1 list-disc list-inside">
            <li>Se não ver a opção de instalar, atualize seu navegador Chrome ou Firefox</li>
            <li>O app funciona offline após instalado! 📡❌ = ✅</li>
            <li>Você pode desinstalar normalmente como qualquer outro app</li>
          </ul>
        </div>
      </div>
    `;
  } else {
    content.innerHTML = `
      <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
        <p class="text-sm text-slate-700"><strong>Para Desktop:</strong> Você pode usar o navegador normalmente. O PWA é otimizado para mobile!</p>
        <p class="text-sm text-slate-600">📱 Acesse pelo seu celular para instalar como app nativo com acesso offline.</p>
      </div>
    `;
  }
}

// Abre o modal
function abrirModalInstalacao() {
  const modal = document.getElementById('installInfoModal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

// Fecha o modal
function fecharModalInstalacao() {
  const modal = document.getElementById('installInfoModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// Event Listeners para detecção de PWA
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBanner').classList.remove('hidden');
});

window.addEventListener('appinstalled', () => {
  console.log('PWA foi instalado com sucesso!');
  const banner = document.getElementById('installBanner');
  if (banner) banner.classList.add('hidden');
});

// Funções de controle
function triggerInstall() {
  const dispositivo = detectarDispositivo();
  
  if (dispositivo === 'ios') {
    abrirModalInstalacao();
  } else if (dispositivo === 'android' && deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou instalar');
        fecharModalInstalacao();
      }
      deferredPrompt = null;
    });
  } else {
    abrirModalInstalacao();
  }
}

function dismissInstall() {
  const banner = document.getElementById('installBanner');
  if (banner) banner.classList.add('hidden');
}

// Inicializar modal ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('installInfoModal')) {
    criarModalInstalacao();
  }
});
