// Selecting DOM elements
const wordInput = document.getElementById('word-input');
const fetchWordButton = document.getElementById('fetch-word-button');
const errorMessage = document.getElementById('error-message');
const requestedWordInput = document.getElementById('requested-word-input');
const addWordForm = document.getElementById('add-word-form');
const addWordMessage = document.getElementById('add-word-message');
const wordTitle = document.getElementById('word-title');
const wordExplanation = document.getElementById('word-explanation');
const addWordButton = document.getElementById('add-word-button');

// Hide error messages and addition form initially
errorMessage.style.display = 'none';
addWordForm.style.display = 'none';
addWordMessage.style.display = 'none';

// Add event listener to fetch word details
fetchWordButton.addEventListener('click', function() {
    const word = wordInput.value.trim();
    if (!word) {
        errorMessage.textContent = 'Please enter a word.';
        errorMessage.style.display = 'block';
        return;
    }

    errorMessage.style.display = 'none'; // Clear previous messages
    fetchWordDetails(word);
});

// Function to fetch word details from the API
function fetchWordDetails(word) {
    console.log('Fetching word:', word); // Debugging log

    // Replace 'YOUR_API_ENDPOINT' with the actual API URL you are using
    fetch(`YOUR_API_ENDPOINT/${word}`)
        .then(response => {
            console.log('Response Status:', response.status); // Log response status

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Handle response errors
            }

            return response.json(); 
        })
        .then(data => {
            console.log('API Response:', data); // Debugging log
            if (data.message) {
                // Handle case where the word is not found
                errorMessage.textContent = 'Your word was not found. Click the Add button to request it be added.';
                errorMessage.style.display = 'block';

                // Show the Add Word form and set the requested word
                requestedWordInput.value = word; // Store the requested word
                addWordForm.style.display = 'block';
                addWordMessage.style.display = 'block';
            } else {
                // Logic to display the data if found:
                wordTitle.textContent = `Word: ${data.word}`;
                wordExplanation.textContent = data.explanation; // Adjust based on your actual response structure
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred while fetching word information. ' + error.message; // Include error message
            errorMessage.style.display = 'block';
        });
}

// Event listener for adding a word
addWordButton.addEventListener('click', function() {
    const requestedWord = requestedWordInput.value.trim();
    if (!requestedWord) {
        errorMessage.textContent = 'Please enter a word to add.';
        errorMessage.style.display = 'block';
        return;
    }

    // Here you would send a request to add the new word
    addWord(requestedWord);
});

// Function to add a new word
function addWord(word) {
    console.log('Adding word:', word); // Debugging log

    // Replace 'YOUR_ADD_WORD_ENDPOINT' with the actual API URL for adding words
    fetch(`YOUR_ADD_WORD_ENDPOINT`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: word }), // Adjust based on your API structure
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add the word');
            }
            return response.json();
        })
        .then(data => {
            console.log('Add Word Response:', data); // Debugging log
            errorMessage.textContent = 'The word has been successfully added!';
            errorMessage.style.display = 'block';
            addWordForm.style.display = 'none'; // Hide the add form after success
            requestedWordInput.value = ''; // Clear the input field
            wordInput.value = ''; // Additionally clear the main input
        })
        .catch(error => {
            console.error('Error adding word:', error);
            errorMessage.textContent = 'An error occurred while adding the word. ' + error.message;
            errorMessage.style.display = 'block';
        });
}