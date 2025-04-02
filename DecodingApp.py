from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
import os
import logging
from dotenv import load_dotenv
import re

# Load environment variables from a .env file
load_dotenv()

app = Flask(__name__, static_folder='frontend')
CORS(app)

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize database
mongodb_uri = os.getenv('MONGODB_URI')
if not mongodb_uri:
    logger.error("MONGODB_URI is not set in the environment variables.")
    raise ValueError("MONGODB_URI is not set in the environment variables.")

client = MongoClient(mongodb_uri)
db = client.get_database('WordInfo')  # Specify the database name
word_collection = db.get_collection('Words')  # Specify the collection name
phonogram_collection = db.get_collection('Phonograms')  # Specify the phonogram collection name

# Log the database name to verify the connection
logger.info(f"Connected to database: {db.name}")

@app.route('/api/get-word-info', methods=['GET'])
def get_word_info():
    word = request.args.get('word')
    if not word:
        return jsonify({'message': 'Word parameter is required'}), 400
    logger.info(f"Fetching word info for: {word}")
    # Use a case-insensitive regular expression to find the word
    word_info = word_collection.find_one({'word': re.compile(f'^{word}$', re.IGNORECASE)})
    if word_info:
        # Convert ObjectId to string for JSON serialization
        word_info['_id'] = str(word_info['_id'])
        
        # Ensure all fields are included in the response, even if they are missing in the database
        response_data = {
            'word': word_info.get('word', ''),
            'decodedInfo': word_info.get('decodedInfo', ''),
            'imageUrl': word_info.get('imageUrl', ''),
            'audio_url': word_info.get('audio_url', '')  # Include audio URL if available
        }
        logger.info(f"Word info found: {response_data}")
        return jsonify(response_data), 200
    else:
        logger.info(f"Word not found: {word}")
        return jsonify({'message': 'Word not found'}), 404

@app.route('/api/get-phonogram-info', methods=['GET'])
def get_phonogram_info():
    phonogram = request.args.get('phonogram')
    if not phonogram:
        return jsonify({'message': 'Phonogram parameter is required'}), 400
    logger.info(f"Fetching phonogram info for: {phonogram}")
    # Use a case-insensitive regular expression to find the phonogram
    phonogram_info = phonogram_collection.find_one({'phonogram': re.compile(f'^{phonogram}$', re.IGNORECASE)})
    if phonogram_info:
        # Convert ObjectId to string for JSON serialization
        phonogram_info['_id'] = str(phonogram_info['_id'])
        
        # Ensure all fields are included in the response, even if they are missing in the database
        response_data = {
            'phonogram_url': phonogram_info.get('phonogram_url', ''),
            'sample_words': phonogram_info.get('samplewords', '')
        }
        logger.info(f"Phonogram info found: {response_data}")
        return jsonify(response_data), 200
    else:
        logger.info(f"Phonogram not found: {phonogram}")
        return jsonify({'message': 'Phonogram not found'}), 404

@app.route('/api/search-phonogram', methods=['GET'])
def search_phonogram():
    phonogram = request.args.get('phonogram')
    if not phonogram:
        return jsonify({'message': 'Phonogram parameter is required'}), 400
    logger.info(f"Searching for phonogram: {phonogram}")
    # Use a case-insensitive regular expression to find the phonogram
    phonogram_info = phonogram_collection.find_one({'phonogram': re.compile(f'^{phonogram}$', re.IGNORECASE)})
    if phonogram_info:
        # Convert ObjectId to string for JSON serialization
        phonogram_info['_id'] = str(phonogram_info['_id'])
        
        # Ensure all fields are included in the response, even if they are missing in the database
        response_data = {
            'phonogram_url': phonogram_info.get('phonogram_url', ''),
            'sample_words': phonogram_info.get('samplewords', '')
        }
        logger.info(f"Phonogram info found: {response_data}")
        return jsonify(response_data), 200
    else:
        logger.info(f"Phonogram not found: {phonogram}")
        return jsonify({'message': 'Phonogram not found'}), 404

@app.route('/random_word', methods=['GET'])
def get_random_word():
    """
    Fetches a random word from the MongoDB collection using the aggregation pipeline
    with $sample for efficient random selection, especially suitable for larger datasets [1].
    """
    try:
        # Use aggregation pipeline to get a random document [1]
        pipeline = [{"$sample": {"size": 1}}]
        random_word_doc = next(word_collection.aggregate(pipeline), None)  # Get the first (and only) document or None

        if random_word_doc:
            # Extract the word from the document
            random_word_doc['_id'] = str(random_word_doc['_id'])
            random_word = random_word_doc.get('word', None)
            if random_word:
                logger.info(f"Random word selected: {random_word}")
                return jsonify({'word': random_word}), 200
            else:
                logger.warning("No 'word' field found in the random document.")
                return jsonify({'message': "No 'word' field found in the random document."}), 404
        else:
            logger.info("No words found in the collection.")
            return jsonify({'message': 'No words found'}), 404
    except Exception as e:
        logger.error(f"Error fetching random word: {e}")
        return jsonify({'message': f'Internal Server Error: {str(e)}'}), 500

@app.route('/')
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    logger.info(f"Starting server on port {port}")
    app.run(host='0.0.0.0', port=port)