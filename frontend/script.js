document.getElementById('word-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const wordInput = document.getElementById('word-input').value;
    const wordInfoDiv = document.getElementById('word-info');

    console.log(`Fetching word info for: ${wordInput}`);

    fetch(`/api/get-word-info?word=${wordInput}`)
        .then(response => response.json())
        .then(data => {
            console.log('API response:', data);
            if (data.message) {
                wordInfoDiv.innerHTML = `<p>${data.message}</p>`;
            } else {
                // Format the JSON data into a more readable HTML structure
                wordInfoDiv.innerHTML = `
                    <h2>Word: ${data.word}</h2>
                    <p>${data.decodedInfo}</p>
                    <img src="${data.imageUrl}" alt="${data.word}">
                `;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            wordInfoDiv.innerHTML = '<p>An error occurred while fetching word information.</p>';
        });
});
