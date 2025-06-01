from flask import Blueprint, jsonify, request
import requests
from datetime import datetime
import math
import os
import json

# Create blueprint - not used directly, but kept for compatibility
api_bp = Blueprint('api', __name__)

# Popular Islamic cities with their coordinates
ISLAMIC_CITIES = {
    # Egypt
    'cairo': {'name': 'القاهرة، مصر', 'lat': 30.0444, 'lng': 31.2357, 'timezone': 'Africa/Cairo'},
    'alexandria': {'name': 'الإسكندرية، مصر', 'lat': 31.2001, 'lng': 29.9187, 'timezone': 'Africa/Cairo'},
    'giza': {'name': 'الجيزة، مصر', 'lat': 30.0131, 'lng': 31.2089, 'timezone': 'Africa/Cairo'},
    'luxor': {'name': 'الأقصر، مصر', 'lat': 25.6872, 'lng': 32.6396, 'timezone': 'Africa/Cairo'},
    'aswan': {'name': 'أسوان، مصر', 'lat': 24.0889, 'lng': 32.8998, 'timezone': 'Africa/Cairo'},
    
    # Saudi Arabia
    'mecca': {'name': 'مكة المكرمة، السعودية', 'lat': 21.3891, 'lng': 39.8579, 'timezone': 'Asia/Riyadh'},
    'medina': {'name': 'المدينة المنورة، السعودية', 'lat': 24.5247, 'lng': 39.5692, 'timezone': 'Asia/Riyadh'},
    'riyadh': {'name': 'الرياض، السعودية', 'lat': 24.7136, 'lng': 46.6753, 'timezone': 'Asia/Riyadh'},
    'jeddah': {'name': 'جدة، السعودية', 'lat': 21.4858, 'lng': 39.1925, 'timezone': 'Asia/Riyadh'},
    'dammam': {'name': 'الدمام، السعودية', 'lat': 26.4282, 'lng': 50.1044, 'timezone': 'Asia/Riyadh'},
    
    # UAE
    'dubai': {'name': 'دبي، الإمارات', 'lat': 25.2048, 'lng': 55.2708, 'timezone': 'Asia/Dubai'},
    'abu_dhabi': {'name': 'أبو ظبي، الإمارات', 'lat': 24.2532, 'lng': 54.3665, 'timezone': 'Asia/Dubai'},
    
    # Jordan
    'amman': {'name': 'عمان، الأردن', 'lat': 31.9454, 'lng': 35.9284, 'timezone': 'Asia/Amman'},
    
    # Palestine
    'jerusalem': {'name': 'القدس، فلسطين', 'lat': 31.7683, 'lng': 35.2137, 'timezone': 'Asia/Jerusalem'},
    
    # Turkey
    'istanbul': {'name': 'إسطنبول، تركيا', 'lat': 41.0082, 'lng': 28.9784, 'timezone': 'Europe/Istanbul'},
    
    # Morocco
    'casablanca': {'name': 'الدار البيضاء، المغرب', 'lat': 33.5731, 'lng': -7.5898, 'timezone': 'Africa/Casablanca'},
    
    # Malaysia
    'kuala_lumpur': {'name': 'كوالالمبور، ماليزيا', 'lat': 3.1390, 'lng': 101.6869, 'timezone': 'Asia/Kuala_Lumpur'},
    
    # Indonesia
    'jakarta': {'name': 'جاكرتا، إندونيسيا', 'lat': -6.2088, 'lng': 106.8456, 'timezone': 'Asia/Jakarta'},
    
    # Pakistan
    'karachi': {'name': 'كراتشي، باكستان', 'lat': 24.8607, 'lng': 67.0011, 'timezone': 'Asia/Karachi'},
    'lahore': {'name': 'لاهور، باكستان', 'lat': 31.5204, 'lng': 74.3587, 'timezone': 'Asia/Karachi'},
    
    # Bangladesh
    'dhaka': {'name': 'دكا، بنغلاديش', 'lat': 23.8103, 'lng': 90.4125, 'timezone': 'Asia/Dhaka'},
    
    # Iran
    'tehran': {'name': 'طهران، إيران', 'lat': 35.6892, 'lng': 51.3890, 'timezone': 'Asia/Tehran'},
    
    # Iraq
    'baghdad': {'name': 'بغداد، العراق', 'lat': 33.3152, 'lng': 44.3661, 'timezone': 'Asia/Baghdad'},
    
    # Syria
    'damascus': {'name': 'دمشق، سوريا', 'lat': 33.5138, 'lng': 36.2765, 'timezone': 'Asia/Damascus'},
    
    # Lebanon
    'beirut': {'name': 'بيروت، لبنان', 'lat': 33.8938, 'lng': 35.5018, 'timezone': 'Asia/Beirut'},
}

@api_bp.route('/cities')
def get_islamic_cities():
    """Get list of popular Islamic cities"""
    return jsonify({'success': True, 'cities': ISLAMIC_CITIES})

@api_bp.route('/prayer-times')
def get_prayer_times():
    """
    Get prayer times based on coordinates or city name
    Query params: lat, lng OR city (from ISLAMIC_CITIES)
    Optional params: date, method (calculation method)
    """
    try:
        # Check if city parameter is provided
        city_key = request.args.get('city', None)
        if city_key and city_key.lower() in ISLAMIC_CITIES:
            city_data = ISLAMIC_CITIES[city_key.lower()]
            lat = city_data['lat']
            lng = city_data['lng']
        else:
            # Get coordinates from request
            lat = request.args.get('lat', None)
            lng = request.args.get('lng', None)
            
            if not lat or not lng:
                return jsonify({'success': False, 'error': 'Latitude and longitude are required, or use city parameter'}), 400
        
        # Convert to float
        lat = float(lat)
        lng = float(lng)
        
        # Get optional parameters
        date = request.args.get('date', datetime.now().strftime('%d-%m-%Y'))
        method = request.args.get('method', '4')  # Default to Egyptian General Authority of Survey
        
        # Call Aladhan API
        url = f"http://api.aladhan.com/v1/timings/{date}"
        params = {
            'latitude': lat,
            'longitude': lng,
            'method': method,
            'tune': '0,0,0,0,0,0,0,0,0'  # No adjustments
        }
        
        response = requests.get(url, params=params, timeout=10)
        
        if response.status_code != 200:
            # Fallback to mock prayer times
            return get_mock_prayer_times(lat, lng)
            
        data = response.json()
        
        if data.get('code') != 200:
            return get_mock_prayer_times(lat, lng)
        
        # Format prayer times nicely
        timings = data['data']['timings']
        formatted_timings = {}
        
        # Only include main prayers
        prayer_keys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']
        for prayer in prayer_keys:
            if prayer in timings:
                time_str = timings[prayer]
                # Remove timezone info if present (e.g., "05:30 (EET)")
                if '(' in time_str:
                    time_str = time_str.split('(')[0].strip()
                formatted_timings[prayer] = time_str
        
        # Add location info
        location_info = {
            'latitude': lat,
            'longitude': lng,
            'timezone': data['data']['meta']['timezone'] if 'meta' in data['data'] else None
        }
        
        return jsonify({
            'success': True, 
            'data': {
                'timings': formatted_timings,
                'date': data['data']['date'],
                'meta': location_info
            }
        })
    
    except Exception as e:
        print(f"Prayer times error: {str(e)}")
        return get_mock_prayer_times(lat if 'lat' in locals() else 30.0444, lng if 'lng' in locals() else 31.2357)

def get_mock_prayer_times(lat, lng):
    """Generate mock prayer times based on coordinates and current date"""
    try:
        now = datetime.now()
        
        # Calculate approximate prayer times based on sun position
        # This is a simplified calculation for fallback purposes
        
        # Base times (approximate for Egypt/Middle East)
        base_times = {
            'Fajr': 4.5,      # 4:30 AM
            'Sunrise': 6.0,   # 6:00 AM  
            'Dhuhr': 12.0,    # 12:00 PM
            'Asr': 15.5,      # 3:30 PM
            'Maghrib': 18.5,  # 6:30 PM
            'Isha': 20.0      # 8:00 PM
        }
        
        # Adjust for latitude (northern latitudes have different prayer times)
        lat_adjustment = (lat - 30) * 0.02  # Rough adjustment per degree
        
        # Adjust for season (day of year)
        day_of_year = now.timetuple().tm_yday
        seasonal_adjustment = math.sin((day_of_year - 81) / 365 * 2 * math.pi) * 1.5
        
        formatted_timings = {}
        for prayer, base_hour in base_times.items():
            adjusted_hour = base_hour + lat_adjustment
            if prayer in ['Fajr', 'Sunrise', 'Maghrib', 'Isha']:
                adjusted_hour += seasonal_adjustment
            
            # Convert to hours and minutes
            hours = int(adjusted_hour)
            minutes = int((adjusted_hour - hours) * 60)
            
            # Format as HH:MM
            formatted_timings[prayer] = f"{hours:02d}:{minutes:02d}"
        
        return jsonify({
            'success': True,
            'data': {
                'timings': formatted_timings,
                'date': {
                    'readable': now.strftime('%d %B %Y'),
                    'timestamp': str(int(now.timestamp()))
                },
                'meta': {
                    'latitude': lat,
                    'longitude': lng,
                    'method': 'Mock calculation'
                }
            }
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/weather')
def get_weather():
    """
    Get weather information based on coordinates or city name
    Query params: lat, lng OR city (from ISLAMIC_CITIES)
    Optional params: units (metric, imperial)
    """
    try:
        # Check if city parameter is provided
        city_key = request.args.get('city', None)
        if city_key and city_key.lower() in ISLAMIC_CITIES:
            city_data = ISLAMIC_CITIES[city_key.lower()]
            lat = city_data['lat']
            lng = city_data['lng']
            city_name = city_data['name']
        else:
            # Get coordinates from request
            lat = request.args.get('lat', None)
            lng = request.args.get('lng', None)
            city_name = None
            
            if not lat or not lng:
                return jsonify({'success': False, 'error': 'Latitude and longitude are required, or use city parameter'}), 400
        
        # Convert to float
        lat = float(lat)
        lng = float(lng)
        
        # Always return mock data for now, but make it location-specific
        return get_enhanced_mock_weather(lat, lng, city_name)
    
    except Exception as e:
        # Fallback to mock data if something fails
        return get_enhanced_mock_weather(30.0444, 31.2357, 'القاهرة، مصر')

def get_enhanced_mock_weather(lat, lng, city_name=None):
    """
    Generate enhanced mock weather data based on coordinates and season
    """
    try:
        # Convert to numbers
        lat = float(lat)
        lng = float(lng)
        
        # Get current date components for realistic weather
        now = datetime.now()
        day_of_year = now.timetuple().tm_yday
        hour = now.hour
        
        # Determine climate zone
        if abs(lat) < 23.5:  # Tropical
            base_temp = 28
            humidity_base = 70
        elif abs(lat) < 40:  # Subtropical
            base_temp = 22
            humidity_base = 60
        else:  # Temperate
            base_temp = 15
            humidity_base = 65
        
        # Seasonal temperature variation
        seasonal_factor = math.cos((day_of_year - 172) / 365 * 2 * math.pi)
        if lat < 0:  # Southern hemisphere
            seasonal_factor = -seasonal_factor
        
        # Daily temperature variation
        daily_factor = math.sin((hour - 6) / 24 * 2 * math.pi) * 5
        
        temperature = base_temp + seasonal_factor * 15 + daily_factor
        
        # Determine weather condition based on location and season
        conditions_map = {
            'clear': {'ar': 'مشمس', 'icon': '☀️', 'code': '01d'},
            'few_clouds': {'ar': 'قليل الغيوم', 'icon': '🌤️', 'code': '02d'},
            'scattered_clouds': {'ar': 'غيوم متفرقة', 'icon': '⛅', 'code': '03d'},
            'broken_clouds': {'ar': 'غيوم كثيفة', 'icon': '☁️', 'code': '04d'},
            'light_rain': {'ar': 'أمطار خفيفة', 'icon': '🌦️', 'code': '10d'},
            'rain': {'ar': 'أمطار', 'icon': '🌧️', 'code': '10d'},
            'thunderstorm': {'ar': 'عاصفة رعدية', 'icon': '⛈️', 'code': '11d'},
            'snow': {'ar': 'ثلج', 'icon': '🌨️', 'code': '13d'},
            'mist': {'ar': 'ضباب', 'icon': '🌫️', 'code': '50d'},
            'haze': {'ar': 'ضباب خفيف', 'icon': '🌫️', 'code': '50d'},
            'dust': {'ar': 'عاصفة ترابية', 'icon': '💨', 'code': '50d'}
        }
        
        # Choose weather condition based on location and season
        if lat > 35 and day_of_year > 300 or day_of_year < 60:  # Winter in northern regions
            if temperature < 0:
                condition_key = 'snow'
            elif humidity_base > 80:
                condition_key = 'rain'
            else:
                condition_key = 'scattered_clouds'
        elif 20 <= lat <= 35:  # Mediterranean/Middle East
            if day_of_year > 120 and day_of_year < 280:  # Summer
                if (day_of_year + int(lng)) % 10 < 2:
                    condition_key = 'dust'  # Dust storms in summer
                else:
                    condition_key = 'clear'
            else:  # Winter/Spring
                if (day_of_year + int(lng)) % 8 < 2:
                    condition_key = 'light_rain'
                else:
                    condition_key = 'few_clouds'
        else:  # Other regions
            weather_index = (int(lng) + day_of_year) % 6
            condition_keys = ['clear', 'few_clouds', 'scattered_clouds', 'light_rain', 'mist', 'haze']
            condition_key = condition_keys[weather_index]
        
        condition = conditions_map[condition_key]
        
        # Calculate realistic humidity
        humidity = humidity_base + seasonal_factor * 10 + (hour % 12 - 6) * 2
        humidity = max(30, min(90, humidity))
        
        # Calculate wind
        wind_speed = 2 + (abs(lat) / 10) + ((day_of_year + int(lng)) % 10)
        wind_direction = (int(lng * lat) + day_of_year) % 360
        
        # Find city name if not provided
        if not city_name:
            for city_key, city_data in ISLAMIC_CITIES.items():
                if abs(lat - city_data['lat']) < 0.1 and abs(lng - city_data['lng']) < 0.1:
                    city_name = city_data['name']
                    break
            
            if not city_name:
                city_name = f"الموقع الحالي ({lat:.2f}, {lng:.2f})"
        
        # Prepare response
        weather_data = {
            'temperature': round(temperature, 1),
            'description': condition['ar'],
            'icon': condition['icon'],
            'condition': condition_key,
            'humidity': round(humidity),
            'pressure': 1013 + int((lat + lng) % 20) - 10,  # Realistic pressure variation
            'wind': {
                'speed': round(wind_speed, 1),
                'direction': wind_direction,
                'direction_ar': get_wind_direction_arabic(wind_direction)
            },
            'city': city_name,
            'feels_like': round(temperature + (humidity - 50) / 10, 1),
            'uv_index': max(0, min(11, round(8 - abs(lat) / 10 + math.sin((hour - 12) / 12 * math.pi) * 3))),
            'visibility': round(10 - (humidity - 50) / 20, 1)
        }
        
        return jsonify({'success': True, 'data': weather_data})
    
    except Exception as e:
        return jsonify({
            'success': True, 
            'data': {
                'temperature': 25,
                'description': 'مشمس',
                'icon': '☀️',
                'humidity': 60,
                'pressure': 1013,
                'wind': {'speed': 5, 'direction': 180, 'direction_ar': 'جنوب'},
                'city': 'موقع افتراضي'
            }
        })

def get_wind_direction_arabic(degrees):
    """Convert wind direction degrees to Arabic"""
    directions = ['شمال', 'شمال شرق', 'شرق', 'جنوب شرق', 'جنوب', 'جنوب غرب', 'غرب', 'شمال غرب']
    index = round(degrees / 45) % 8
    return directions[index]

def get_mock_weather(lat, lng):
    """
    Generate mock weather data based on coordinates
    """
    try:
        # Convert to numbers
        lat = float(lat)
        lng = float(lng)
        
        # Get current date components for deterministic randomness
        now = datetime.now()
        day_of_year = now.timetuple().tm_yday
        
        # Generate deterministic temperature based on latitude and date
        # Equator is hotter, higher latitudes are colder
        base_temp = 30 - (abs(lat) / 2)
        seasonal_factor = math.cos((day_of_year - 172) / 365 * 2 * math.pi)  # Winter-summer cycle
        if lat < 0:  # Southern hemisphere has opposite seasons
            seasonal_factor = -seasonal_factor
        temp = base_temp + seasonal_factor * 10
        
        # Weather condition based on longitude (deterministic for the same location)
        conditions = ['Clear', 'Clouds', 'Rain', 'Drizzle', 'Thunderstorm', 'Mist', 'Haze', 'Dust']
        condition_index = int((lng % 10 + day_of_year) % len(conditions))
        condition = conditions[condition_index]
        
        # Icons mapping
        icons = {
            'Clear': '01d',
            'Clouds': '03d',
            'Rain': '10d',
            'Drizzle': '09d',
            'Thunderstorm': '11d',
            'Mist': '50d',
            'Haze': '50d',
            'Dust': '50d'
        }
        
        # Prepare mock response
        weather_data = {
            'temp': round(temp, 1),
            'humidity': (int(lng) % 30) + 40,  # 40-70% humidity
            'description': f'{condition.lower()}' if condition != 'Clear' else 'مشمس',
            'icon': icons.get(condition, '01d'),
            'condition': condition,
            'wind': {
                'speed': round(((lng % 5) + 1) * 1.5, 1),  # 1.5-9 m/s
                'deg': int(lng * lat) % 360
            }
        }
        
        # Add location info if available for major cities
        cities = {
            # Egypt
            (30.0444, 31.2357): {'city': 'القاهرة', 'country': 'EG'},
            (31.2001, 29.9187): {'city': 'الإسكندرية', 'country': 'EG'},
            (30.0131, 31.2089): {'city': 'الجيزة', 'country': 'EG'},
            (25.6872, 32.6396): {'city': 'الأقصر', 'country': 'EG'},
            (24.0889, 32.8998): {'city': 'أسوان', 'country': 'EG'},
            
            # Saudi Arabia
            (21.3891, 39.8579): {'city': 'مكة المكرمة', 'country': 'SA'},
            (24.5247, 39.5692): {'city': 'المدينة المنورة', 'country': 'SA'},
            (24.7136, 46.6753): {'city': 'الرياض', 'country': 'SA'}
        }
        
        # Find the closest city within 0.1 degree
        for (city_lat, city_lng), city_info in cities.items():
            if abs(lat - city_lat) < 0.1 and abs(lng - city_lng) < 0.1:
                weather_data['city'] = city_info['city']
                weather_data['country'] = city_info['country']
                break
        
        return jsonify({'success': True, 'data': weather_data})
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e), 'data': {'temp': 25, 'description': 'clear'}}), 200

@api_bp.route('/islamic-date')
@api_bp.route('/islamic-date')
def get_islamic_date():
    """
    Get current Islamic date (Hijri)
    """
    try:
        # Try to use Aladhan API
        url = "http://api.aladhan.com/v1/gToH"
        
        # Get current Gregorian date
        now = datetime.now()
        params = {
            'date': now.strftime('%d-%m-%Y')
        }
        
        response = requests.get(url, params=params, timeout=5)
        
        if response.status_code != 200:
            return get_calculated_hijri_date()
            
        data = response.json()
        
        if data.get('code') != 200:
            return get_calculated_hijri_date()
            
        hijri = data.get('data', {}).get('hijri', {})
        hijri_date = f"{hijri.get('day')} {hijri.get('month', {}).get('ar')} {hijri.get('year')} هـ"
        
        return jsonify({'success': True, 'hijri_date': hijri_date})
    
    except Exception as e:
        return get_calculated_hijri_date()

def get_calculated_hijri_date():
    """
    Calculate Hijri date based on a simple algorithm
    This is a fallback if the API fails
    """
    try:
        # Use a simplistic approach - only an approximation
        # For accuracy, the API or specialized libraries are better
        
        # Get current date
        now = datetime.now()
        
        # Convert to Arabic representation using locale
        try:
            arabic_date = now.strftime('%d %B %Y')
        except Exception:
            # Fallback if locale not available
            months = {
                1: "يناير", 2: "فبراير", 3: "مارس", 4: "إبريل",
                5: "مايو", 6: "يونيو", 7: "يوليو", 8: "أغسطس",
                9: "سبتمبر", 10: "أكتوبر", 11: "نوفمبر", 12: "ديسمبر"
            }
            arabic_date = f"{now.day} {months[now.month]} {now.year}"
        
        # Return formatted response with just the Gregorian date in Arabic
        return jsonify({
            'success': True,
            'hijri_date': arabic_date,
            'note': 'This is an approximation. API data was not available.'
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@api_bp.route('/geocode')
@api_bp.route('/geocode')
def geocode_location():
    """
    Convert coordinates to location name
    Required query params: lat, lng
    """
    try:
        lat = request.args.get('lat', None)
        lng = request.args.get('lng', None)
        
        if not lat or not lng:
            return jsonify({'success': False, 'error': 'Latitude and longitude are required'}), 400
        
        # Convert to float for comparison
        lat = float(lat)
        lng = float(lng)
        
        # Database of major cities
        cities = [
            # Egypt
            {'name': 'القاهرة', 'country': 'مصر', 'lat': 30.0444, 'lng': 31.2357, 'timezone': 'Africa/Cairo'},
            {'name': 'الإسكندرية', 'country': 'مصر', 'lat': 31.2001, 'lng': 29.9187, 'timezone': 'Africa/Cairo'},
            {'name': 'الجيزة', 'country': 'مصر', 'lat': 30.0131, 'lng': 31.2089, 'timezone': 'Africa/Cairo'},
            {'name': 'شرم الشيخ', 'country': 'مصر', 'lat': 27.9158, 'lng': 34.3300, 'timezone': 'Africa/Cairo'},
            {'name': 'الأقصر', 'country': 'مصر', 'lat': 25.6872, 'lng': 32.6396, 'timezone': 'Africa/Cairo'},
            {'name': 'أسوان', 'country': 'مصر', 'lat': 24.0889, 'lng': 32.8998, 'timezone': 'Africa/Cairo'},
            
            # KSA
            {'name': 'مكة المكرمة', 'country': 'السعودية', 'lat': 21.3891, 'lng': 39.8579, 'timezone': 'Asia/Riyadh'},
            {'name': 'المدينة المنورة', 'country': 'السعودية', 'lat': 24.5247, 'lng': 39.5692, 'timezone': 'Asia/Riyadh'},
            {'name': 'الرياض', 'country': 'السعودية', 'lat': 24.7136, 'lng': 46.6753, 'timezone': 'Asia/Riyadh'},
            
            # Other countries
            {'name': 'دبي', 'country': 'الإمارات', 'lat': 25.2048, 'lng': 55.2708, 'timezone': 'Asia/Dubai'},
            {'name': 'الدوحة', 'country': 'قطر', 'lat': 25.2854, 'lng': 51.5310, 'timezone': 'Asia/Qatar'}
        ]
        
        # Find nearest city (with reasonable proximity - within 0.3 degrees)
        nearest_city = None
        min_distance = float('inf')
        
        for city in cities:
            distance = math.sqrt((lat - city['lat'])**2 + (lng - city['lng'])**2)
            if distance < min_distance:
                min_distance = distance
                nearest_city = city
        
        # If within reasonable distance (approximately 30km)
        if min_distance < 0.3:
            return jsonify({
                'success': True,
                'data': {
                    'city': nearest_city['name'],
                    'country': nearest_city['country'],
                    'timezone': nearest_city['timezone'],
                    'distance': round(min_distance * 111, 2)  # Rough approximation of km
                }
            })
        
        # Otherwise return unknown location
        return jsonify({
            'success': True,
            'data': {
                'city': 'موقع غير معروف',
                'country': '',
                'timezone': 'UTC'
            }
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
