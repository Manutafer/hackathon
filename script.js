const questionnaire = document.getElementById('questionnaire');
const memoryGame = document.getElementById('memory-game');
const options = document.querySelectorAll('.option');
let selectedAnswers = {};
let possibleAnswers = {
    'Como está o dia hoje?': ['Ensolarado', 'Chuvoso', 'Nublado'],
    'O que você comeu pela manhã?': ['pão', 'fruta', 'café'],
    'Qual sua cor favorita?': ['azul', 'vermelho', 'verde'],
    'Qual sua fruta favorita?': ['maça', 'uva', 'banana']
};

options.forEach(option => {
    option.addEventListener('click', () => {
        const answer = option.getAttribute('data-answer');
        const question = option.parentElement.querySelector('h2').innerText;
        
        selectedAnswers[question] = answer;

        if (question === 'Como está o dia hoje?') {
            displayNextQuestion('O que você comeu pela manhã?', possibleAnswers['O que você comeu pela manhã?']);
        } else if (question === 'O que você comeu pela manhã?') {
            displayNextQuestion('Qual sua cor favorita?', possibleAnswers['Qual sua cor favorita?']);
        } else if (question === 'Qual sua cor favorita?') {
            displayNextQuestion('Qual sua fruta favorita?', possibleAnswers['Qual sua fruta favorita?']);
        } else if (question === 'Qual sua fruta favorita?') {
            startMemoryGame();
        }
    });
});

function displayNextQuestion(questionText, answers) {
    questionnaire.innerHTML = `<h2>${questionText}</h2>`;
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.setAttribute('data-answer', answer);
        button.innerText = answer.charAt(0).toUpperCase() + answer.slice(1);
        button.addEventListener('click', () => {
            const answer = button.getAttribute('data-answer');
            const question = button.parentElement.querySelector('h2').innerText;
            
            selectedAnswers[question] = answer;
            
            if (question === 'O que você comeu pela manhã?') {
                displayNextQuestion('Qual sua cor favorita?', possibleAnswers['Qual sua cor favorita?']);
            } else if (question === 'Qual sua cor favorita?') {
                displayNextQuestion('Qual sua fruta favorita?', possibleAnswers['Qual sua fruta favorita?']);
            } else if (question === 'Qual sua fruta favorita?') {
                startMemoryGame();
            }
        });
        questionnaire.appendChild(button);
    });
}

function startMemoryGame() {
    questionnaire.classList.add('hidden');
    memoryGame.classList.remove('hidden');

    let selectedImages = Object.values(selectedAnswers);
    let cardArray = [];

    selectedImages.forEach(image => {
        cardArray.push(createCard(image));
        cardArray.push(createCard(image));
    });

    shuffle(cardArray);
    cardArray.forEach(card => memoryGame.appendChild(card));
}

function createCard(image) {
    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.setAttribute('data-framework', image);

    const frontFace = document.createElement('img');
    frontFace.classList.add('front-face');
    frontFace.src = `images/${image}.png`;
    frontFace.alt = image;

    const backFace = document.createElement('img');
    backFace.classList.add('back-face');
    backFace.src = 'images/back.png';
    backFace.alt = 'Verso';

    card.appendChild(frontFace);
    card.appendChild(backFace);

    card.addEventListener('click', flipCard);

    return card;
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

const cards = document.querySelectorAll('.memory-card');

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this;
    checkForMatch();
}

function checkForMatch() {
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
        disableCards();
        return;
    }

    unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1500);
}

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

cards.forEach(card => card.addEventListener('click', flipCard));
