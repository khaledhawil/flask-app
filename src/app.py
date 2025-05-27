from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import random
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Database initialization
def init_db():
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # User phrases table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_phrases (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            phrase TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Default phrases for non-logged users
default_phrases = [
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
    if 'user_id' in session:
        # Get user's custom phrases
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()
        cursor.execute('SELECT phrase FROM user_phrases WHERE user_id = ?', (session['user_id'],))
        user_phrases = [row[0] for row in cursor.fetchall()]
        conn.close()
        
        phrases = user_phrases if user_phrases else default_phrases
        username = session.get('username', 'User')
    else:
        phrases = default_phrases
        username = None
    
    random_phrase = random.choice(phrases)
    return render_template('index.html', phrase=random_phrase, username=username)

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        password = request.form['password']
        
        if not username or not email or not password:
            flash('All fields are required!', 'error')
            return render_template('signup.html')
        
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute('SELECT id FROM users WHERE username = ? OR email = ?', (username, email))
        if cursor.fetchone():
            flash('Username or email already exists!', 'error')
            conn.close()
            return render_template('signup.html')
        
        # Create new user
        password_hash = generate_password_hash(password)
        cursor.execute('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
                      (username, email, password_hash))
        conn.commit()
        conn.close()
        
        flash('Account created successfully! Please log in.', 'success')
        return redirect(url_for('login'))
    
    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        conn = sqlite3.connect('app.db')
        cursor = conn.cursor()
        cursor.execute('SELECT id, username, password_hash FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()
        conn.close()
        
        if user and check_password_hash(user[2], password):
            session['user_id'] = user[0]
            session['username'] = user[1]
            flash('Logged in successfully!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid username or password!', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully!', 'success')
    return redirect(url_for('home'))

@app.route('/my-phrases')
def my_phrases():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, phrase, created_at FROM user_phrases WHERE user_id = ? ORDER BY created_at DESC', 
                   (session['user_id'],))
    phrases = cursor.fetchall()
    conn.close()
    
    return render_template('my_phrases.html', phrases=phrases)

@app.route('/add-phrase', methods=['POST'])
def add_phrase():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    phrase = request.form.get('phrase', '').strip()
    if not phrase:
        flash('Phrase cannot be empty!', 'error')
        return redirect(url_for('my_phrases'))
    
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO user_phrases (user_id, phrase) VALUES (?, ?)', 
                   (session['user_id'], phrase))
    conn.commit()
    conn.close()
    
    flash('Phrase added successfully!', 'success')
    return redirect(url_for('my_phrases'))

@app.route('/delete-phrase/<int:phrase_id>')
def delete_phrase(phrase_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = sqlite3.connect('app.db')
    cursor = conn.cursor()
    cursor.execute('DELETE FROM user_phrases WHERE id = ? AND user_id = ?', 
                   (phrase_id, session['user_id']))
    conn.commit()
    conn.close()
    
    flash('Phrase deleted successfully!', 'success')
    return redirect(url_for('my_phrases'))

@app.route('/health')
def health():
    return {'status': 'healthy', 'message': 'Flask app is running'}, 200

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=False)