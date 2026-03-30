# * Imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

# * App
app = Flask(__name__)  # Main Flask app

# * Config
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"  # Local DB file
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False        # Disable extra tracking
app.config["SECRET_KEY"] = "dev-secret-key"
app.json.compact = False  # Pretty Print JSON in dev

# * Database
metadata = MetaData(naming_convention={
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
})
db = SQLAlchemy(metadata=metadata)
db.init_app(app)

# * Migrations
migrate = Migrate(app, db)

# * CORS (allow frontend requests)
CORS(app)