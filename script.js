/**
 * SUSTENTABILIDADE E ORGÂNICOS — script.js
 * Responsabilidades:
 *  1. Animações de revelação ao rolar (Intersection Observer)
 *  2. Animação das barras de benefícios
 *  3. Menu hambúrguer mobile
 *  4. Quiz interativo com 5 perguntas
 *  5. Ano automático no rodapé
 */

// ─────────────────────────────────────────────
// 1. ANO AUTOMÁTICO NO RODAPÉ
// ─────────────────────────────────────────────
(function setFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
})();


// ─────────────────────────────────────────────
// 2. ROLAGEM SUAVE (reforço para browsers antigos)
// ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();

    // Fecha menu mobile se estiver aberto
    closeMenu();

    const headerHeight = document.querySelector('.site-header').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top: top, behavior: 'smooth' });
  });
});


// ─────────────────────────────────────────────
// 3. MENU HAMBÚRGUER MOBILE
// ─────────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const mainNav   = document.getElementById('main-nav');

function openMenu() {
  mainNav.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  navToggle.setAttribute('aria-label', 'Fechar menu');
}

function closeMenu() {
  mainNav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menu');
}

if (navToggle) {
  navToggle.addEventListener('click', function() {
    const isOpen = mainNav.classList.contains('open');
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });

  // Fecha ao clicar fora do menu
  document.addEventListener('click', function(e) {
    if (!mainNav.contains(e.target) && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // Fecha ao pressionar Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
  });
}


// ─────────────────────────────────────────────
// 4. INTERSECTION OBSERVER — revelação + barras
// ─────────────────────────────────────────────
const revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(function(el) {
  revealObserver.observe(el);
});

// Observer específico para animar as barras de benefícios
const barObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      const item = entry.target;
      const fill = item.querySelector('.ben-fill');
      if (!fill) return;

      const targetWidth = fill.getAttribute('data-width') + '%';
      fill.style.setProperty('--target-width', targetWidth);
      item.classList.add('bar-animated');
      barObserver.unobserve(item);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.beneficio-item').forEach(function(item) {
  barObserver.observe(item);
});


// ─────────────────────────────────────────────
// 5. QUIZ INTERATIVO
// ─────────────────────────────────────────────

/** Banco de perguntas */
var quizData = [
  {
    pergunta: 'O que é agricultura orgânica?',
    opcoes: [
      'Sistema de produção que usa agrotóxicos sintéticos para maior rendimento.',
      'Produção agrícola que evita insumos químicos sintéticos e respeita o ecossistema.',
      'Cultivo exclusivo de plantas ornamentais sem fins alimentares.',
      'Técnica de cultivo em ambiente urbano usando hidroponia industrial.'
    ],
    correta: 1,
    feedback: 'A agricultura orgânica é definida justamente por excluir agrotóxicos sintéticos e priorizar o equilíbrio dos ecossistemas.'
  },
  {
    pergunta: 'Qual é o principal objetivo da rotação de culturas?',
    opcoes: [
      'Aumentar o uso de agrotóxicos para controlar pragas.',
      'Plantar a mesma espécie repetidamente para maximizar a produção.',
      'Alternar culturas para equilibrar nutrientes e reduzir pragas naturalmente.',
      'Utilizar apenas plantas transgênicas em toda a área cultivada.'
    ],
    correta: 2,
    feedback: 'Alternar diferentes culturas evita o esgotamento de nutrientes e interrompe ciclos de pragas sem precisar de químicos.'
  },
  {
    pergunta: 'Como a compostagem contribui para a sustentabilidade?',
    opcoes: [
      'Aumenta o volume de lixo enviado para aterros sanitários.',
      'Transforma resíduos orgânicos em adubo natural, reduzindo o lixo e nutrindo o solo.',
      'Elimina todos os microrganismos do solo, deixando-o estéril.',
      'Substitui completamente a necessidade de luz solar nas plantações.'
    ],
    correta: 1,
    feedback: 'A compostagem transforma restos orgânicos em adubo rico em nutrientes, reduzindo resíduos e dispensando fertilizantes sintéticos.'
  },
  {
    pergunta: 'Por que a preservação de abelhas é essencial para a agricultura?',
    opcoes: [
      'Abelhas produzem mel, que é usado como fertilizante industrial.',
      'Elas combatem diretamente as pragas agrícolas mais comuns.',
      'São responsáveis pela polinização de cerca de 75% das plantas cultivadas.',
      'Abelhas controlam o crescimento de ervas daninhas nas lavouras.'
    ],
    correta: 2,
    feedback: 'Sem polinizadores como as abelhas, a maioria das nossas frutas, verduras e sementes não poderia se reproduzir.'
  },
  {
    pergunta: 'Qual técnica de irrigação é mais eficiente no uso da água?',
    opcoes: [
      'Irrigação por aspersão em larga escala ao meio-dia.',
      'Irrigação por inundação de toda a área de plantio.',
      'Uso de mangueiras abertas sem controle de vazão.',
      'Irrigação por gotejamento, que leva água diretamente às raízes.'
    ],
    correta: 3,
    feedback: 'O gotejamento entrega água diretamente na raiz da planta, economizando até 70% comparado a métodos convencionais.'
  }
];

/** Mensagens de feedback conforme desempenho */
function getMensagem(acertos, total) {
  var pct = (acertos / total) * 100;
  if (pct === 100) {
    return '🌟 Incrível! Você acertou tudo! Você é um verdadeiro guardião do planeta. Continue espalhando o conhecimento!';
  } else if (pct >= 80) {
    return '🌿 Excelente! Você conhece muito bem o tema. Continue aprendendo e inspire outras pessoas!';
  } else if (pct >= 60) {
    return '🌱 Bom resultado! Você já tem uma boa base. Explore mais o conteúdo do site para aprender ainda mais.';
  } else if (pct >= 40) {
    return '🍃 Continue tentando! Leia o conteúdo das seções acima e tente novamente — você vai melhorar!';
  } else {
    return '🌏 Não desanime! A jornada da sustentabilidade começa com o aprendizado. Releia o site e tente de novo!';
  }
}

/** Estado do quiz */
var quizState = {
  indice: 0,
  acertos: 0,
  respondida: false
};

var quizContainer = document.getElementById('quiz-container');

/** Renderiza a tela inicial do quiz */
function renderQuizInicio() {
  quizContainer.innerHTML =
    '<div class="quiz-start" role="region" aria-live="polite">' +
      '<div style="font-size:3rem;margin-bottom:16px;" aria-hidden="true">🧠</div>' +
      '<p>5 perguntas sobre sustentabilidade e agricultura orgânica.<br>Teste o que você aprendeu!</p>' +
      '<button class="btn-quiz-start" id="btn-iniciar" aria-label="Iniciar quiz">' +
        '🌱 Iniciar Quiz' +
      '</button>' +
    '</div>';

  document.getElementById('btn-iniciar').addEventListener('click', function() {
    quizState.indice = 0;
    quizState.acertos = 0;
    quizState.respondida = false;
    renderPergunta();
  });
}

/** Renderiza uma pergunta */
function renderPergunta() {
  var q = quizData[quizState.indice];
  var progresso = ((quizState.indice) / quizData.length) * 100;

  var opcoesHTML = '';
  q.opcoes.forEach(function(opcao, i) {
    opcoesHTML +=
      '<button class="quiz-opt" data-index="' + i + '" aria-label="Opção ' + (i + 1) + ': ' + opcao + '">' +
        '<strong style="color:var(--verde-musgo);margin-right:8px;">' + (i + 1) + '.</strong> ' + opcao +
      '</button>';
  });

  quizContainer.innerHTML =
    '<div class="quiz-question-box" role="region" aria-live="polite">' +
      '<div class="quiz-progress">' +
        '<div class="quiz-progress-bar" role="progressbar" aria-valuenow="' + quizState.indice + '" aria-valuemin="0" aria-valuemax="' + quizData.length + '" aria-label="Progresso do quiz">' +
          '<span class="quiz-progress-fill" style="width:' + progresso + '%"></span>' +
        '</div>' +
        '<span class="quiz-progress-label">Pergunta ' + (quizState.indice + 1) + ' de ' + quizData.length + '</span>' +
      '</div>' +
      '<p class="quiz-q-text">' + q.pergunta + '</p>' +
      '<div class="quiz-options" role="group" aria-label="Opções de resposta">' +
        opcoesHTML +
      '</div>' +
      '<div id="quiz-feedback" style="margin-top:20px;font-size:0.9rem;display:none;"></div>' +
    '</div>';

  // Adiciona eventos às opções
  document.querySelectorAll('.quiz-opt').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (quizState.respondida) return;
      responder(parseInt(this.getAttribute('data-index')));
    });

    // Suporte a teclado (Enter já funciona por padrão em <button>)
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!quizState.respondida) responder(parseInt(this.getAttribute('data-index')));
      }
    });
  });
}

/** Processa a resposta do usuário */
function responder(indexEscolhido) {
  quizState.respondida = true;
  var q = quizData[quizState.indice];
  var btns = document.querySelectorAll('.quiz-opt');

  // Desabilita todos os botões
  btns.forEach(function(b) { b.disabled = true; });

  // Marca correto/errado
  btns[q.correta].classList.add('correct');
  if (indexEscolhido !== q.correta) {
    btns[indexEscolhido].classList.add('wrong');
  } else {
    quizState.acertos++;
  }

  // Exibe feedback
  var feedbackEl = document.getElementById('quiz-feedback');
  var acertou = indexEscolhido === q.correta;
  feedbackEl.style.display = 'block';
  feedbackEl.style.padding = '14px 18px';
  feedbackEl.style.borderRadius = '12px';
  feedbackEl.style.lineHeight = '1.6';
  if (acertou) {
    feedbackEl.style.background = 'var(--verde-palido)';
    feedbackEl.style.color = 'var(--verde-escuro)';
    feedbackEl.innerHTML = '✅ <strong>Correto!</strong> ' + q.feedback;
  } else {
    feedbackEl.style.background = '#fdecea';
    feedbackEl.style.color = '#c0392b';
    feedbackEl.innerHTML = '❌ <strong>Errado.</strong> ' + q.feedback;
  }

  // Botão "Próxima"
  var btnLabel = (quizState.indice + 1 < quizData.length) ? '→ Próxima Pergunta' : '🏁 Ver Resultado';
  var btnProx = document.createElement('button');
  btnProx.textContent = btnLabel;
  btnProx.setAttribute('aria-label', btnLabel);
  btnProx.style.cssText =
    'margin-top:20px;display:inline-flex;align-items:center;gap:8px;' +
    'background:var(--verde-musgo);color:#fff;font-weight:700;font-size:0.95rem;' +
    'padding:12px 28px;border-radius:50px;cursor:pointer;border:none;font-family:inherit;' +
    'transition:background 0.3s,transform 0.3s;box-shadow:0 4px 16px rgba(74,124,47,0.25);';

  btnProx.addEventListener('mouseenter', function() {
    this.style.background = 'var(--verde-escuro)';
    this.style.transform = 'translateY(-2px)';
  });
  btnProx.addEventListener('mouseleave', function() {
    this.style.background = 'var(--verde-musgo)';
    this.style.transform = 'translateY(0)';
  });
  btnProx.addEventListener('focus', function() { this.style.outline = '3px solid var(--verde-medio)'; });
  btnProx.addEventListener('blur',  function() { this.style.outline = 'none'; });

  btnProx.addEventListener('click', function() {
    quizState.indice++;
    quizState.respondida = false;
    if (quizState.indice < quizData.length) {
      renderPergunta();
    } else {
      renderResultado();
    }
  });

  document.querySelector('.quiz-question-box').appendChild(btnProx);
  btnProx.focus(); // acessibilidade
}

/** Renderiza o resultado final */
function renderResultado() {
  var acertos = quizState.acertos;
  var total   = quizData.length;
  var msg     = getMensagem(acertos, total);

  quizContainer.innerHTML =
    '<div class="quiz-result" role="region" aria-live="assertive" aria-label="Resultado do quiz">' +
      '<div class="quiz-score-num">' + acertos + '/' + total + '</div>' +
      '<p class="quiz-score-label">perguntas corretas</p>' +
      '<p class="quiz-result-msg">' + msg + '</p>' +
      '<button class="btn-quiz-restart" id="btn-reiniciar" aria-label="Tentar novamente o quiz">' +
        '🔄 Tentar Novamente' +
      '</button>' +
    '</div>';

  document.getElementById('btn-reiniciar').addEventListener('click', renderQuizInicio);
}

// Inicializa o quiz
if (quizContainer) {
  renderQuizInicio();
}
