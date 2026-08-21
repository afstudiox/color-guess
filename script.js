// Seleciona todos os elementos com a classe "ball".
// querySelectorAll retorna uma lista de elementos, porque existem várias bolas no HTML.
const balls = document.querySelectorAll('.ball');

// Seleciona o elemento que agrupa todas as bolas.
// Ele será usado para escutar cliques em qualquer bola dentro dele.
const circles = document.querySelector('#circles');

// Seleciona os três spans onde cada canal da cor-alvo será exibido.
const spanVermelho = document.querySelector('#valor-r');
const spanVerde = document.querySelector('#valor-g');
const spanAzul = document.querySelector('#valor-b');

// Seleciona o parágrafo usado para mostrar se o jogador acertou ou errou.
const resposta = document.querySelector('#answer');

// Seleciona o elemento onde a pontuação será exibida.
const txtPlacar = document.querySelector('#score');

// Seleciona a lista ordenada onde as melhores pontuações serão exibidas.
const listaBestScores = document.querySelector('#best-scores');

// Define a chave usada para armazenar e recuperar as melhores pontuações no localStorage.
const BEST_SCORES_KEY = 'colorGuessBestScores';

// Guarda a pontuação atual do jogador.
// let é usado porque esse valor muda durante o jogo.
let placar = 0;

// Guarda a cor que o jogador deve adivinhar na rodada atual.
// Começa nula e é preenchida a cada rodada em criaBalls.
let corAlvo = null;

// Atualiza o texto do placar na tela com o valor atual da variável placar.
function atualizaPlacar() {
  txtPlacar.textContent = placar;
}

// Gera uma cor RGB aleatória.
// Retorna um OBJETO com os três canais separados, em vez de uma string.
// Guardar os números (dados "brutos") é a peça-chave: formatamos para
// string somente quando precisamos exibir ou usar no CSS.
function rgbAleatorio() {
  return {
    vermelho: Math.floor(Math.random() * 256),
    verde: Math.floor(Math.random() * 256),
    azul: Math.floor(Math.random() * 256),
  };
}

// Converte um objeto de cor { vermelho, verde, azul } na string que o CSS entende.
// Exemplo: { vermelho: 120, verde: 45, azul: 200 } -> "rgb(120, 45, 200)".
function formataRGB(cor) {
  return `rgb(${cor.vermelho}, ${cor.verde}, ${cor.azul})`;
}

// Sorteia uma posição (índice) válida dentro da lista de bolas.
// Esse índice será usado para escolher qual cor o jogador deve adivinhar.
function ballAleatorio() {
  return Math.floor(Math.random() * balls.length);
}

// Exibe os valores da cor-alvo nos três spans coloridos da tela.
function atualizaSpans(cor) {
  spanVermelho.textContent = cor.vermelho;
  spanVerde.textContent = cor.verde;
  spanAzul.textContent = cor.azul;
}

// Prepara uma nova rodada do jogo.
function criaBalls() {
  // Gera as 6 cores e pinta as bolas, guardando cada cor num array.
  // O array "cores" preserva os OBJETOS de cor, para não perdê-los
  // depois que viram string no backgroundColor.
  const cores = [];

  for (const ball of balls) {
    const cor = rgbAleatorio();
    cores.push(cor);
    ball.style.backgroundColor = formataRGB(cor);
  }

  // Sorteia uma das 6 cores para ser o alvo da rodada.
  corAlvo = cores[ballAleatorio()];

  // Mostra os valores da cor-alvo nos spans.
  atualizaSpans(corAlvo);
}

// Compara a cor clicada pelo jogador com a cor-alvo da rodada.
function comparaCor(event) {
  // event.target representa o elemento exato que recebeu o clique.
  const ballClicada = event.target;

  // Evita que cliques no container sejam tratados como tentativa de resposta.
  if (!ballClicada.classList.contains('ball')) {
    return;
  }

  // Compara a cor da bola clicada com a cor-alvo formatada em string.
  // Como ambos são formatados pela mesma função, a comparação é confiável.
  if (ballClicada.style.backgroundColor === formataRGB(corAlvo)) {
    registraAcerto();
  } else {
    registraErro();
  }
}

// Recupera as melhores pontuações salvas no localStorage.
function buscaBestScores() {
  const scoresSalvos = localStorage.getItem(BEST_SCORES_KEY);

  // Se não houver pontuações salvas, retorna um array vazio.
  if (!scoresSalvos) {
    return [];
  }

  try {
    // Converte a string JSON de volta para um array de números.
    const scores = JSON.parse(scoresSalvos);

    if (!Array.isArray(scores)) {
      return [];
    }

    return scores.filter((score) => typeof score === 'number');
  } catch (error) {
    return [];
  }
}

// Salva as melhores pontuações no localStorage.
function salvaBestScores(scores) {
  const scoresJSON = JSON.stringify(scores);
  localStorage.setItem(BEST_SCORES_KEY, scoresJSON);
}

// Renderiza as melhores pontuações na tela.
function renderizaBestScores() {
  const scores = buscaBestScores();

  listaBestScores.innerHTML = '';

  for (const score of scores) {
    const item = document.createElement('li');
    item.textContent = `${score} pontos`;
    listaBestScores.appendChild(item);
  }
}

// Atualiza a pontuação da rodada quando o jogador acerta.
function registraAcerto() {
  placar += 3;
  atualizaPlacar();
  criaBalls();
  resposta.textContent = 'Acertou! Nova cor sorteada.';
}

// Registra a pontuação final da rodada e atualiza a lista de melhores pontuações.
function registraPontuacao(pontuacaoFinal) {
  if (pontuacaoFinal <= 0) {
    return;
  }

  const scores = buscaBestScores();

  scores.push(pontuacaoFinal);

  const melhoresScores = scores
    .sort((scoreAtual, proximoScore) => proximoScore - scoreAtual)
    .slice(0, 3);

  salvaBestScores(melhoresScores);
  renderizaBestScores();
}

// Finaliza a rodada quando o jogador erra.
function registraErro() {
  const pontuacaoFinal = placar;

  registraPontuacao(pontuacaoFinal);
  placar = 0;
  atualizaPlacar();
  criaBalls();
  resposta.textContent = `Errou! Pontuação registrada: ${pontuacaoFinal}.`;
}

// Adiciona um escutador de evento no container das bolas.
// Assim, um único listener consegue tratar o clique em qualquer bola.
circles.addEventListener('click', comparaCor);

// Inicializa o jogo quando a página é carregada.
atualizaPlacar();
criaBalls();
renderizaBestScores();
