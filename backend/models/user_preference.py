from database import db
from datetime import datetime

class UserPreference(db.Model):
    __tablename__ = 'user_preferences'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    theme = db.Column(db.String(20), default='light')
    daily_goal = db.Column(db.Integer, default=100)
    sound_enabled = db.Column(db.Boolean, default=True)
    prayer_notifications = db.Column(db.JSON, default=dict)
    language_preference = db.Column(db.String(10), default='ar')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'theme': self.theme,
            'daily_goal': self.daily_goal,
            'sound_enabled': self.sound_enabled,
            'prayer_notifications': self.prayer_notifications,
            'language_preference': self.language_preference,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    def __repr__(self):
        return f'<UserPreference theme:{self.theme}, goal:{self.daily_goal}>'
