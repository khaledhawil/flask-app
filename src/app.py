from flask import Flask, render_template
import random

app = Flask(__name__)

# List of random phrases
phrases = [
    "Stay curious and keep learning!",
    "Code is poetry in motion.",
    "Every bug is a learning opportunity.",
    "Think twice, code once.",
    "The best code is readable code.",
    "Programming is the art of solving problems.",
    "Debugging is like being a detective.",
    "Great software is built by great teams.",
    "Simplicity is the ultimate sophistication.",
    "Code with passion, debug with patience.",
    "Innovation distinguishes between a leader and a follower.",
    "The only way to learn programming is by writing programs."
]

@app.route('/')
def home():
    random_phrase = random.choice(phrases)
    return render_template('index.html', phrase=random_phrase)

@app.route('/health')
def health():
    return {'status': 'healthy', 'message': 'Flask app is running'}, 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)