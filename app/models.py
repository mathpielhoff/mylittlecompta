from tkinter import CASCADE
from xml.dom import ValidationErr
from mongoengine import Document
from mongoengine import DateTimeField, StringField, ReferenceField, ListField, EmailField, BooleanField, IntField
from flask_security import UserMixin, RoleMixin
import re
"""

Define you MongoEngine Models here

"""
PHONE_REGEX = '^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$'
MAIL_REGEX = '([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+'

def _valide_telephone(telephone):
    if re.match(PHONE_REGEX, telephone) is None:
        raise ValidationErr('Le telephone ne respecte pas le bon format')

def _valide_email(email):
    if re.match(MAIL_REGEX, email) is None:
        raise ValidationErr('L email ne respecte pas le bon format')
    
# Model Role
class Role(Document, RoleMixin):
    name = StringField(max_length=80, unique=True)
    description = StringField(max_length=255)
    permissions = StringField(max_length=255)

# Model User
# Api from flask-security /api/accounts/login
class User(Document, UserMixin):
    username = StringField(max_length=255, unique=True)
    email = StringField(max_length=255, unique=True)
    password = StringField(max_length=255)
    active = BooleanField(default=True)
    fs_uniquifier = StringField(max_length=64, unique=True)
    confirmed_at = DateTimeField()
    last_login_at = DateTimeField()
    current_login_at = DateTimeField()
    last_login_ipStringField = StringField (max_length=255)
    current_login_ip = StringField (max_length=255)
    login_count = IntField()
    roles = ListField(ReferenceField(Role), default=[])

# Model Contact
class Contact(Document):
    nom = StringField(required=True)
    prenom = StringField(required=True)
    telephone = StringField(min_length=10, max_length=10, required=True, validation=_valide_telephone)
    email = EmailField(required=True, validation=_valide_email)
    adresse = StringField(required=True)
      
# Model Patient
class Patient(Document):
    nom = StringField(required=True, max_length=60)
    prenom = StringField(required=True, max_length=60)
    dateDeNaissance = DateTimeField(required=True)
    telephone = StringField(required=True, max_length=10, validation=_valide_telephone)
    contacts = ListField(ReferenceField('Contact'))
    adresseFacturation = StringField(required=True, max_length=250)
    therapeute = ReferenceField('User')

# Model Prestation
class Prestation(Document):
    patient = ReferenceField('Patient', required=True)
    therapeute = ReferenceField('User', required=True)
    date = DateTimeField(required=True)
    lieu = StringField(required=True, min_length=10, max_length=100)
