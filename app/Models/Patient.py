from enum import Enum
from mongoengine import Document
from mongoengine import DateTimeField, StringField, ReferenceField, EmbeddedDocumentListField, EmailField, EmbeddedDocument, EmbeddedDocumentField, EnumField
from app.utils import _valide_codePostal, _valide_email, _valide_telephone

class LienParente(Enum):
    MERE = 'Mère'
    PERE = 'Père'
    TUTEUR = 'Tuteur'
    AUTRE = 'Autre'

class Genre(Enum):
    MASCULIN = "Monsieur"
    FEMININ = "Madame"

class Adresse(EmbeddedDocument):
    ligne1 = StringField(required=True)
    ligne2 = StringField
    ligne3 = StringField
    codePostal = StringField(required=True, validation= _valide_codePostal)
    ville = StringField(required=True)


# Model Parent
class Parent(EmbeddedDocument):
    genre = EnumField(Genre)
    nom = StringField(required=True)
    prenom = StringField(required=True)
    dateDeNaissance = DateTimeField(required=True)
    lieuDeNaissance = StringField(required=True)
    telephone = StringField(min_length=10, max_length=10, required=True, validation=_valide_telephone)
    email = EmailField(required=True, validation=_valide_email)
    adresse = EmbeddedDocumentField(Adresse)
    lienParente = EnumField(LienParente)
      
# Model Patient
class Patient(Document):
    genre = EnumField(Genre)
    nom = StringField(required=True, max_length=60)
    prenom = StringField(required=True, max_length=60)
    dateDeNaissance = DateTimeField(required=True)
    telephone = StringField(max_length=10, validation=_valide_telephone)
    parents = EmbeddedDocumentListField(Parent, required=True)
    nomFacturation = StringField(required=True)
    adresseFacturation = EmbeddedDocumentField(Adresse, required=True)
    collaborateur = ReferenceField('Collaborateur')