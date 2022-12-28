import logging
from flask import Flask
from flask_mongoengine import MongoEngine
from flask_security import Security, MongoEngineUserDatastore
from flask_restful import Api
from flask_wtf.csrf import CSRFProtect
from api.ContactAPI import ContactAPI

# Custom imports
from app.models import User, Role

"""
 Logging configuration
"""
logging.basicConfig(format='%(asctime)s:%(levelname)s:%(name)s:%(message)s')
logging.getLogger().setLevel(logging.DEBUG)

app = Flask(__name__)
app.config.from_object('config')

# Adding RestFull
api = Api(app)
api.add_resource(ContactAPI, '/api/contact')
api.add_resource(PatientAPI, '/api/patient')

# Adding Mongo
db = MongoEngine(app)

# Adding security
csrf = CSRFProtect(app)
autocorrect_location_header = False


user_datastore = MongoEngineUserDatastore(db, User, Role)
app.security = Security(app, user_datastore)
