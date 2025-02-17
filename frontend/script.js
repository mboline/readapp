
// Event listener for word form submission
document.getElementById('word-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const wordInput = document.getElementById('word-input').value.trim();
    const wordInfoDiv = document.getElementById('word-info');
    const errorMessage = document.getElementById('error-message');

    // Clear previous content
    wordInfoDiv.style.display = 'none';
    errorMessage.style.display = 'none';

    console.log(`Fetching word info for: ${wordInput}`);

    fetch(`/api/search-word?word=${encodeURIComponent(wordInput)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API response:', data);

            if (data.message) {
                // If there's a message (e.g., "Word not found"), show it as an error
                errorMessage.textContent = data.message;
                errorMessage.style.display = 'block';
            } else {
                // Populate word information
                document.getElementById('word-title').textContent = `Word: ${data.word}`;
                document.getElementById('word-explanation').textContent = data.explanation;

                // Handle audio
                const wordAudio = document.getElementById('word-audio');
                const wordSource = document.getElementById('audio-source');
                if (data.audio_url) {
                    wordSource.src = data.audio_url;
                    wordAudio.style.display = 'block';
                    wordAudio.load(); // Reload the audio element with the new source
                } else {
                    wordAudio.style.display = 'none';
                }

                // Show the word info section
                wordInfoDiv.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred while fetching word information.';
            errorMessage.style.display = 'block';
        });
});

// Event listener for phonogram search form submission
const phonogramSearchForm = document.querySelector('#phonogram-search-form');
phonogramSearchForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const phonogramInput = document.getElementById('phonogram-input').value.trim();
    const phonogramInfoDiv = document.getElementById('phonogram-info');
    const errorMessage = document.getElementById('error-message');

    // Clear previous content
    phonogramInfoDiv.style.display = 'none';
    errorMessage.style.display = 'none';

    console.log(`Fetching phonogram info for: ${phonogramInput}`);

    fetch(`/api/search-phonogram?phonogram=${encodeURIComponent(phonogramInput)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('API response:', data);

            if (data.message) {
                // If there's a message (e.g., "Phonogram not found"), show it as an error
                errorMessage.textContent = data.message;
                errorMessage.style.display = 'block';
            } else {
                // Populate phonogram information
                let phonogramTitle = data.phonogram || phonogramInput; // Use the searched phonogram if it's undefined
                document.getElementById('phonogram-title').textContent = `Phonogram: ${phonogramTitle}`;
                document.getElementById('phonogram-explanation').textContent = data.sample_words;

                // Handle audio
                const phonogramAudio = document.getElementById('phonogram-audio');
                const phonogramSource = document.getElementById('phonogram-source');
                if (data.phonogram_url) {
                    phonogramSource.src = data.phonogram_url;
                    phonogramAudio.style.display = 'block';
                    phonogramAudio.load(); // Reload the audio element with the new source
                } else {
                    phonogramAudio.style.display = 'none';
                }

                // Show the phonogram info section
                phonogramInfoDiv.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred while fetching phonogram information.';
            errorMessage.style.display = 'block';
        });
});