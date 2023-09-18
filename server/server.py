from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
socketio = SocketIO(app, cors_allowed_origins="*") 


users_online = set() 
chat_history = {}  

@app.route('/users')
def get_users():
    return jsonify(list(users_online))

@app.route('/chat/<string:user1>/<string:user2>')
def get_chat_history(user1, user2):
    chat_id = f"{user1}#{user2}" if user1 < user2 else f"{user2}#{user1}"
    return jsonify(chat_history.get(chat_id, []))

@socketio.on('message')
def handle_message(data):
    sender = data['sender']
    receiver = data['receiver']
    message = data['message']

    chat_id = f"{sender}#{receiver}" if sender < receiver else f"{receiver}#{sender}"
    if chat_id not in chat_history:
        chat_history[chat_id] = []
    chat_history[chat_id].append(message)

    emit('new_message', data, room=receiver)

@socketio.on('join')
def on_join(data):
    username = data['username']
    users_online.add(username)
    emit('user_joined', {'username': username}, broadcast=True)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    users_online.remove(username)
    emit('user_left', {'username': username}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True)
