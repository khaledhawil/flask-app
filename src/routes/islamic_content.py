from flask import jsonify, request, Blueprint
import sys
import os
import requests
import json

# Add the parent directory to the path to import services
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Create blueprint for Islamic content
bp = Blueprint('islamic_content', __name__)

# Global Quran API configuration
GLOBAL_QURAN_API_KEY = "api_key"  # Replace with your actual API key
GLOBAL_QURAN_BASE_URL = "https://api.globalquran.com"

@bp.route('/surahs')
def list_surahs():
    """Get all surahs list from Global Quran API"""
    try:
        # List of all 114 surahs with their names
        surahs = [
            {"number": 1, "name": "الفاتحة", "english_name": "Al-Fatihah", "ayahs": 7},
            {"number": 2, "name": "البقرة", "english_name": "Al-Baqarah", "ayahs": 286},
            {"number": 3, "name": "آل عمران", "english_name": "Ali 'Imran", "ayahs": 200},
            {"number": 4, "name": "النساء", "english_name": "An-Nisa", "ayahs": 176},
            {"number": 5, "name": "المائدة", "english_name": "Al-Ma'idah", "ayahs": 120},
            {"number": 6, "name": "الأنعام", "english_name": "Al-An'am", "ayahs": 165},
            {"number": 7, "name": "الأعراف", "english_name": "Al-A'raf", "ayahs": 206},
            {"number": 8, "name": "الأنفال", "english_name": "Al-Anfal", "ayahs": 75},
            {"number": 9, "name": "التوبة", "english_name": "At-Tawbah", "ayahs": 129},
            {"number": 10, "name": "يونس", "english_name": "Yunus", "ayahs": 109},
            {"number": 11, "name": "هود", "english_name": "Hud", "ayahs": 123},
            {"number": 12, "name": "يوسف", "english_name": "Yusuf", "ayahs": 111},
            {"number": 13, "name": "الرعد", "english_name": "Ar-Ra'd", "ayahs": 43},
            {"number": 14, "name": "إبراهيم", "english_name": "Ibrahim", "ayahs": 52},
            {"number": 15, "name": "الحجر", "english_name": "Al-Hijr", "ayahs": 99},
            {"number": 16, "name": "النحل", "english_name": "An-Nahl", "ayahs": 128},
            {"number": 17, "name": "الإسراء", "english_name": "Al-Isra", "ayahs": 111},
            {"number": 18, "name": "الكهف", "english_name": "Al-Kahf", "ayahs": 110},
            {"number": 19, "name": "مريم", "english_name": "Maryam", "ayahs": 98},
            {"number": 20, "name": "طه", "english_name": "Taha", "ayahs": 135},
            {"number": 21, "name": "الأنبياء", "english_name": "Al-Anbya", "ayahs": 112},
            {"number": 22, "name": "الحج", "english_name": "Al-Hajj", "ayahs": 78},
            {"number": 23, "name": "المؤمنون", "english_name": "Al-Mu'minun", "ayahs": 118},
            {"number": 24, "name": "النور", "english_name": "An-Nur", "ayahs": 64},
            {"number": 25, "name": "الفرقان", "english_name": "Al-Furqan", "ayahs": 77},
            {"number": 26, "name": "الشعراء", "english_name": "Ash-Shu'ara", "ayahs": 227},
            {"number": 27, "name": "النمل", "english_name": "An-Naml", "ayahs": 93},
            {"number": 28, "name": "القصص", "english_name": "Al-Qasas", "ayahs": 88},
            {"number": 29, "name": "العنكبوت", "english_name": "Al-'Ankabut", "ayahs": 69},
            {"number": 30, "name": "الروم", "english_name": "Ar-Rum", "ayahs": 60},
            {"number": 31, "name": "لقمان", "english_name": "Luqman", "ayahs": 34},
            {"number": 32, "name": "السجدة", "english_name": "As-Sajdah", "ayahs": 30},
            {"number": 33, "name": "الأحزاب", "english_name": "Al-Ahzab", "ayahs": 73},
            {"number": 34, "name": "سبأ", "english_name": "Saba", "ayahs": 54},
            {"number": 35, "name": "فاطر", "english_name": "Fatir", "ayahs": 45},
            {"number": 36, "name": "يس", "english_name": "Ya-Sin", "ayahs": 83},
            {"number": 37, "name": "الصافات", "english_name": "As-Saffat", "ayahs": 182},
            {"number": 38, "name": "ص", "english_name": "Sad", "ayahs": 88},
            {"number": 39, "name": "الزمر", "english_name": "Az-Zumar", "ayahs": 75},
            {"number": 40, "name": "غافر", "english_name": "Ghafir", "ayahs": 85},
            {"number": 41, "name": "فصلت", "english_name": "Fussilat", "ayahs": 54},
            {"number": 42, "name": "الشورى", "english_name": "Ash-Shuraa", "ayahs": 53},
            {"number": 43, "name": "الزخرف", "english_name": "Az-Zukhruf", "ayahs": 89},
            {"number": 44, "name": "الدخان", "english_name": "Ad-Dukhan", "ayahs": 59},
            {"number": 45, "name": "الجاثية", "english_name": "Al-Jathiyah", "ayahs": 37},
            {"number": 46, "name": "الأحقاف", "english_name": "Al-Ahqaf", "ayahs": 35},
            {"number": 47, "name": "محمد", "english_name": "Muhammad", "ayahs": 38},
            {"number": 48, "name": "الفتح", "english_name": "Al-Fath", "ayahs": 29},
            {"number": 49, "name": "الحجرات", "english_name": "Al-Hujurat", "ayahs": 18},
            {"number": 50, "name": "ق", "english_name": "Qaf", "ayahs": 45},
            {"number": 51, "name": "الذاريات", "english_name": "Adh-Dhariyat", "ayahs": 60},
            {"number": 52, "name": "الطور", "english_name": "At-Tur", "ayahs": 49},
            {"number": 53, "name": "النجم", "english_name": "An-Najm", "ayahs": 62},
            {"number": 54, "name": "القمر", "english_name": "Al-Qamar", "ayahs": 55},
            {"number": 55, "name": "الرحمن", "english_name": "Ar-Rahman", "ayahs": 78},
            {"number": 56, "name": "الواقعة", "english_name": "Al-Waqi'ah", "ayahs": 96},
            {"number": 57, "name": "الحديد", "english_name": "Al-Hadid", "ayahs": 29},
            {"number": 58, "name": "المجادلة", "english_name": "Al-Mujadila", "ayahs": 22},
            {"number": 59, "name": "الحشر", "english_name": "Al-Hashr", "ayahs": 24},
            {"number": 60, "name": "الممتحنة", "english_name": "Al-Mumtahanah", "ayahs": 13},
            {"number": 61, "name": "الصف", "english_name": "As-Saff", "ayahs": 14},
            {"number": 62, "name": "الجمعة", "english_name": "Al-Jumu'ah", "ayahs": 11},
            {"number": 63, "name": "المنافقون", "english_name": "Al-Munafiqun", "ayahs": 11},
            {"number": 64, "name": "التغابن", "english_name": "At-Taghabun", "ayahs": 18},
            {"number": 65, "name": "الطلاق", "english_name": "At-Talaq", "ayahs": 12},
            {"number": 66, "name": "التحريم", "english_name": "At-Tahrim", "ayahs": 12},
            {"number": 67, "name": "الملك", "english_name": "Al-Mulk", "ayahs": 30},
            {"number": 68, "name": "القلم", "english_name": "Al-Qalam", "ayahs": 52},
            {"number": 69, "name": "الحاقة", "english_name": "Al-Haqqah", "ayahs": 52},
            {"number": 70, "name": "المعارج", "english_name": "Al-Ma'arij", "ayahs": 44},
            {"number": 71, "name": "نوح", "english_name": "Nuh", "ayahs": 28},
            {"number": 72, "name": "الجن", "english_name": "Al-Jinn", "ayahs": 28},
            {"number": 73, "name": "المزمل", "english_name": "Al-Muzzammil", "ayahs": 20},
            {"number": 74, "name": "المدثر", "english_name": "Al-Muddaththir", "ayahs": 56},
            {"number": 75, "name": "القيامة", "english_name": "Al-Qiyamah", "ayahs": 40},
            {"number": 76, "name": "الإنسان", "english_name": "Al-Insan", "ayahs": 31},
            {"number": 77, "name": "المرسلات", "english_name": "Al-Mursalat", "ayahs": 50},
            {"number": 78, "name": "النبأ", "english_name": "An-Naba", "ayahs": 40},
            {"number": 79, "name": "النازعات", "english_name": "An-Nazi'at", "ayahs": 46},
            {"number": 80, "name": "عبس", "english_name": "Abasa", "ayahs": 42},
            {"number": 81, "name": "التكوير", "english_name": "At-Takwir", "ayahs": 29},
            {"number": 82, "name": "الانفطار", "english_name": "Al-Infitar", "ayahs": 19},
            {"number": 83, "name": "المطففين", "english_name": "Al-Mutaffifin", "ayahs": 36},
            {"number": 84, "name": "الانشقاق", "english_name": "Al-Inshiqaq", "ayahs": 25},
            {"number": 85, "name": "البروج", "english_name": "Al-Buruj", "ayahs": 22},
            {"number": 86, "name": "الطارق", "english_name": "At-Tariq", "ayahs": 17},
            {"number": 87, "name": "الأعلى", "english_name": "Al-A'la", "ayahs": 19},
            {"number": 88, "name": "الغاشية", "english_name": "Al-Ghashiyah", "ayahs": 26},
            {"number": 89, "name": "الفجر", "english_name": "Al-Fajr", "ayahs": 30},
            {"number": 90, "name": "البلد", "english_name": "Al-Balad", "ayahs": 20},
            {"number": 91, "name": "الشمس", "english_name": "Ash-Shams", "ayahs": 15},
            {"number": 92, "name": "الليل", "english_name": "Al-Layl", "ayahs": 21},
            {"number": 93, "name": "الضحى", "english_name": "Ad-Duhaa", "ayahs": 11},
            {"number": 94, "name": "الشرح", "english_name": "Ash-Sharh", "ayahs": 8},
            {"number": 95, "name": "التين", "english_name": "At-Tin", "ayahs": 8},
            {"number": 96, "name": "العلق", "english_name": "Al-Alaq", "ayahs": 19},
            {"number": 97, "name": "القدر", "english_name": "Al-Qadr", "ayahs": 5},
            {"number": 98, "name": "البينة", "english_name": "Al-Bayyinah", "ayahs": 8},
            {"number": 99, "name": "الزلزلة", "english_name": "Az-Zalzalah", "ayahs": 8},
            {"number": 100, "name": "العاديات", "english_name": "Al-Adiyat", "ayahs": 11},
            {"number": 101, "name": "القارعة", "english_name": "Al-Qari'ah", "ayahs": 11},
            {"number": 102, "name": "التكاثر", "english_name": "At-Takathur", "ayahs": 8},
            {"number": 103, "name": "العصر", "english_name": "Al-Asr", "ayahs": 3},
            {"number": 104, "name": "الهمزة", "english_name": "Al-Humazah", "ayahs": 9},
            {"number": 105, "name": "الفيل", "english_name": "Al-Fil", "ayahs": 5},
            {"number": 106, "name": "قريش", "english_name": "Quraysh", "ayahs": 4},
            {"number": 107, "name": "الماعون", "english_name": "Al-Ma'un", "ayahs": 7},
            {"number": 108, "name": "الكوثر", "english_name": "Al-Kawthar", "ayahs": 3},
            {"number": 109, "name": "الكافرون", "english_name": "Al-Kafirun", "ayahs": 6},
            {"number": 110, "name": "النصر", "english_name": "An-Nasr", "ayahs": 3},
            {"number": 111, "name": "المسد", "english_name": "Al-Masad", "ayahs": 5},
            {"number": 112, "name": "الإخلاص", "english_name": "Al-Ikhlas", "ayahs": 4},
            {"number": 113, "name": "الفلق", "english_name": "Al-Falaq", "ayahs": 5},
            {"number": 114, "name": "الناس", "english_name": "An-Nas", "ayahs": 6}
        ]
        
        return jsonify({"success": True, "data": surahs})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@bp.route('/surah/<int:surah_number>')
def get_surah(surah_number):
    """Get a specific surah with all its ayahs using Al-Quran Cloud API"""
    try:
        if surah_number < 1 or surah_number > 114:
            return jsonify({"success": False, "error": "Invalid surah number"}), 400
        
        # Use Al-Quran Cloud API to fetch surah with audio
        api_url = f"https://api.alquran.cloud/v1/surah/{surah_number}/ar.alafasy"
        
        response = requests.get(api_url, timeout=10)
        
        if response.status_code != 200:
            return jsonify({"success": False, "error": "Failed to fetch surah from Al-Quran Cloud API"}), 500
            
        api_data = response.json()
        
        if api_data.get("code") != 200:
            return jsonify({"success": False, "error": "Al-Quran Cloud API error"}), 500
            
        surah_data = api_data.get("data", {})
        
        # Format the response to match our frontend expectations
        formatted_surah = {
            "number": surah_data.get("number"),
            "name": surah_data.get("name"),
            "english_name": surah_data.get("englishName"),
            "english_name_translation": surah_data.get("englishNameTranslation"),
            "number_of_ayahs": surah_data.get("numberOfAyahs"),
            "type": surah_data.get("revelationType"),
            "ayahs": []
        }
        
        # Process ayahs with audio
        for ayah in surah_data.get("ayahs", []):
            formatted_ayah = {
                "number": ayah.get("numberInSurah"),
                "text": ayah.get("text"),
                "audio": ayah.get("audio"),
                "audio_secondary": ayah.get("audioSecondary", [])
            }
            formatted_surah["ayahs"].append(formatted_ayah)
        
        return jsonify({"success": True, "data": formatted_surah})
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@bp.route('/search')
def search_surahs():
    """Search for surahs by name or number"""
    try:
        query = request.args.get('q', '').strip()
        if not query:
            return jsonify({"success": False, "error": "Search query is required"}), 400
        
        # Get all surahs
        response = list_surahs()
        surahs_data = response.get_json()
        
        if not surahs_data.get("success"):
            return jsonify({"success": False, "error": "Failed to get surahs list"}), 500
            
        surahs = surahs_data.get("data", [])
        results = []
        
        # Search logic
        for surah in surahs:
            # Search by number
            if query.isdigit() and str(surah["number"]) == query:
                results.append(surah)
            # Search by Arabic name
            elif query in surah["name"]:
                results.append(surah)
            # Search by English name
            elif query.lower() in surah["english_name"].lower():
                results.append(surah)
        
        return jsonify({"success": True, "data": results})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@bp.route('/random')
def get_random_ayah():
    """Get a random ayah from a random surah"""
    import random
    try:
        # Get a random surah number
        surah_number = random.randint(1, 114)
        
        # Get the surah data
        surah_response = get_surah(surah_number)
        surah_data = surah_response.get_json()
        
        if not surah_data.get("success"):
            return jsonify({"success": False, "error": "Failed to get random surah"}), 500
            
        surah = surah_data.get("data", {})
        ayahs = surah.get("ayahs", [])
        
        if not ayahs:
            return jsonify({"success": False, "error": "No ayahs found in surah"}), 404
            
        # Get a random ayah
        random_ayah = random.choice(ayahs)
        
        return jsonify({
            "success": True,
            "data": {
                "surah": {
                    "number": surah["number"],
                    "name": surah["name"],
                    "english_name": surah["english_name"]
                },
                "ayah": random_ayah
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@bp.route('/audio/<int:surah_number>')
def get_surah_audio(surah_number):
    """Get audio URL for a specific surah"""
    try:
        if surah_number < 1 or surah_number > 114:
            return jsonify({"success": False, "error": "Invalid surah number"}), 400
            
        # Format surah number with leading zeros
        formatted_surah = f"{surah_number:03d}"
        
        # Multiple audio sources for different reciters
        audio_sources = {
            "abdulbasit": f"https://server8.mp3quran.net/afs/{formatted_surah}.mp3",
            "maher": f"https://server12.mp3quran.net/maher/{formatted_surah}.mp3", 
            "sudais": f"https://server11.mp3quran.net/sds/{formatted_surah}.mp3",
            "mishary": f"https://server13.mp3quran.net/maher/{formatted_surah}.mp3"
        }
        
        return jsonify({
            "success": True, 
            "data": {
                "surah_number": surah_number,
                "audio_sources": audio_sources
            }
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
        
        # Select a random surah
        random_surah_info = random.choice(all_surahs)
        surah = quran_service.get_surah(random_surah_info["number"])
        
        if surah and surah.get("ayahs"):
            random_ayah = random.choice(surah["ayahs"])
            return jsonify({
                "success": True,
                "data": {
                    "surah": {
                        "number": surah["number"],
                        "name": surah["name"],
                        "english_name": surah["english_name"]
                    },
                    "ayah": random_ayah
                }
            })
        else:
            return jsonify({"success": False, "error": "No ayahs available"}), 404
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500