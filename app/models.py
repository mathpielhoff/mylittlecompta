from tkinter import CASCADE
from mongoengine import Document
from mongoengine import DateTimeField, StringField, ReferenceField, ListField, EmailField, BooleanField, IntField
from flask_security import UserMixin, RoleMixin

"""

Define you MongoEngine Models here

"""
# Model Role
class Role(Document, RoleMixin):
    name = StringField(max_length=80, unique=True)
    description = StringField(max_length=255)
    permissions = StringField(max_length=255)

# Model User
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
    telephone = StringField(min_length=10, max_length=10, required=True)
    email = EmailField(required=True)
    
    def validate(self, clean=True):
        return super().validate(clean)
        
    def __unicode__(self):
        return self.nom + ' ' +self.prenom

    def __repr__(self):
        return self.nom + ' ' + self.prenom

    def __str__(self):
        return self.nom + ' ' + self.prenom

        
# Model Patient
class Patient(Document):
    nom = StringField(required=True, max_length=60)
    prenom = StringField(required=True, max_length=60)
    dateDeNaissance = DateTimeField(required=True)
    telephone = StringField(required=True, max_length=10)
    contacts = ListField(ReferenceField('Contact'))
    adresseFacturation = StringField(required=True, max_length=100)
    therapeute = ReferenceField('User')

# Model Prestation
class Prestation(Document):
    patient = ReferenceField('Patient', required=True)
    therapeute = ReferenceField('User', required=True)
    date = DateTimeField(required=True)
    lieu = StringField(required=True, min_length=10, max_length=100)
