const balls = document.querySelectorAll('.ball');
const circles = document.querySelector('#circles');
const rgbOrigem = document.querySelector('#rgb-color');
const resposta = document.querySelector('#answer');
const btnReset = document.querySelector('#reset-game');
const txtPlacar = document.querySelector('#score');

let placar = 0;

function atualizaPlacar() {
  txtPlacar.textContent = placar;
}

function rgbAleatorio() {
  const vermelho = Math.floor(Math.random() * 256);
  const verde = Math.floor(Math.random() * 256);
  const azul = Math.floor(Math.random() * 256);

  return `rgb(${vermelho}, ${verde}, ${azul})`;
}

function ballAleatorio() {
  return Math.floor(Math.random() * balls.length);
}

function criaBalls() {
  for (const ball of balls) {
    ball.style.backgroundColor = rgbAleatorio();
  }

  rgbOrigem.textContent = balls[ballAleatorio()].style.backgroundColor;
  resposta.textContent = 'Escolha uma cor';
  atualizaPlacar();
}

function comparaCor(event) {
  const ballClicada = event.target;

  if (!ballClicada.classList.contains('ball')) {
    return;
  }

  if (ballClicada.style.backgroundColor === rgbOrigem.textContent) {
    resposta.textContent = 'Acertou!';
    placar += 3;
    atualizaPlacar();
  } else {
    resposta.textContent = 'Errou! Tente novamente!';
  }
}

circles.addEventListener('click', comparaCor);
btnReset.addEventListener('click', criaBalls);

criaBalls();
