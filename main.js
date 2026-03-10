const elements = {
  levelText: document.querySelector('.info .level'),
  secondsText: document.querySelector('.info .seconds'),
  levelSelect: document.querySelector('.choose-level select'),
  languageSelect: document.querySelector('.choose-lang select'),
  timerText: document.querySelector('.timer span'),
  typedWordsText: document.querySelector('.typed-words'),
  totalWordsText: document.querySelector('.total-words'),
  startButton: document.querySelector('.start-game'),
  typingContainer: document.querySelector('.type'),
  typingInput: document.querySelector('.type input'),
  wordsList: document.querySelector('.words'),
  currentWord: document.querySelector('.show-word'),
  result: document.querySelector('.result'),
  tryAgainButton: document.querySelector('.try-again'),
};

const LEVEL_SECONDS = {
  Easy: 6,
  Normal: 4,
  Hard: 2,
};

const WORD_BANK = {
  english: [
    'state',
    'great',
    'right',
    'around',
    'should',
    'together',
    'children',
    'change',
    'father',
    'later',
    'carry',
    'animal',
    'session',
    'feedback',
    'accuracy',
    'average',
    'complete',
    'order',
    'blue',
    'correct',
  ],
  arabic: [
    '\u0627\u0644\u064a\u0633\u0631\u0649',
    '\u0642\u0635\u064a\u0631',
    '\u0628\u064a\u0627\u0636',
    '\u0627\u0644\u0634\u0645\u0637\u0627\u0621',
    '\u0627\u0644\u062c\u0627\u062d\u0638',
    '\u0627\u0644\u063a\u0644\u064a\u0638',
    '\u064a\u0646\u0645\u0648',
    '\u0627\u0644\u0634\u0641\u062a\u064a\u0646',
    '\u0627\u0644\u062b\u0644\u062c',
    '\u0645\u0644\u0639\u0628',
    '\u0637\u0627\u0626\u0631\u0629',
    '\u0635\u064a\u0627\u062f',
    '\u0641\u0631\u0627\u0634\u0629',
    '\u0639\u0634\u0628',
    '\u0627\u0644\u0645\u0637\u0627\u0631',
    '\u0627\u0644\u0644\u0624\u0644\u0624\u0629',
    '\u0623\u062d\u0645\u0631',
    '\u0627\u0644\u064a\u0631\u0642\u0629',
    '\u064a\u0646\u0628\u0648\u0639',
    '\u062c\u0645\u064a\u0644',
  ],
};

const state = {
  availableWords: [],
  currentWord: '',
  score: 0,
  timerId: null,
};

init();

function init() {
  updateLevelInfo();
  updateWordCounter();

  elements.levelSelect.addEventListener('change', updateLevelInfo);
  elements.languageSelect.addEventListener('change', updateWordCounter);
  elements.startButton.addEventListener('click', startGame);
  elements.tryAgainButton.addEventListener('click', resetGame);
  elements.typingInput.addEventListener('input', handleTypingInput);

  elements.typingInput.addEventListener('paste', (event) => {
    event.preventDefault();
  });
}

function updateLevelInfo() {
  const level = elements.levelSelect.value;
  const seconds = LEVEL_SECONDS[level];

  elements.levelText.textContent = level;
  elements.secondsText.textContent = String(seconds);
  elements.timerText.textContent = String(seconds);
}

function getSelectedWords() {
  const language = elements.languageSelect.value;
  return [...WORD_BANK[language]];
}

function updateWordCounter() {
  const words = getSelectedWords();
  elements.totalWordsText.textContent = String(words.length);
}

function startGame() {
  setControlsHidden(true);
  resetRuntimeState();

  state.availableWords = getSelectedWords();
  renderWords();
  showNextWord();

  elements.typingContainer.classList.remove('hide');
  elements.currentWord.classList.remove('hide');
  elements.typingInput.focus();

  startRoundTimer();
}

function setControlsHidden(hidden) {
  elements.levelSelect.parentElement.classList.toggle('hide', hidden);
  elements.languageSelect.parentElement.classList.toggle('hide', hidden);
  elements.startButton.classList.toggle('hide', hidden);
}

function resetRuntimeState() {
  clearTimer();
  state.score = 0;
  elements.typedWordsText.textContent = '0';
  elements.result.classList.add('hide');
  elements.tryAgainButton.classList.add('hide');
  elements.typingInput.value = '';
}

function renderWords() {
  elements.wordsList.textContent = '';

  state.availableWords.forEach((word) => {
    const listItem = document.createElement('li');
    listItem.textContent = word;
    elements.wordsList.append(listItem);
  });

  elements.wordsList.classList.toggle('hide', state.availableWords.length === 0);
}

function showNextWord() {
  const randomIndex = Math.floor(Math.random() * state.availableWords.length);
  state.currentWord = state.availableWords[randomIndex];
  elements.currentWord.textContent = state.currentWord;

  state.availableWords.splice(randomIndex, 1);
  renderWords();
}

function startRoundTimer() {
  clearTimer();

  const level = elements.levelSelect.value;
  let secondsLeft = LEVEL_SECONDS[level];
  elements.timerText.textContent = String(secondsLeft);

  state.timerId = setInterval(() => {
    secondsLeft -= 1;
    elements.timerText.textContent = String(secondsLeft);

    if (secondsLeft === 0) {
      clearTimer();
      handleRoundEnd();
    }
  }, 1000);
}

function clearTimer() {
  if (state.timerId !== null) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function normalizeInput(value) {
  return value.trim().toLowerCase();
}

function handleTypingInput() {
  if (!state.currentWord) {
    return;
  }

  const typedWord = normalizeInput(elements.typingInput.value);
  if (typedWord === normalizeInput(state.currentWord)) {
    handleCorrectWord();
  }
}

function handleRoundEnd() {
  const typedWord = normalizeInput(elements.typingInput.value);

  if (typedWord !== normalizeInput(state.currentWord)) {
    endGame('Game Over');
    return;
  }

  handleCorrectWord();
}

function handleCorrectWord() {
  clearTimer();

  state.score += 1;
  elements.typedWordsText.textContent = String(state.score);
  elements.typingInput.value = '';

  if (state.availableWords.length === 0) {
    endGame('You Win');
    return;
  }

  showNextWord();
  startRoundTimer();
}

function endGame(message) {
  clearTimer();
  state.currentWord = '';

  elements.currentWord.classList.add('hide');
  elements.result.textContent = message;
  elements.result.classList.remove('hide');
  elements.tryAgainButton.classList.remove('hide');
}

function resetGame() {
  clearTimer();

  setControlsHidden(false);
  elements.typingContainer.classList.add('hide');
  elements.wordsList.classList.add('hide');
  elements.currentWord.classList.add('hide');
  elements.result.classList.add('hide');
  elements.tryAgainButton.classList.add('hide');

  elements.typingInput.value = '';
  elements.typedWordsText.textContent = '0';

  state.availableWords = [];
  state.currentWord = '';
  state.score = 0;

  updateLevelInfo();
  updateWordCounter();
}
