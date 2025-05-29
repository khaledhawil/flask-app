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

# Register API blueprint
from routes import api_bp
app.register_blueprint(api_bp, url_prefix='/api')

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

# Quran verses and Islamic content
quran_verses = [
    {
        "arabic": "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا",
        "translation": "And whoever fears Allah - He will make for him a way out",
        "reference": "سورة الطلاق آية 2"
    },
    {
        "arabic": "وَاللَّهُ غَالِبٌ عَلَىٰ أَمْرِهِ وَلَٰكِنَّ أَكْثَرَ النَّاسِ لَا يَعْلَمُونَ",
        "translation": "And Allah is predominant over His affair, but most people do not know",
        "reference": "سورة يوسف آية 21"
    },
    {
        "arabic": "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        "translation": "For indeed, with hardship comes ease",
        "reference": "سورة الشرح آية 5"
    },
    {
        "arabic": "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ",
        "translation": "And He is with you wherever you are",
        "reference": "سورة الحديد آية 4"
    }
]

hadith_collection = [
    {
        "arabic": "من قال سبحان الله وبحمده في يوم مائة مرة حطت خطاياه وإن كانت مثل زبد البحر",
        "translation": "Whoever says 'SubhanAllahi wa bihamdihi' 100 times a day, his sins will be wiped away even if they were like the foam of the sea",
        "narrator": "رواه البخاري ومسلم"
    },
    {
        "arabic": "أحب الكلام إلى الله أربع: سبحان الله، والحمد لله، ولا إله إلا الله، والله أكبر",
        "translation": "The most beloved words to Allah are four: SubhanAllah, Alhamdulillah, La ilaha illa Allah, and Allahu Akbar",
        "narrator": "رواه مسلم"
    },
    {
        "arabic": "من صلى الفجر في جماعة فكأنما صلى الليل كله",
        "translation": "Whoever prays Fajr in congregation, it is as if he prayed the whole night",
        "narrator": "رواه مسلم"
    },
    {
        "arabic": "الدعاء مخ العبادة",
        "translation": "Supplication is the essence of worship",
        "narrator": "رواه الترمذي"
    },
    {
        "arabic": "من قرأ القرآن فله بكل حرف حسنة، والحسنة بعشر أمثالها",
        "translation": "Whoever reads the Quran, for every letter there is a reward, and every reward is multiplied by ten",
        "narrator": "رواه الترمذي"
    },
    {
        "arabic": "خير الناس أنفعهم للناس",
        "translation": "The best of people are those who benefit others",
        "narrator": "رواه الطبراني"
    },
    {
        "arabic": "من حسن إسلام المرء تركه ما لا يعنيه",
        "translation": "Part of someone's being a good Muslim is his leaving alone that which does not concern him",
        "narrator": "رواه الترمذي"
    },
    {
        "arabic": "اتق الله حيثما كنت، وأتبع السيئة الحسنة تمحها، وخالق الناس بخلق حسن",
        "translation": "Fear Allah wherever you are, follow up a bad deed with a good one to erase it, and treat people with good character",
        "narrator": "رواه الترمذي"
    }
]

def get_db_connection():
    db_path = '/app/data/app.db' if os.path.exists('/app/data') else 'app.db'
    return sqlite3.connect(db_path)

@app.route('/')
def home():
    # Get random hadith for this page load
    random_hadith = random.choice(hadith_collection)
    
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
    return render_template('index.html', 
                         phrase=random_phrase, 
                         username=username,
                         random_hadith=random_hadith)

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
    for i, phrase in enumerate(islamic_phrases):
        count_data = user_counts.get(phrase, {'count': 0, 'last_updated': None})
        phrases_data.append({
            'id': i + 1,
            'text': phrase,
            'count': count_data['count'],
            'last_updated': count_data['last_updated']
        })
    
    # Calculate total dhikr count for the user
    total_dhikr = sum(phrase['count'] for phrase in phrases_data)
    
    return render_template('tasbeh.html', 
                         phrases=phrases_data, 
                         username=session.get('username'),
                         total_dhikr=total_dhikr)

@app.route('/tasbeh/premium')
def tasbeh_premium():
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
    
    return render_template('tasbeh_premium.html', phrases=phrases_data, username=session.get('username'))

@app.route('/tasbeh/enhanced')
def tasbeh_enhanced():
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
    
    return render_template('tasbeh_enhanced.html', phrases=phrases_data, username=session.get('username'))

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

@app.route('/tasbeh/quick-add', methods=['POST'])
def quick_add_tasbeh():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    phrase = request.json.get('phrase')
    amount = request.json.get('amount', 1)
    
    if phrase not in islamic_phrases:
        return jsonify({'error': 'Invalid phrase'}), 400
    
    if not isinstance(amount, int) or amount < 1:
        return jsonify({'error': 'Invalid amount'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if record exists
    cursor.execute('SELECT count FROM tasbeh_counts WHERE user_id = ? AND phrase = ?', 
                   (session['user_id'], phrase))
    existing = cursor.fetchone()
    
    if existing:
        # Update existing count
        new_count = existing[0] + amount
        cursor.execute('''
            UPDATE tasbeh_counts 
            SET count = ?, last_updated = CURRENT_TIMESTAMP 
            WHERE user_id = ? AND phrase = ?
        ''', (new_count, session['user_id'], phrase))
    else:
        # Insert new record
        new_count = amount
        cursor.execute('''
            INSERT INTO tasbeh_counts (user_id, phrase, count, last_updated)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ''', (session['user_id'], phrase, new_count))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'count': new_count})

@app.route('/increment-dhikr', methods=['POST'])
def increment_dhikr():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    data = request.get_json() if request.is_json else {}
    phrase = data.get('phrase', 'سبحان الله')  # Default phrase
    amount = data.get('amount', 1)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if phrase exists for user
    cursor.execute('SELECT count FROM tasbeh_counts WHERE user_id = ? AND phrase = ?', 
                   (session['user_id'], phrase))
    existing = cursor.fetchone()
    
    if existing:
        # Update existing count
        new_count = existing[0] + amount
        cursor.execute('''
            UPDATE tasbeh_counts 
            SET count = ?, last_updated = CURRENT_TIMESTAMP 
            WHERE user_id = ? AND phrase = ?
        ''', (new_count, session['user_id'], phrase))
    else:
        # Insert new record
        new_count = amount
        cursor.execute('''
            INSERT INTO tasbeh_counts (user_id, phrase, count, last_updated)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        ''', (session['user_id'], phrase, new_count))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'count': new_count, 'phrase': phrase})

@app.route('/reset-phrase', methods=['POST'])
def reset_phrase():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    phrase = request.json.get('phrase')
    if not phrase:
        return jsonify({'error': 'Phrase is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE tasbeh_counts 
        SET count = 0, last_updated = CURRENT_TIMESTAMP 
        WHERE user_id = ? AND phrase = ?
    ''', (session['user_id'], phrase))
    
    conn.commit()
    conn.close()
    
    return jsonify({'success': True})

@app.route('/tasbeh/statistics')
def tasbeh_statistics():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get all user's tasbeh counts
    cursor.execute('''
        SELECT phrase, count, last_updated 
        FROM tasbeh_counts 
        WHERE user_id = ? 
        ORDER BY count DESC
    ''', (session['user_id'],))
    
    phrases = []
    total_count = 0
    for row in cursor.fetchall():
        phrase_data = {
            'phrase': row[0],
            'count': row[1],
            'last_updated': row[2]
        }
        phrases.append(phrase_data)
        total_count += row[1]
    
    conn.close()
    
    return jsonify({
        'phrases': phrases,
        'total_count': total_count,
        'phrases_count': len(phrases)
    })

@app.route('/tasbeh/goals', methods=['GET', 'POST'])
def tasbeh_goals():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    if request.method == 'POST':
        # Set or update goal
        goal_data = request.json
        # This could be expanded to save goals to database
        return jsonify({'success': True, 'goal': goal_data})
    else:
        # Get current goals (placeholder implementation)
        return jsonify({
            'daily_goal': 100,
            'weekly_goal': 700,
            'monthly_goal': 3000
        })

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
    city = "مكة المكرمة"  # Default city
    country = "السعودية"  # Default country
    date = datetime.now().strftime('%Y-%m-%d')
    
    if location:
        city, country, lat, lng, timezone = location
        
        # Get prayer times from API
        prayer_data = get_prayer_times(lat, lng)
    
    return render_template('prayer_times.html', 
                         prayer_data=prayer_data, 
                         city=city,
                         country=country,
                         date=date,
                         username=session.get('username'))

@app.route('/set-location', methods=['POST'])
def set_location():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No JSON data received'}), 400
            
        city = data.get('city')
        country = data.get('country')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        
        print(f"Received location data: {city}, {country}, {latitude}, {longitude}")
        
        if not all([city, country]):
            return jsonify({'error': 'City and country are required'}), 400
        
        # If coordinates are not provided, get them using geocoding
        if not latitude or not longitude:
            try:
                # Use OpenStreetMap Nominatim API for geocoding
                geocode_url = f"https://nominatim.openstreetmap.org/search"
                params = {
                    'q': f"{city}, {country}",
                    'format': 'json',
                    'limit': 1
                }
                headers = {
                    'User-Agent': 'Islamic-App/1.0 (Prayer Times)'
                }
                
                response = requests.get(geocode_url, params=params, headers=headers, timeout=10)
                
                if response.status_code == 200:
                    geocode_data = response.json()
                    if geocode_data:
                        latitude = float(geocode_data[0]['lat'])
                        longitude = float(geocode_data[0]['lon'])
                        print(f"Geocoded coordinates: {latitude}, {longitude}")
                    else:
                        return jsonify({'error': 'Could not find coordinates for this location'}), 400
                else:
                    return jsonify({'error': 'Geocoding service unavailable'}), 500
                    
            except Exception as e:
                print(f"Geocoding error: {e}")
                return jsonify({'error': 'Failed to geocode location'}), 500
        
        # Convert to float if they're strings
        try:
            latitude = float(latitude)
            longitude = float(longitude)
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid coordinates'}), 400
        
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
            print(f"Updated location for user {session['user_id']}")
        else:
            # Insert new location
            cursor.execute('''
                INSERT INTO user_locations (user_id, city, country, latitude, longitude, timezone, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ''', (session['user_id'], city, country, latitude, longitude, timezone))
            print(f"Inserted new location for user {session['user_id']}")
        
        conn.commit()
        conn.close()
        
        return jsonify({'success': True})
        
    except Exception as e:
        print(f"Error in set_location: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

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

@app.route('/quran')
def quran():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    return render_template('enhanced_quran.html', 
                         username=session.get('username'))

@app.route('/enhanced-quran')
def enhanced_quran():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    return render_template('enhanced_quran.html', 
                         username=session.get('username'))

@app.route('/quran-basic')
def quran_basic():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    return render_template('quran.html', 
                         verses=quran_verses, 
                         hadiths=hadith_collection,
                         username=session.get('username'))

@app.route('/islamic-content')
def islamic_content():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    return render_template('islamic_content.html', 
                         verses=quran_verses, 
                         hadiths=hadith_collection,
                         username=session.get('username'))

@app.route('/tasbeh/analytics')
def tasbeh_analytics():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get total counts by phrase
    cursor.execute('''
        SELECT phrase, count 
        FROM tasbeh_counts 
        WHERE user_id = ? 
        ORDER BY count DESC
    ''', (session['user_id'],))
    
    phrase_counts = {}
    for row in cursor.fetchall():
        phrase_counts[row[0]] = row[1]
    
    # Get daily activity (last 7 days)
    # For a real implementation, you'd need a separate table to track daily activity
    # This is a simplified version
    
    # Get timestamps of updates
    cursor.execute('''
        SELECT last_updated
        FROM tasbeh_counts
        WHERE user_id = ?
        ORDER BY last_updated DESC
    ''', (session['user_id'],))
    
    timestamps = [row[0] for row in cursor.fetchall()]
    
    # Calculate streaks (simplified)
    current_streak = 0
    max_streak = 0
    
    conn.close()
    
    # Prepare analytics data
    analytics = {
        'phrase_counts': phrase_counts,
        'total_count': sum(phrase_counts.values()) if phrase_counts else 0,
        'current_streak': current_streak,
        'max_streak': max_streak,
        'most_frequent_phrase': max(phrase_counts.items(), key=lambda x: x[1])[0] if phrase_counts else None
    }
    
    return jsonify(analytics)

@app.route('/get-total-dhikr')
def get_total_dhikr():
    """Get total dhikr count for the current user"""
    if 'user_id' not in session:
        return jsonify({'total': 0})
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT SUM(count) FROM tasbeh_counts WHERE user_id = ?', 
                   (session['user_id'],))
    result = cursor.fetchone()
    conn.close()
    
    total = result[0] if result and result[0] else 0
    return jsonify({'total': total})

@app.route('/get-hijri-date')
def get_hijri_date():
    """Get current Hijri date"""
    try:
        today = datetime.now().strftime('%d-%m-%Y')
        url = f"http://api.aladhan.com/v1/gToH/{today}"
        
        response = requests.get(url, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data['code'] == 200:
                hijri_date = data['data']['hijri']['date']
                return jsonify({'hijri_date': hijri_date})
        
        return jsonify({'hijri_date': 'التاريخ الهجري غير متوفر'}), 500
    except Exception as e:
        print(f"Error getting Hijri date: {e}")
        return jsonify({'hijri_date': 'التاريخ الهجري غير متوفر'}), 500

@app.route('/get-prayer-times')
def get_prayer_times_by_date():
    """Get prayer times for a specific date"""
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({'error': 'Date parameter required'}), 400
    
    try:
        # Get user location
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('SELECT latitude, longitude FROM user_locations WHERE user_id = ?', 
                       (session['user_id'],))
        location = cursor.fetchone()
        conn.close()
        
        if not location:
            return jsonify({'error': 'Location not set'}), 400
        
        lat, lng = location
        
        # Parse date (format: YYYY-M-D)
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        formatted_date = date_obj.strftime('%d-%m-%Y')
        
        # Get prayer times for specific date
        url = f"http://api.aladhan.com/v1/timings/{formatted_date}"
        params = {
            'latitude': lat,
            'longitude': lng,
            'method': 2,  # ISNA method
            'tune': '0,0,0,0,0,0,0,0,0'
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data['code'] == 200:
                timings = data['data']['timings']
                prayer_times = {
                    'Fajr': format_time(timings['Fajr']),
                    'Sunrise': format_time(timings['Sunrise']),
                    'Dhuhr': format_time(timings['Dhuhr']),
                    'Asr': format_time(timings['Asr']),
                    'Maghrib': format_time(timings['Maghrib']),
                    'Isha': format_time(timings['Isha'])
                }
                return jsonify(prayer_times)
        
        return jsonify({'error': 'Failed to get prayer times'}), 500
        
    except Exception as e:
        print(f"Error getting prayer times for date: {e}")
        return jsonify({'error': 'Failed to get prayer times'}), 500

@app.route('/hadith')
def hadith():
    """Hadith page with API integration"""
    username = session.get('username')
    return render_template('hadith.html', username=username)

@app.route('/api/hadith/editions')
def get_hadith_editions():
    """Get all available hadith editions"""
    try:
        response = requests.get(
            'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json',
            timeout=10
        )
        if response.status_code == 200:
            return jsonify({'success': True, 'editions': response.json()})
        else:
            return jsonify({'success': False, 'error': 'Failed to fetch editions'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/hadith/<book>/<int:number>')
def get_hadith_by_number(book, number):
    """Get specific hadith by book and number"""
    try:
        url = f'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/{book}/{number}.json'
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return jsonify({'success': True, 'hadith': response.json()})
        else:
            return jsonify({'success': False, 'error': 'Hadith not found'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/api/hadith/<book>/<int:start>-<int:end>')
def get_hadith_range(book, start, end):
    """Get range of hadiths"""
    try:
        url = f'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/{book}/{start}-{end}.json'
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            return jsonify({'success': True, 'hadiths': response.json()})
        else:
            return jsonify({'success': False, 'error': 'Hadiths not found'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/favicon.ico')
def favicon():
    """Serve favicon to prevent 404 errors"""
    return '', 204

@app.context_processor
def inject_theme_settings():
    """Add theme settings to all templates."""
    return {
        'theme_css': url_for('static', filename='css/theme.css'),
        'theme_js': url_for('static', filename='js/theme.js')
    }
    
# Enable debugging
app.debug = True

if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=True)