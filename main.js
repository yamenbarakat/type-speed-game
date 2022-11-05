const choosenLevel = document.querySelector(".info .level");
const secndsOfLevel = document.querySelector(".info .secnds");
const chooseLevel = document.querySelector(".choose-level select");
const chooseLang = document.querySelector(".choose-lang select");
const timer = document.querySelector(".timer span");
const typedWords = document.querySelector(".typed-words");
const totalWords = document.querySelector(".total-words");
const startGame = document.querySelector(".start-game");
const typingInput = document.querySelector(".type input");
const words = document.querySelector(".words");
const showWord = document.querySelector(".show-word");
const result = document.querySelector(".result");
const tryAgain = document.querySelector(".try-again");

const levels = {
  Easy: 6,
  Normal: 4,
  Hard: 2,
};

// make the chosen lang words reachable
let chosenLangWords;

// make the interval reachable
let interval;

// set the choosen level and its seconds if it is changed
chooseLevel.addEventListener("change", (level) => {
  choosenLevel.textContent = level.target.value;
  secndsOfLevel.textContent = levels[level.target.value];

  // update the seconds into the choosen level
  timer.textContent = levels[level.target.value];
});

function chosenLang() {
  if (chooseLang.value === "english") {
    chosenLangWords = [
      "state",
      "great",
      "right",
      "around",
      "should",
      "together",
      "children",
      "change",
      "father",
      "later",
      "carry",
      "animal",
      "session",
      "feedback",
      "accuracy",
      "average",
      "complete",
      "order",
      "blue",
      "correct",
    ];
  } else {
    chosenLangWords = [
      "اليسرى",
      "قصير",
      "بياض",
      "الشمطاء",
      "الجاحظ",
      "الغليظ",
      "ينمو",
      "الشفتين",
      "الثلج",
      "ملعب",
      "طائرة",
      "صياد",
      "فراشة",
      "عشب",
      "المطار",
      "اللؤلؤة",
      "أحمر",
      "اليرقة",
      "ينبوع",
      "جميل",
    ];
  }
}

// call chosenLang once the page load
chosenLang();

// set the words based on chosen language
chooseLang.addEventListener("change", chosenLang);

// set the words count
totalWords.textContent = chosenLangWords.length;

// don't allow to paste anything to typingInput
typingInput.addEventListener("paste", (e) => {
  e.preventDefault();
});

// start the game on cilck
startGame.addEventListener("click", () => {
  // hide the selected buttons
  hideButtons();

  // show the choosen lang words
  showWords();

  // select word randomly and show it
  showRandomWord();
  showWord.classList.remove("hide");

  // focus on input typing
  typingInput.focus();

  // start timer
  startTimer();
});

function hideButtons() {
  chooseLevel.parentElement.classList.add("hide");
  chooseLang.parentElement.classList.add("hide");
  startGame.classList.add("hide");
}

function showWords() {
  // put every word in li element and append them to the page
  chosenLangWords.forEach((word) => {
    const li = document.createElement("li");
    li.textContent = word;
    words.append(li);
  });

  // show words
  words.classList.remove("hide");
}

function showRandomWord() {
  // random number based on words length
  const randomNum = Math.floor(Math.random() * chosenLangWords.length);

  // select random word from chosenLangWords
  const randomWord = chosenLangWords[randomNum];

  // show the word on page
  showWord.textContent = randomWord;

  // delete the word from chosenLangWords
  chosenLangWords.splice(chosenLangWords.indexOf(randomWord), 1);

  // update showWords
  if (chosenLangWords.length === 0) {
    words.classList.add("hide");
  } else {
    words.textContent = "";
    showWords();
  }
}

// startTimer
function startTimer() {
  timer.textContent = levels[chooseLevel.value];

  interval = setInterval(() => {
    timer.textContent--;
    if (timer.textContent === "0") {
      clearInterval(interval);
      // if the word is wrong stop
      if (checkWord()) return;
      // if the words are finished stop
      if (isFinished()) return;
    }
  }, 1000);
}

function checkWord() {
  // if the word didn't match stop the function an show game over
  if (showWord.textContent !== typingInput.value.toLowerCase()) {
    result.classList.remove("hide");
    result.textContent = "Game Over";

    // hide the word for typing
    showWord.classList.add("hide");

    // show try again button
    tryAgain.classList.remove("hide");
    return true;
  }
}

function isFinished() {
  // if the words ended show you win and stop
  if (chosenLangWords.length === 0) {
    result.textContent = "You Win";
    // empty the typingInput
    typingInput.value = "";

    // increse the score
    typedWords.textContent++;

    // hide the word for typing
    showWord.classList.add("hide");

    // show result
    result.classList.remove("hide");

    // show try again button
    tryAgain.classList.remove("hide");
    return true;
  }

  // empty the typingInput
  typingInput.value = "";

  // increse the score
  typedWords.textContent++;

  // show the next word
  showRandomWord();

  // start timer again
  startTimer();
}

tryAgain.addEventListener("click", resetGame);

function resetGame() {
  chooseLevel.parentElement.classList.remove("hide");
  chooseLang.parentElement.classList.remove("hide");
  startGame.classList.remove("hide");
  result.classList.add("hide");
  words.classList.add("hide");
  typedWords.textContent = 0;

  // clear the inout type
  typingInput.value = "";

  chosenLang();

  // hide try again button
  tryAgain.classList.add("hide");
}
