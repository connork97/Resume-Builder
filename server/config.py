# * Library Imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

#  * Local Imports
# from models import *

# * App
app = Flask(__name__)  # Main Flask app

# * Config
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"  # Local DB file
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # Disable extra tracking
app.config["SECRET_KEY"] = "my-secret-key"
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.json.compact = False  # Pretty Print JSON in dev

# * Database
metadata = MetaData(
    naming_convention={
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    }
)
db = SQLAlchemy(metadata=metadata)
db.init_app(app)

# * Migrations
migrate = Migrate(app, db)

# * CORS (allow frontend requests)
CORS(
    app,
    supports_credentials=True,
    origins=["http://localhost:5173"]
)


# ! Note to self, these are the terminal commands to create initial and followup migrations:
#  ! FIRST TIME SETTING UP MIGRATIONS FOLDER COMMANDS:
#  export FLASK_APP=app.py (if running into errors for next commands)
#  flask db init (for INITIAL CREATION/SETUP OF MIGRATIONS FOLDER ONLY)
# ! SUBSEQUENT MIGRATION COMMANDS (both during AND after initial setup):
#  flask db migrate -m "migration message here" (for creating a new migration)
#  flask db upgrade (to apply the latest migration to the database)

# ! Other Commands:
#  flask db history (to view migration history)
#  flask db current (to view current migration applied to the database)
#  flask db show <migration_id> (to view details of a specific migration)
#  flask db downgrade (to revert the latest migration, can specify a specific migration ID to revert to as well)
#  flask db stamp head (to mark the current state of the database as up-to-date with the latest migration without actually applying it, useful for syncing after manual changes or resolving conflicts)
#  flask db revision --autogenerate -m "migration message here" (to create a new migration by automatically detecting changes in the models, can be used instead of flask db migrate for convenience, but always review the generated migration code to ensure it accurately reflects the intended changes)
#  flask db merge -m "merge message here" <migration_id1> <migration_id2> (to merge two divergent migration branches into a single migration, useful for resolving conflicts when multiple developers are working on migrations simultaneously, this will create a new migration that combines the changes from both specified migrations, review the generated code to ensure it correctly merges the changes)
#  flask db revision --autogenerate -m "migration message here" --head <migration_id> (to create a new migration that branches off from a specific migration, useful for creating a new line of development without affecting the main migration history, this will create a new migration that is based on the specified migration ID, review the generated code to ensure it correctly reflects the intended changes)
