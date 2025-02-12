document.getElementById('word-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const wordInput = document.getElementById('word-input').value.trim();
    const wordInfoDiv = document.getElementById('word-info');
    const errorMessage = document.getElementById('error-message');

    // Clear previous content
    wordInfoDiv.style.display = 'none';
    errorMessage.style.display = 'none';

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
                if (data.image_url) {
                    wordImage.src = data.image_url;
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
            }
        })
        .catch(error => {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred while fetching word information.';
            errorMessage.style.display = 'block';
        });
});
