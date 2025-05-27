from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import sqlite3
import random
import os
import requests
from datetime import datetime, timedelta
import json

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'your-secret-key-here')

# Database initialization
def init_db():
    # Use persistent data directory
    db_path = '/app/data/app.db' if os.path.exists('/app/data') else 'app.db'
    conn = sqlite3.connect(db_path)
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
    
    # Tasbeh table for counting Islamic phrases
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasbeh_counts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            phrase TEXT NOT NULL,
            count INTEGER DEFAULT 0,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id, phrase)
        )
    ''')
    
    # User location table for prayer times
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_locations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE,
            city TEXT,
            country TEXT,
            latitude REAL,
            longitude REAL,
            timezone TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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

# Default Islamic phrases for Tasbeh
islamic_phrases = [
    "سبحان الله",  # SubhanAllah
    "الحمد لله",   # Alhamdulillah
    "الله أكبر",   # Allahu Akbar
    "لا إله إلا الله",  # La ilaha illa Allah
    "اللهم صل على سيدنا محمد",  # Allahumma salli ala sayyidina Muhammad
    "أستغفر الله",  # Astaghfirullah
    "لا حول ولا قوة إلا بالله",  # La hawla wa la quwwata illa billah
    "بسم الله الرحمن الرحيم"  # Bismillah ar-Rahman ar-Raheem
]

def get_db_connection():
    db_path = '/app/data/app.db' if os.path.exists('/app/data') else 'app.db'
    return sqlite3.connect(db_path)

@app.route('/')
def home():
    if 'user_id' in session:
        # Get user's custom phrases
        conn = get_db_connection()
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
        
        conn = get_db_connection()
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
        
        conn = get_db_connection()
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
    
    conn = get_db_connection()
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
    
    conn = get_db_connection()
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
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM user_phrases WHERE id = ? AND user_id = ?', 
                   (phrase_id, session['user_id']))
    conn.commit()
    conn.close()
    
    flash('Phrase deleted successfully!', 'success')
    return redirect(url_for('my_phrases'))

@app.route('/tasbeh')
def tasbeh():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get user's tasbeh counts
    cursor.execute('''
        SELECT phrase, count, last_updated 
        FROM tasbeh_counts 
        WHERE user_id = ? 
        ORDER BY last_updated DESC
    ''', (session['user_id'],))
    
    user_counts = {}
    for row in cursor.fetchall():
        user_counts[row[0]] = {'count': row[1], 'last_updated': row[2]}
    
    conn.close()
    
    # Prepare phrases with counts
    phrases_data = []
    for phrase in islamic_phrases:
        count_data = user_counts.get(phrase, {'count': 0, 'last_updated': None})
        phrases_data.append({
            'phrase': phrase,
            'count': count_data['count'],
            'last_updated': count_data['last_updated']
        })
    
    return render_template('tasbeh.html', phrases=phrases_data, username=session.get('username'))

@app.route('/tasbeh/count', methods=['POST'])
def count_tasbeh():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    phrase = request.json.get('phrase')
    if phrase not in islamic_phrases:
        return jsonify({'error': 'Invalid phrase'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if record exists
    cursor.execute('SELECT count FROM tasbeh_counts WHERE user_id = ? AND phrase = ?', 
                   (session['user_id'], phrase))
    existing = cursor.fetchone()
    
    if existing:
        # Update existing count
        new_count = existing[0] + 1
        cursor.execute('''
            UPDATE tasbeh_counts 
            SET count = ?, last_updated = CURRENT_TIMESTAMP 
            WHERE user_id = ? AND phrase = ?
        ''', (new_count, session['user_id'], phrase))
    else:
        # Insert new record
        new_count = 1
        cursor.execute('''
            INSERT INTO tasbeh_counts (user_id, phrase, count, last_updated)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ''', (session['user_id'], phrase, new_count))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'count': new_count})

@app.route('/tasbeh/reset', methods=['POST'])
def reset_tasbeh():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    phrase = request.json.get('phrase')
    if phrase not in islamic_phrases:
        return jsonify({'error': 'Invalid phrase'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('DELETE FROM tasbeh_counts WHERE user_id = ? AND phrase = ?', 
                   (session['user_id'], phrase))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'count': 0})

@app.route('/tasbeh/total')
def tasbeh_total():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT SUM(count) FROM tasbeh_counts WHERE user_id = ?', 
                   (session['user_id'],))
    total = cursor.fetchone()[0] or 0
    
    conn.close()
    
    return jsonify({'total': total})

@app.route('/prayer-times')
def prayer_times():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get user location
    cursor.execute('SELECT city, country, latitude, longitude, timezone FROM user_locations WHERE user_id = ?', 
                   (session['user_id'],))
    location = cursor.fetchone()
    
    conn.close()
    
    prayer_data = None
    location_info = None
    
    if location:
        city, country, lat, lng, timezone = location
        location_info = {
            'city': city,
            'country': country,
            'latitude': lat,
            'longitude': lng,
            'timezone': timezone
        }
        
        # Get prayer times from API
        prayer_data = get_prayer_times(lat, lng)
    
    return render_template('prayer_times.html', 
                         prayer_data=prayer_data, 
                         location=location_info,
                         username=session.get('username'))

@app.route('/set-location', methods=['POST'])
def set_location():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    data = request.json
    city = data.get('city')
    country = data.get('country')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    
    if not all([city, country, latitude, longitude]):
        return jsonify({'error': 'Missing location data'}), 400
    
    # Get timezone for the location
    timezone = get_timezone(latitude, longitude)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user location exists
    cursor.execute('SELECT id FROM user_locations WHERE user_id = ?', (session['user_id'],))
    existing = cursor.fetchone()
    
    if existing:
        # Update existing location
        cursor.execute('''
            UPDATE user_locations 
            SET city = ?, country = ?, latitude = ?, longitude = ?, timezone = ?, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
        ''', (city, country, latitude, longitude, timezone, session['user_id']))
    else:
        # Insert new location
        cursor.execute('''
            INSERT INTO user_locations (user_id, city, country, latitude, longitude, timezone, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ''', (session['user_id'], city, country, latitude, longitude, timezone))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/get-prayer-times-api')
def get_prayer_times_api():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT latitude, longitude FROM user_locations WHERE user_id = ?', 
                   (session['user_id'],))
    location = cursor.fetchone()
    conn.close()
    
    if not location:
        return jsonify({'error': 'Location not set'}), 400
    
    lat, lng = location
    prayer_data = get_prayer_times(lat, lng)
    
    if prayer_data:
        return jsonify(prayer_data)
    else:
        return jsonify({'error': 'Failed to get prayer times'}), 500

def get_prayer_times(latitude, longitude):
    """Get prayer times from Aladhan API"""
    try:
        today = datetime.now().strftime('%d-%m-%Y')
        url = f"http://api.aladhan.com/v1/timings/{today}"
        params = {
            'latitude': latitude,
            'longitude': longitude,
            'method': 2,  # ISNA method
            'tune': '0,0,0,0,0,0,0,0,0'  # No adjustments
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if data['code'] == 200:
                timings = data['data']['timings']
                date_info = data['data']['date']
                
                # Format prayer times
                prayer_times = {
                    'Fajr': format_time(timings['Fajr']),
                    'Sunrise': format_time(timings['Sunrise']),
                    'Dhuhr': format_time(timings['Dhuhr']),
                    'Asr': format_time(timings['Asr']),
                    'Maghrib': format_time(timings['Maghrib']),
                    'Isha': format_time(timings['Isha']),
                    'date': date_info['readable'],
                    'hijri_date': date_info['hijri']['date']
                }
                
                return prayer_times
    except Exception as e:
        print(f"Error getting prayer times: {e}")
        return None

def get_timezone(latitude, longitude):
    """Get timezone for location using TimezoneDB API or fallback"""
    try:
        # You can use a free timezone API or calculate based on longitude
        # For simplicity, we'll calculate approximate timezone
        timezone_offset = int(longitude / 15)
        return f"UTC{timezone_offset:+d}"
    except:
        return "UTC+0"

def format_time(time_str):
    """Format time from 24h to 12h format"""
    try:
        time_obj = datetime.strptime(time_str, '%H:%M')
        return time_obj.strftime('%I:%M %p')
    except:
        return time_str

@app.route('/health')
def health():
    return {'status': 'healthy', 'message': 'Flask app is running'}, 200

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=False)