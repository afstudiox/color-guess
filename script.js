// Seleciona todos os elementos com a classe "ball".
// querySelectorAll retorna uma lista de elementos, porque existem várias bolas no HTML.
const balls = document.querySelectorAll('.ball');

// Seleciona o elemento que agrupa todas as bolas.
// Ele será usado para escutar cliques em qualquer bola dentro dele.
const circles = document.querySelector('#circles');

// Seleciona o parágrafo onde será exibida a cor RGB que o jogador deve adivinhar.
const rgbOrigem = document.querySelector('#rgb-color');

// Seleciona o parágrafo usado para mostrar se o jogador acertou ou errou.
const resposta = document.querySelector('#answer');

// Seleciona o botão responsável por reiniciar uma rodada do jogo.
const btnReset = document.querySelector('#reset-game');

// Seleciona o elemento onde a pontuação será exibida.
const txtPlacar = document.querySelector('#score');

// Seleciona a lista ordenada onde as melhores pontuações serão exibidas.
const listaBestScores = document.querySelector('#best-scores');

// Define a chave usada para armazenar e recuperar as melhores pontuações no localStorage.
const BEST_SCORES_KEY = 'colorGuessBestScores';

// Guarda a pontuação atual do jogador.
// let é usado porque esse valor muda durante o jogo.
let placar = 0;

// Atualiza o texto do placar na tela com o valor atual da variável placar.
function atualizaPlacar() {
  txtPlacar.textContent = placar;
}

// Cria uma cor RGB aleatória.
// Cada canal de cor pode ir de 0 até 255.
function rgbAleatorio() {
  const vermelho = Math.floor(Math.random() * 256);
  const verde = Math.floor(Math.random() * 256);
  const azul = Math.floor(Math.random() * 256);

  // Retorna uma string no formato esperado pelo CSS: rgb(0, 0, 0).
  return `rgb(${vermelho}, ${verde}, ${azul})`;
}

// Sorteia uma posição válida dentro da lista de bolas.
// Esse índice será usado para escolher qual cor o jogador deve adivinhar.
function ballAleatorio() {
  return Math.floor(Math.random() * balls.length);
}

// Prepara uma nova rodada do jogo.
function criaBalls() {
  // Percorre todas as bolas e atribui uma cor aleatória para cada uma.
  for (const ball of balls) {
    ball.style.backgroundColor = rgbAleatorio();
  }

  // Escolhe uma das cores já aplicadas nas bolas e mostra essa cor como desafio.
  rgbOrigem.textContent = balls[ballAleatorio()].style.backgroundColor;

  // Reinicia a mensagem de resposta para o estado inicial da rodada.
  resposta.textContent = 'Escolha uma cor';

  // Garante que o placar exibido na tela esteja sincronizado com a variável placar.
  atualizaPlacar();
}

// Compara a cor clicada pelo jogador com a cor exibida no desafio.
function comparaCor(event) {
  // event.target representa o elemento exato que recebeu o clique.
  const ballClicada = event.target;

  // Evita que cliques no container sejam tratados como tentativa de resposta.
  if (!ballClicada.classList.contains('ball')) {
    return;
  }

  // Compara a cor da bola clicada com o texto da cor sorteada.
  if (ballClicada.style.backgroundColor === rgbOrigem.textContent) {
    resposta.textContent = 'Acertou!';
    placar += 3;
    atualizaPlacar();
  } else {
    resposta.textContent = 'Errou! Tente novamente!';
  }
}

// Recupera as melhores pontuações salvas no localStorage.
function buscaBestScores() {
  const scoresSalvos = localStorage.getItem(BEST_SCORES_KEY);

  // Se não houver pontuações salvas, retorna um array vazio.
  if (!scoresSalvos) {
    return [];
  }

  // Converte a string JSON de volta para um array de números.
  return JSON.parse(scoresSalvos);
};

// Salva as melhores pontuações no localStorage.
function salvaBestScores(scores) {
   localStorage.setItem(BEST_SCORES_KEY, scoresJSON);
};

// Adiciona um escutador de evento no container das bolas.
// Assim, um único listener consegue tratar o clique em qualquer bola.
circles.addEventListener('click', comparaCor);

// Inicia o jogo assim que o script é carregado.
criaBalls();