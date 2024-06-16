// Set variables for elements from HTML page
const wordEl = document.getElementById('word');
const hintEl = document.getElementById('hint');
const wrongLettersEl = document.getElementById('wrong-letters');
const playAgainBtn = document.getElementById('play-button');

// Variable to determine if game has ended or not, to be used to control keydown events
let gameFinish = true;

// Variables for keeping score
let win = 0;
let lose = 0;

// Variable for Selected word and hint
let selectedHint;
let selectedWord;

// Declare empty arrays to store correct and wrong letters
const correctLetters = [];
const wrongLetters = [];

// Get all elements with a class of figure-part and store to array
const figureParts = document.querySelectorAll('.figure-part');

// Array of possible words for the game
const words = [
    'big bear', 'áI̱', 'bear', 'bok', "a'i", 'a\'i'
];

// Array of hints to pair with counter-part words
const hints = [
    '2 words','word2', 'animal', 'Bodies of Water', 'example word with a quotation mark', 'other example word with a quotation mark'
];

// Function to start the game
function startGame() {
    let index = words.indexOf(words[Math.floor(Math.random() * words.length)]);
    selectedWord = words[index].normalize('NFC').toUpperCase();
    selectedHint = hints[index].toUpperCase();

    // Hide hangman figure on game start
    $('.figure-part').css('display', 'none');

    // Hide start button on game start
    $('#start-btn').css('display', 'none');

    // Display user input on game start
    $('#userInput').css('display', 'block');

    displayWord();
}

// Function to display the word
function displayWord() {
    // Set game finish to false to allow input for new game
    gameFinish = false;

    // Display hint
    $('#hint').html(`<p>Hint: ${selectedHint}</p>`);

    // Display word
    wordEl.innerHTML = `
        ${splitCharacters(selectedWord)
            .map(letter => `
                <span class="letter">
                    ${correctLetters.includes(letter) || letter === ' ' ? letter : ''}
                </span>
            `).join('')}
        `;

    const innerWord = Array.from(wordEl.querySelectorAll('.letter'))
        .map(span => span.innerText)
        .join('');

    if (innerWord === selectedWord.replace(/ /g, '')) {
        // Set game finish to true to stop input guesses
        gameFinish = true;

        // Display final win status
        $('#final-message').html("Congratulations! You Won!!!");
        $('#final-message').css("color", "#62c962");
        $('#final-msg-container').css("display", "block");
        win = win + 1;
        $('.win').html(win);
    }
}

// Function to update wrong letters
function updateWrongLettersEl() {
    // Display wrong letters into html
    wrongLettersEl.innerHTML = `
        ${wrongLetters.length > 0 ? '<h3>Wrong Letters</h3>' : ''}
        ${wrongLetters.map(letter => `<span>${letter}</span>`).join('')}
    `;

    figureParts.forEach((part, index) => {
        const errors = wrongLetters.length;
        if (index < errors) {
            part.style.display = 'block';
        } else {
            part.style.display = 'none';
        }
    });

    if (wrongLetters.length === figureParts.length) {
        // Set game finish to true to stop keydown events
        gameFinish = true;

        // Display final lose status
        $('#final-message').html("Sorry, you Lose!!!");
        $('#final-message').css("color", "#ff3333");
        $('#final-msg-container').css("display", "block");

        // After they lose, display the selectedWord
        wordEl.innerHTML = `
        ${splitCharacters(selectedWord)
            .map(letter => `
                <span class="letter">
                    ${letter}
                </span>
            `).join('')}
        `;

        // Insert losing score to HTML
        lose = lose + 1;
        $('.lose').html(lose);
    }
}

// Show notification for duplicate letter guess
function showNotification() {
    $('#letter-error').css("display", "block");
    setTimeout(() => {
        $('#letter-error').css("display", "none");
    }, 2000);
}

// Function to get form input and call validateLetter() if value is not undefined
function validateForm() {
    const input = document.forms.userInput.guess.value;
    if (input !== undefined) {
        validateLetter(input);
    }
    // Reset text in form
    document.getElementById("userInput").reset();
}

// Validate Letter if game is active
function validateLetter(input) {
    if (gameFinish === false) {
        // Normalize input letter
        const letter = input.toUpperCase().normalize('NFC');

        // Check if the input letter is part of the selected word
        if (splitCharacters(selectedWord).includes(letter)) {
            // Add letter to correctLetters array if it's not already included
            if (!correctLetters.includes(letter)) {
                correctLetters.push(letter);
                displayWord();
            } else {
                showNotification();
            }
        } else {
            // Add letter to wrongLetters array if it's not already included
            if (!wrongLetters.includes(letter)) {
                wrongLetters.push(letter);
                updateWrongLettersEl();
            } else {
                // If the letter has already been guessed incorrectly, show notification
                showNotification();
            }
        }
    }
}

// Split word into an array of characters, including characters with combining marks and apostrophes
function splitCharacters(word) {
    // Updated regex to include apostrophes correctly
    return Array.from(word.normalize('NFC').match(/(\P{M}\p{M}*(')?)/gu));
}

// Event listener on Play Again button to empty arrays and clear game board before starting a new game
playAgainBtn.addEventListener('click', () => {
    // Empty the arrays
    correctLetters.splice(0);
    wrongLetters.splice(0);

    // Start a new game
    startGame();

    // Hide wrong letters and figures
    updateWrongLettersEl();

    // Hide final message
    $('#final-msg-container').css("display", "none");
});

// Buttons to fill in accented characters in search bar
$('#btn1').on('click', function () {
    validateLetter('á');
});
$('#btn2').on('click', function () {
    validateLetter('a̱');
});
$('#btn3').on('click', function () {
    validateLetter("a'");
});
