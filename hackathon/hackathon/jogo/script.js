const questionnaire = document.getElementById('questionnaire');
const memoryGame = document.getElementById('memory-game');
let selectedAnswers = {};
const possibleAnswers = {
    'Como está o dia hoje?': ['ensolarado', 'chuvoso', 'nublado'],
    'O que você comeu pela manhã?': ['pao', 'frutas', 'cafe'],
    'Qual sua cor favorita?': ['azul', 'vermelho', 'verde'],
    'Qual sua fruta favorita?': ['maça', 'uva', 'banana'],
    'Qual era o seu jogo favorito quando criança?': ['esconde-esconde', 'pular-corda', 'quebra-cabeça'],
    'Qual animal de estimação você gosta mais?': ['cachorro', 'gato', 'passaro'],
    'Onde você gostaria de passar as férias?': ['praia', 'montanha', 'campo'],
    'Qual era a sua matéria favorita na escola?': ['matematica', 'historia', 'ciencias'],
    'Qual seu tipo de música favorito?': ['classica', 'pop', 'sertanejo']
};

function setupOptions() {
    document.querySelectorAll('.option').forEach(option => {
        option.addEventListener('click', () => {
            const answer = option.getAttribute('data-answer');
            const question = option.parentElement.querySelector('h2').innerText;

            selectedAnswers[question] = answer;

            switch(question) {
                case 'Como está o dia hoje?':
                    displayNextQuestion('O que você comeu pela manhã?', possibleAnswers['O que você comeu pela manhã?']);
                    break;
                case 'O que você comeu pela manhã?':
                    displayNextQuestion('Qual sua cor favorita?', possibleAnswers['Qual sua cor favorita?']);
                    break;
                case 'Qual sua cor favorita?':
                    displayNextQuestion('Qual sua fruta favorita?', possibleAnswers['Qual sua fruta favorita?']);
                    break;
                case 'Qual sua fruta favorita?':
                    displayNextQuestion('Qual era o seu jogo favorito quando criança?', possibleAnswers['Qual era o seu jogo favorito quando criança?']);
                    break;
                case 'Qual era o seu jogo favorito quando criança?':
                    displayNextQuestion('Qual animal de estimação você gosta mais?', possibleAnswers['Qual animal de estimação você gosta mais?']);
                    break;
                case 'Qual animal de estimação você gosta mais?':
                    displayNextQuestion('Onde você gostaria de passar as férias?', possibleAnswers['Onde você gostaria de passar as férias?']);
                    break;
                case 'Onde você gostaria de passar as férias?':
                    displayNextQuestion('Qual era a sua matéria favorita na escola?', possibleAnswers['Qual era a sua matéria favorita na escola?']);
                    break;
                case 'Qual era a sua matéria favorita na escola?':
                    displayNextQuestion('Qual seu tipo de música favorito?', possibleAnswers['Qual seu tipo de música favorito?']);
                    break;
                case 'Qual seu tipo de música favorito?':
                    startMemoryGame();
                    break;
            }
        });
    });
}

function displayNextQuestion(questionText, answers) {
    questionnaire.innerHTML = `<h2>${questionText}</h2>`;
    answers.forEach(answer => {
        const button = document.createElement('button');
        button.classList.add('option');
        button.setAttribute('data-answer', answer);
        button.innerText = answer.charAt(0).toUpperCase() + answer.slice(1);
        questionnaire.appendChild(button);
    });
    setupOptions(); // Re-setup options after adding new ones
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

    // Remove todas as cartas existentes antes de adicionar novas
    memoryGame.innerHTML = '';

    cardArray.forEach(card => memoryGame.appendChild(card));

    // Ajusta o tamanho das cartas para caber no contêiner
    adjustCardSize();
}

function adjustCardSize() {
    const gameContainer = document.querySelector('.memory-game');
    const cards = document.querySelectorAll('.memory-card');
    const numCards = cards.length;

    // Calcula o tamanho ideal das cartas para caber no contêiner
    const containerWidth = gameContainer.offsetWidth;
    const cardWidth = Math.floor(containerWidth / 4); // Ajuste o número 4 para o número desejado de cartas por linha

    cards.forEach(card => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardWidth}px`; // Mantém as cartas quadradas
    });
}
window.addEventListener('resize', adjustCardSize);

function createCard(image) {
    console.log('Criando carta com a imagem:', image);

    const card = document.createElement('div');
    card.classList.add('memory-card');
    card.setAttribute('data-framework', image);

    const frontFace = document.createElement('img');
    frontFace.classList.add('front-face');
    frontFace.src = `../imagens/${image}.jpg`;
    frontFace.alt = image;

    const backFace = document.createElement('img');
    backFace.classList.add('back-face');
    backFace.src = '../imagens/verso-carta.png';
    backFace.alt = 'Verso';

    backFace.onerror = () => {
        console.error('Erro ao carregar a imagem do verso da carta:', backFace.src);
    };

    card.appendChild(frontFace);
    card.appendChild(backFace);

    card.addEventListener('click', flipCard);

    return card;
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

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
        if (document.querySelectorAll('.memory-card:not(.flip)').length === 0) {
            celebrateVictory(); // Celebra a vitória quando todas as cartas forem combinadas
        }
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

// Função para mostrar confetes na tela
function celebrateVictory() {
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
    });
}
// Função para mostrar confetes na tela
function celebrateVictory() {
    // Configura o confete
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
    });
}

// Adicione a função de celebração no final do jogo, quando o usuário vencer
function checkForMatch() {
    if (firstCard.dataset.framework === secondCard.dataset.framework) {
        disableCards();
        if (document.querySelectorAll('.memory-card:not(.flip)').length === 0) {
            celebrateVictory(); // Celebra a vitória quando todas as cartas forem combinadas
        }
        return;
    }

    unflipCards();
}

setupOptions(); // Initial setup for options

