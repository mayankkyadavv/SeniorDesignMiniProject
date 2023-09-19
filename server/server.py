from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Simulating online users for demo purposes
users_online = ['Alice', 'Bob', 'Carol'] 

@app.route('/search_users', methods=['POST'])
def search_users():
    query = request.json.get('query')
    matching_users = [user for user in users_online if query in user]
    return jsonify(matching_users)

@socketio.on('send_message')
def handle_message(data):
    socketio.emit('receive_message', data)

if __name__ == '__main__':
    socketio.run(app, debug=True)
