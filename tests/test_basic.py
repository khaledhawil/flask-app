import sys
import os

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

def test_app_import():
    """Test that the Flask app can be imported successfully."""
    try:
        from app import app
        assert app is not None
        print("✅ Flask app imports successfully")
        return True
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_basic_config():
    """Test basic app configuration."""
    try:
        from app import app
        assert app.config is not None
        print("✅ App configuration is valid")
        return True
    except Exception as e:
        print(f"❌ Configuration error: {e}")
        return False

if __name__ == '__main__':
    import_success = test_app_import()
    config_success = test_basic_config()
    
    if import_success and config_success:
        print("✅ All basic tests passed")
        sys.exit(0)
    else:
        print("❌ Some tests failed")
        sys.exit(1)
