document.getElementById('word-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const wordInput = document.getElementById('word-input').value.trim();
    const wordInfoDiv = document.getElementById('word-info');
    const phonogramSearchForm = document.getElementById('phonogram-search-form');
    const phonogramInfoDiv = document.getElementById('phonogram-info'); // Reference to phonogram info section
    const errorMessage = document.getElementById('error-message');

    // Clear previous word info and phonogram info
    wordInfoDiv.style.display = 'none';
    phonogramSearchForm.style.display = 'none';
    phonogramInfoDiv.style.display = 'none'; // Hide the phonogram info section
    errorMessage.style.display = 'none';

    // Clear any previously displayed phonogram data
    document.getElementById('phonogram-title').textContent = ''; // Clear phonogram title
    document.getElementById('phonogram-explanation').textContent = ''; // Clear phonogram explanation
    const phonogramAudio = document.getElementById('phonogram-audio');
    phonogramAudio.style.display = 'none'; // Hide phonogram audio controls
    const phonogramSource = document.getElementById('phonogram-source');
    phonogramSource.src = ''; // Reset the phonogram audio source

    // Clear the phonogram search input field
    document.getElementById('phonogram-input').value = ''; // Clear phonogram search input

    console.log(`Fetching word info for: ${wordInput}`);

    fetch(`/api/get-word-info?word=${encodeURIComponent(wordInput)}`)
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
                document.getElementById('word-explanation').textContent = data.decodedInfo;

                // Handle image
                const wordImage = document.getElementById('word-image');
                if (data.imageUrl) {
                    wordImage.src = data.imageUrl;
                    wordImage.alt = `Decoding image for ${data.word}`;
                    wordImage.style.display = 'block';
                } else {
                    wordImage.style.display = 'none';
                }

                // Handle audio
                const wordAudio = document.getElementById('word-audio');
                const audioSource = document.getElementById('audio-source');
                if (data.audio_url) {
                    audioSource.src = data.audio_url;
                    wordAudio.style.display = 'block';
                    wordAudio.load(); // Reload the audio element with the new source
                } else {
                    wordAudio.style.display = 'none';
                }

                // Show the word info section
                wordInfoDiv.style.display = 'block';

                // Show the phonogram search form
                phonogramSearchForm.style.display = 'block';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred while fetching word information.';
            errorMessage.style.display = 'block';
        });
});

document.getElementById('phonogram-search-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const phonogramInput = document.getElementById('phonogram-input').value.trim();
    const phonogramInfoDiv = document.getElementById('phonogram-info');
    const errorMessage = document.getElementById('error-message');

    // Clear previous phonogram info
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
                //document.getElementById('phonogram-title').textContent = `Phonogram: ${data.phonogram}`;
                document.getElementById('phonogram-explanation').textContent = `Sample words: ${data.sample_words}`;

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
