// Constants and references to the DOM elements
const wordTitle = document.getElementById("word-title");
const wordExplanation = document.getElementById("word-explanation");
const errorMessage = document.getElementById("error-message");
const requestedWordInput = document.getElementById("requested-word");
const addWordForm = document.getElementById("add-word-form");
const addWordMessage = document.getElementById("add-word-message");
const addWordButton = document.getElementById('add-word-button');

// Function to fetch word details
function fetchWordDetails(word) {
    console.log('Fetching word:', word); // Debugging log

    // Replace 'YOUR_API_ENDPOINT' with the actual API URL you are using
    fetch(`YOUR_API_ENDPOINT/${word}`)
        .then(response => {
            console.log('Response Status:', response.status); // Log response status

            // Handle 404 Not Found specifically
            if (response.status === 404) {
                handleWordNotFound(word);
                return; // Early return to halt further processing
            }

            // Handle other errors
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`); // Non-404 errors
            }

            return response.json();
        })
        .then(data => {
            console.log('API Response:', data); // Debugging log
            if (data && data.message) {
                // Handle case where the response does not contain the expected data
                handleWordNotFound(word); // Reuse the function to manage not found state
            } else {
                // Logic to display the found word
                wordTitle.textContent = `Word: ${data.word}`;
                wordExplanation.textContent = data.explanation; // Use the actual fields from your API response
                errorMessage.style.display = 'none'; // Hide error message (if previously displayed)
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'An unexpected error occurred while fetching word information. Please try again later.';
            errorMessage.style.display = 'block';
        });
}

// Function to handle the case when a word is not found
function handleWordNotFound(word) {
    errorMessage.textContent = `The word "${word}" was not found in our database. You can request to add it by clicking the "Add Word" button.`;
    errorMessage.style.display = 'block';
    
    // Prepare input for adding the requested word
    requestedWordInput.value = word; // Store the requested word
    addWordForm.style.display = 'block'; // Show the add word form
    addWordMessage.style.display = 'block'; // Show message about adding the word
}

// Set up event listener for adding a word
addWordButton.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default form submission

    const requestedWord = requestedWordInput.value.trim();
    if (!requestedWord) {
        alert("Please enter a word to add.");
        return;
    }

    // Use Formspree to send the request to add the word
    fetch('https://formspree.io/f/YOUR_FORMSPREE_ID', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ word: requestedWord })
    })
    .then(response => {
        if (response.ok) {
            alert("Your request to add the word has been submitted!");
            requestedWordInput.value = ''; // Clear input field
            addWordForm.style.display = 'none'; // Hide the add word form
            addWordMessage.style.display = 'none'; // Hide the add word message
            errorMessage.style.display = 'none'; // Hide any error message if shown
        } else {
            throw new Error('There was a problem submitting your request.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Failed to submit your request. Please try again later.");
    });
});

// Example function to trigger word search (should be connected to your search event)
// make sure to attach this function to your search logic, e.g., a button or input event.
function searchWord() {
    const searchTerm = document.getElementById("search-input").value.trim();
    if (searchTerm) {
        fetchWordDetails(searchTerm);
    } else {
        alert("Please enter a word to search.");
    }
}

// Connect search function to your UI (e.g., search button or input)
document.getElementById("search-button").addEventListener('click', (e) => {
    e.preventDefault();
    searchWord();
});