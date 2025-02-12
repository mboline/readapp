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
            'image_url': word_info.get('image_url', ''),
            'audio_url': word_info.get('audio_url', '')  # Include audio URL if available
        }
        
        logger.info(f"Word info found: {response_data}")
        return jsonify(response_data), 200
    
    else:
        logger.info(f"Word not found: {word}")
        return jsonify({'message': 'Word not found'}), 404

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
