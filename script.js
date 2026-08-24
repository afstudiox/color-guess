// Selects every element with the "ball" class.
// querySelectorAll returns a list of elements, because there are several balls in the HTML.
const balls = document.querySelectorAll('.ball');

// Selects the element that groups all the balls.
// It will be used to listen for clicks on any ball inside it.
const circles = document.querySelector('#circles');

// Selects the three spans where each channel of the target color is displayed.
const redValue = document.querySelector('#value-r');
const greenValue = document.querySelector('#value-g');
const blueValue = document.querySelector('#value-b');

// Selects the paragraph used to show whether the player guessed right or wrong.
const feedback = document.querySelector('#answer');

// Selects the element where the score is displayed.
const scoreText = document.querySelector('#score');

// Selects the ordered list where the best scores are displayed.
const bestScoresList = document.querySelector('#best-scores');

// Defines the key used to store and retrieve the best scores in localStorage.
const BEST_SCORES_KEY = 'colorGuessBestScores';

// Holds the player's current score.
// let is used because this value changes during the game.
let score = 0;

// Holds the color the player must guess in the current round.
// Starts as null and is filled on every round in createBalls.
let targetColor = null;

// Updates the score text on screen with the current value of the score variable.
function updateScore() {
  scoreText.textContent = score;
}

// Generates a random RGB color.
// Returns an OBJECT with the three channels separated, instead of a string.
// Keeping the numbers (the "raw" data) is the key: we format them into a
// string only when we need to display or use them in CSS.
function randomRgb() {
  return {
    red: Math.floor(Math.random() * 256),
    green: Math.floor(Math.random() * 256),
    blue: Math.floor(Math.random() * 256),
  };
}

// Converts a color object { red, green, blue } into the string CSS understands.
// Example: { red: 120, green: 45, blue: 200 } -> "rgb(120, 45, 200)".
function formatRgb(color) {
  return `rgb(${color.red}, ${color.green}, ${color.blue})`;
}

// Draws a valid position (index) within the list of balls.
// This index will be used to choose which color the player must guess.
function randomBall() {
  return Math.floor(Math.random() * balls.length);
}

// Displays the target color values in the three colored spans on screen.
function updateRgbDisplay(color) {
  redValue.textContent = color.red;
  greenValue.textContent = color.green;
  blueValue.textContent = color.blue;
}

// Prepares a new round of the game.
function createBalls() {
  // Generates the 6 colors and paints the balls, storing each color in an array.
  // The "colors" array preserves the color OBJECTS, so we don't lose them
  // after they become a string in backgroundColor.
  const colors = [];

  for (const ball of balls) {
    const color = randomRgb();
    colors.push(color);
    ball.style.backgroundColor = formatRgb(color);
  }

  // Draws one of the 6 colors to be the round's target.
  targetColor = colors[randomBall()];

  // Shows the target color values in the spans.
  updateRgbDisplay(targetColor);
}

// Compares the clicked color with the round's target color.
function handleBallClick(event) {
  // event.target represents the exact element that received the click.
  const clickedBall = event.target;

  // Prevents clicks on the container from being treated as an answer attempt.
  if (!clickedBall.classList.contains('ball')) {
    return;
  }

  // Compares the clicked ball's color with the target color formatted as a string.
  // Since both are formatted by the same function, the comparison is reliable.
  if (clickedBall.style.backgroundColor === formatRgb(targetColor)) {
    handleCorrectGuess();
  } else {
    handleWrongGuess();
  }
}

// Retrieves the best scores saved in localStorage.
function getBestScores() {
  const savedScores = localStorage.getItem(BEST_SCORES_KEY);

  // If there are no saved scores, returns an empty array.
  if (!savedScores) {
    return [];
  }

  try {
    // Converts the JSON string back into an array of numbers.
    const scores = JSON.parse(savedScores);

    if (!Array.isArray(scores)) {
      return [];
    }

    return scores.filter((score) => typeof score === 'number');
  } catch (error) {
    return [];
  }
}

// Registers the round's final score and updates the best scores list.
function registerScore(finalScore) {
  if (finalScore <= 0) {
    return;
  }

  const scores = getBestScores();

  scores.push(finalScore);

  const bestScores = scores
    .sort((currentScore, nextScore) => nextScore - currentScore)
    .slice(0, 3);

  saveBestScores(bestScores);
  renderBestScores();
}

// Saves the best scores to localStorage.
function saveBestScores(scores) {
  const scoresJSON = JSON.stringify(scores);
  localStorage.setItem(BEST_SCORES_KEY, scoresJSON);
}

// Renders the best scores on screen.
function renderBestScores() {
  const scores = getBestScores();

  bestScoresList.innerHTML = '';

  for (const score of scores) {
    const item = document.createElement('li');
    item.textContent = `${score} pontos`;
    bestScoresList.appendChild(item);
  }
}

// Updates the feedback message and its visual state.
function updateFeedback(message, stateClass) {
  feedback.textContent = message;

  feedback.classList.remove('answer-correct', 'answer-wrong');
  feedback.classList.add(stateClass);
}

// Updates the round score when the player guesses correctly.
function handleCorrectGuess() {
  score += 3;
  updateScore();
  createBalls();
  updateFeedback(
  'Acertou! Nova cor sorteada.',
  'answer-correct',
  );
}

// Ends the round when the player guesses wrong.
function handleWrongGuess() {
  const finalScore = score;

  registerScore(finalScore);
  score = 0;
  updateScore();
  createBalls();
  updateFeedback(
    `Errou! Pontuação registrada: ${finalScore}.`,
    'answer-wrong',
  );
}

// Adds an event listener on the balls container.
// This way, a single listener can handle clicks on any ball.
circles.addEventListener('click', handleBallClick);

// Initializes the game when the page loads.
updateScore();
createBalls();
renderBestScores();
