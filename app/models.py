from tkinter import CASCADE
from mongoengine import Document
from mongoengine import DateTimeField, StringField, ReferenceField, ListField, EmailField

"""

Define you MongoEngine Models here

"""
# Model Contact
class Contact(Document):
    nom = StringField(required=True)
    prenom = StringField(required=True)
    telephone = StringField(min_length=10, max_length=10, required=True)
    email = EmailField(required=True)
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
