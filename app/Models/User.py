from datetime import datetime
from mongoengine import Document, DateTimeField, StringField, ObjectIdField, ReferenceField, EmbeddedDocument, ListField, BooleanField, IntField, DecimalField, EmbeddedDocumentField, EmbeddedDocumentListField
from flask_security import UserMixin, RoleMixin
from app.Models.Patient import Adresse
from app.utils import _valide_email, _valide_telephone
from bson.objectid import ObjectId

class Collaborateur(EmbeddedDocument):
    oid = ObjectIdField(required=True, default=ObjectId,
                    unique=True, primary_key=True)
    user = ReferenceField('User')
    retrocession = DecimalField(min_value=0, max_value=100, precision=2)
    actif = BooleanField(default=True)
    dateDebutContrat = DateTimeField()
    dateFinContrat = DateTimeField()
    dateDeCreation = DateTimeField(default=datetime.utcnow)
    derniereDateMiseAJour = DateTimeField(default=datetime.utcnow)

class Cabinet(Document):
    nomCabinet = StringField(max_length=100, required=True, unique=True)
    titulaires = ListField(ReferenceField('User'), required=True)
    collaborateurs = EmbeddedDocumentListField('Collaborateur')
    adresse = EmbeddedDocumentField(Adresse, required=True)


# Model Role
class Role(Document, RoleMixin):
    name = StringField(max_length=80, unique=True)
    description = StringField(max_length=255)
    permissions = StringField(max_length=255)
    
# Model User
# Api from flask-security /api/accounts/login
class User(Document, UserMixin):
    username = StringField(max_length=255, unique=True)
    email = StringField(max_length=255, unique=True, validation=_valide_email)
    password = StringField(max_length=255)
    phone = StringField(min_length=10, max_length=10, validation=_valide_telephone)
    active = BooleanField(default=True)
    fs_uniquifier = StringField(max_length=64, unique=True)
    confirmed_at = DateTimeField()
    last_login_at = DateTimeField()
    current_login_at = DateTimeField()
    last_login_ipStringField = StringField (max_length=255)
    current_login_ip = StringField (max_length=255)
    login_count = IntField()
    roles = ListField(ReferenceField(Role), default=[])

