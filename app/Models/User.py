from mongoengine import Document
from mongoengine import DateTimeField, StringField, ReferenceField, ListField, BooleanField, IntField, DecimalField, EmbeddedDocumentField
from flask_security import UserMixin, RoleMixin
from app.Models.Patient import Adresse
from app.utils import _valide_email, _valide_telephone

class Collaborateur(Document):
    user = ReferenceField('User')
    retrocession = DecimalField(min_value=0, max_value=100, precision=2)

class Cabinet(Document):
    nomCabinet = StringField(max_length=100, required=True, unique=True)
    titulaires = ListField(ReferenceField('User'), required=True)
    collaborateurs = ListField(ReferenceField('Collaborateur'))
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

