import pytest
import sys
import os

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from app import app, init_db

@pytest.fixture
def client():
    """Create a test client for the Flask application."""
    app.config['TESTING'] = True
    app.config['SECRET_KEY'] = 'test-secret-key'
    
    with app.test_client() as client:
        with app.app_context():
            init_db()
        yield client

def test_home_page(client):
    """Test the home page loads correctly."""
    response = client.get('/')
    assert response.status_code == 200
    assert b'Islamic' in response.data or b'phrase' in response.data

def test_health_endpoint(client):
    """Test the health check endpoint."""
    response = client.get('/health')
    assert response.status_code == 200
    data = response.get_json()
    assert data['status'] == 'healthy'

def test_login_page(client):
    """Test the login page loads correctly."""
    response = client.get('/login')
    assert response.status_code == 200

def test_signup_page(client):
    """Test the signup page loads correctly."""
    response = client.get('/signup')
    assert response.status_code == 200

def test_quran_page(client):
    """Test the Quran page loads correctly."""
    response = client.get('/quran')
    assert response.status_code == 200

def test_quran_api_endpoints(client):
    """Test Quran API endpoints."""
    # Test reciters endpoint
    response = client.get('/api/quran/reciters')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) > 0
    
    # Test surahs endpoint
    response = client.get('/api/quran/surahs')
    assert response.status_code == 200
    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) >= 3  # At least the surahs we defined

def test_audio_url_endpoint(client):
    """Test audio URL generation."""
    response = client.get('/api/quran/audio/mishary_rashid_alafasy/1')
    assert response.status_code == 200
    data = response.get_json()
    assert 'primary_url' in data
    assert 'audio_urls' in data

def test_search_endpoint(client):
    """Test Quran search functionality."""
    response = client.get('/api/quran/search?q=الله')
    assert response.status_code == 200
    data = response.get_json()
    assert 'results' in data

if __name__ == '__main__':
    pytest.main([__file__])