const balls = document.querySelectorAll('.ball');  
const circles = document.querySelector('#circles');
const rgbOrigem = document.querySelector('#rgb-color');
const resposta = document.querySelector('#answer');
const btnReset = document.querySelector('#reset-game');
const txtPlacar = document.querySelector('#score');
let placar = 0;



circles.addEventListener('click',comparaCor);
btnReset.addEventListener('click',reload);

function criaBalls(){
  for (index of balls){
    index.style.backgroundColor=rgbAleatorio();
    txtPlacar.innerText = placar;
    rgbOrigem.innerText = balls[ballAleatorio()].style.backgroundColor;
    resposta.innerText = 'Escolha uma cor';
  }
}
criaBalls();


function reload(){
  criaBalls();
}

function rgbAleatorio(){
  let mix = [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
  return "rgb(" + mix + ")";
}

function ballAleatorio(){
  return Math.floor(Math.random() * balls.length);
}

function comparaCor(origin){
  
  if (origin.target.style.backgroundColor == rgbOrigem.innerText){
    resposta.innerText = 'Acertou!';
    placar = placar + 3;
    txtPlacar.innerText = placar;
   } else {
    resposta.innerText = 'Errou! Tente novamente!';
  }
}

