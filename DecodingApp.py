from flask import Flask, request, jsonify
import logging
import os
from pymongo import MongoClient
import re

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)
logger = app.logger

mongodb_uri = os.getenv('MONGODB_URI')
if not mongodb_uri:
    logger.error("MONGODB_URI is not set in the environment variables.")
    raise ValueError("MONGODB_URI is not set in the environment variables.")

try:
    client = MongoClient(mongodb_uri, tls=True, tlsAllowInvalidCertificates=True)
    db = client.get_default_database()
    word_collection = db['words']  # Replace with your collection name
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    raise

@app.route('/')
def home():
    return 'Welcome to the Decoding App!'

@app.route('/api/get-word-info', methods=['GET'])
def get_word_info():
    try:
        word = request.args.get('word')
        if not word:
            return jsonify({'error': 'Missing "word" parameter'}), 400

        logger.debug(f"Fetching info for word: {word}")

        # Fetch word info from the database
        word_info = word_collection.find_one({'word': re.compile(f'^{word}$', re.IGNORECASE)})

        if not word_info:
            return jsonify({'error': 'Word not found'}), 404

        return jsonify(word_info)
    except Exception as e:
        logger.error(f"Exception on /api/get-word-info: {str(e)}")
        return jsonify({'error': 'An error occurred'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=True)
