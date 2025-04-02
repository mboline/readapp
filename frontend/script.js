let currentRandomWord = '';

const elements = {
    wordForm: document.getElementById('word-form'),
    wordInput: document.getElementById('word-input'),
    wordInfo: document.getElementById('word-info'),
    phonogramSearchForm: document.getElementById('phonogram-search-form'),
    phonogramInput: document.getElementById('phonogram-input'),
    phonogramInfo: document.getElementById('phonogram-info'),
    errorMessage: document.getElementById('error-message'),
    wordTitle: document.getElementById('word-title'),
    wordExplanation: document.getElementById('word-explanation'),
    wordImage: document.getElementById('word-image'),
    wordAudio: document.getElementById('word-audio'),
    audioSource: document.getElementById('audio-source'),
    phonogramTitle: document.getElementById('phonogram-title'),
    phonogramExplanation: document.getElementById('phonogram-explanation'),
    phonogramAudio: document.getElementById('phonogram-audio'),
    phonogramSource: document.getElementById('phonogram-source'),
    randomWordButton: document.getElementById('randomWordButton'),
    getRandomWordInfoButton: document.getElementById('getRandomWordInfoButton')
};

const clearFields = () => {
    elements.wordInfo.style.display = 'none';
    elements.phonogramSearchForm.style.display = 'none';
    elements.phonogramInfo.style.display = 'none';
    elements.errorMessage.style.display = 'none';
    elements.wordTitle.textContent = '';
    elements.wordExplanation.textContent = '';
    elements.wordImage.style.display = 'none';
    elements.wordAudio.style.display = 'none';
    elements.audioSource.src = '';
    elements.phonogramTitle.textContent = '';
    elements.phonogramExplanation.textContent = '';
    elements.phonogramAudio.style.display = 'none';
    elements.phonogramSource.src = '';
    elements.wordInput.value = '';
    elements.phonogramInput.value = '';
};

const fetchData = (url, callback) => {
    fetch(url)
        .then(response => response.ok ? response.json() : Promise.reject(response.status))
        .then(callback)
        .catch(() => {
            elements.errorMessage.textContent = 'Error fetching data. Please try again.';
            elements.errorMessage.style.display = 'block';
        });
};

elements.wordForm.addEventListener('submit', event => {
    event.preventDefault();
    clearFields();
    fetchData(`/api/get-word-info?word=${encodeURIComponent(elements.wordInput.value.trim())}`, data => {
        if (data.message) {
            elements.errorMessage.textContent = data.message;
            elements.errorMessage.style.display = 'block';
        } else {
            elements.wordTitle.textContent = `Word: ${data.word}`;
            elements.wordExplanation.textContent = data.decodedInfo;
            elements.wordImage.src = data.imageUrl || '';
            elements.wordImage.style.display = data.imageUrl ? 'block' : 'none';
            elements.audioSource.src = data.audio_url || '';
            elements.wordAudio.style.display = data.audio_url ? 'block' : 'none';
            elements.wordAudio.load();
            elements.wordInfo.style.display = 'block';
            elements.phonogramSearchForm.style.display = 'block';
        }
    });
});

elements.phonogramSearchForm.addEventListener('submit', event => {
    event.preventDefault();
    elements.phonogramInfo.style.display = 'none';
    elements.errorMessage.style.display = 'none';
    fetchData(`/api/search-phonogram?phonogram=${encodeURIComponent(elements.phonogramInput.value.trim())}`, data => {
        if (data.message) {
            elements.errorMessage.textContent = data.message;
            elements.errorMessage.style.display = 'block';
        } else {
            elements.phonogramExplanation.textContent = `Sample words: ${data.sample_words}`;
            elements.phonogramSource.src = data.phonogram_url || '';
            elements.phonogramAudio.style.display = data.phonogram_url ? 'block' : 'none';
            elements.phonogramAudio.load();
            elements.phonogramInfo.style.display = 'block';
        }
    });
});

elements.randomWordButton.addEventListener('click', () => {
    clearFields();
    fetchData('/random_word', data => {
        if (data.message) {
            elements.errorMessage.textContent = data.message;
            elements.errorMessage.style.display = 'block';
        } else {
            currentRandomWord = data.word;
            elements.wordTitle.textContent = `Random Word: ${currentRandomWord}`;
            elements.getRandomWordInfoButton.style.display = 'block';
            elements.wordInfo.style.display = 'block';
        }
    });
});

elements.getRandomWordInfoButton.addEventListener('click', () => {
    fetchData(`/api/get-word-info?word=${encodeURIComponent(currentRandomWord)}`, data => {
        if (data.message) {
            elements.errorMessage.textContent = data.message;
            elements.errorMessage.style.display = 'block';
        } else {
            elements.wordTitle.textContent = `Word: ${data.word}`;
            elements.wordExplanation.textContent = data.decodedInfo;
            elements.wordImage.src = data.imageUrl || '';
            elements.wordImage.style.display = data.imageUrl ? 'block' : 'none';
            elements.audioSource.src = data.audio_url || '';
            elements.wordAudio.style.display = data.audio_url ? 'block' : 'none';
            elements.wordAudio.load();
            elements.wordInfo.style.display = 'block';
        }
    });
});
