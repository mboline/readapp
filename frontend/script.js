document.addEventListener("DOMContentLoaded", () => {
    const wordForm = document.getElementById("word-form");
    const phonogramForm = document.getElementById("phonogram-search-form");
    const randomWordButton = document.getElementById("randomWordButton");
    const getRandomWordInfoButton = document.getElementById("getRandomWordInfoButton");
    
    const elements = {
        wordInput: document.getElementById("word-input"),
        phonogramInput: document.getElementById("phonogram-input"),
        wordInfo: document.getElementById("word-info"),
        phonogramInfo: document.getElementById("phonogram-info"),
        errorMessage: document.getElementById("error-message"),
        wordTitle: document.getElementById("word-title"),
        wordExplanation: document.getElementById("word-explanation"),
        wordImage: document.getElementById("word-image"),
        wordAudio: document.getElementById("word-audio"),
        audioSource: document.getElementById("audio-source"),
        phonogramTitle: document.getElementById("phonogram-title"),
        phonogramExplanation: document.getElementById("phonogram-explanation"),
        phonogramAudio: document.getElementById("phonogram-audio"),
        phonogramSource: document.getElementById("phonogram-source"),
    };
    
    function clearFields() {
        elements.wordInfo.style.display = "none";
        elements.phonogramInfo.style.display = "none";
        elements.errorMessage.style.display = "none";
        elements.wordTitle.textContent = "";
        elements.wordExplanation.textContent = "";
        elements.wordImage.style.display = "none";
        elements.wordAudio.style.display = "none";
        elements.phonogramTitle.textContent = "";
        elements.phonogramExplanation.textContent = "";
        elements.phonogramAudio.style.display = "none";
        elements.phonogramSource.src = "";
        elements.phonogramInput.value = "";
    }
    
    function fetchData(url, callback) {
        fetch(url)
            .then(response => response.ok ? response.json() : Promise.reject(response.statusText))
            .then(data => callback(data))
            .catch(error => {
                console.error("Error:", error);
                elements.errorMessage.textContent = "Error fetching data. Please try again.";
                elements.errorMessage.style.display = "block";
            });
    }
    
    wordForm.addEventListener("submit", event => {
        event.preventDefault();
        clearFields();
        const word = elements.wordInput.value.trim();
        elements.wordInput.value = "";
        
        fetchData(`/api/get-word-info?word=${encodeURIComponent(word)}`, data => {
            if (data.message) {
                elements.errorMessage.textContent = data.message;
                elements.errorMessage.style.display = "block";
            } else {
                elements.wordTitle.textContent = `Word: ${data.word}`;
                elements.wordExplanation.textContent = data.decodedInfo;
                
                if (data.imageUrl) {
                    elements.wordImage.src = data.imageUrl;
                    elements.wordImage.style.display = "block";
                }
                
                if (data.audio_url) {
                    elements.audioSource.src = data.audio_url;
                    elements.wordAudio.style.display = "block";
                    elements.wordAudio.load();
                }
                
                elements.wordInfo.style.display = "block";
            }
        });
    });
    
    phonogramForm.addEventListener("submit", event => {
        event.preventDefault();
        clearFields();
        const phonogram = elements.phonogramInput.value.trim();
        
        fetchData(`/api/search-phonogram?phonogram=${encodeURIComponent(phonogram)}`, data => {
            if (data.message) {
                elements.errorMessage.textContent = data.message;
                elements.errorMessage.style.display = "block";
            } else {
                elements.phonogramExplanation.textContent = `Sample words: ${data.sample_words}`;
                
                if (data.phonogram_url) {
                    elements.phonogramSource.src = data.phonogram_url;
                    elements.phonogramAudio.style.display = "block";
                    elements.phonogramAudio.load();
                }
                
                elements.phonogramInfo.style.display = "block";
            }
        });
    });
    
    randomWordButton.addEventListener("click", () => {
        clearFields();
        fetchData("/random_word", data => {
            if (data.message) {
                elements.errorMessage.textContent = data.message;
                elements.errorMessage.style.display = "block";
            } else {
                elements.wordTitle.textContent = `Random Word: ${data.word}`;
                getRandomWordInfoButton.style.display = "block";
                elements.wordInfo.style.display = "block";
                getRandomWordInfoButton.dataset.word = data.word;
            }
        });
    });
    
    getRandomWordInfoButton.addEventListener("click", () => {
        clearFields();
        const word = getRandomWordInfoButton.dataset.word;
        fetchData(`/api/get-word-info?word=${encodeURIComponent(word)}`, data => {
            if (data.message) {
                elements.errorMessage.textContent = data.message;
                elements.errorMessage.style.display = "block";
            } else {
                elements.wordTitle.textContent = `Word: ${data.word}`;
                elements.wordExplanation.textContent = data.decodedInfo;
                
                if (data.imageUrl) {
                    elements.wordImage.src = data.imageUrl;
                    elements.wordImage.style.display = "block";
                }
                
                if (data.audio_url) {
                    elements.audioSource.src = data.audio_url;
                    elements.wordAudio.style.display = "block";
                    elements.wordAudio.load();
                }
                
                elements.wordInfo.style.display = "block";
            }
        });
    });
});
