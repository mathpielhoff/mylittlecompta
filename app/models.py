from mongoengine import Document
from mongoengine import DateTimeField, StringField, ReferenceField, ListField, EmailField

"""

Define you MongoEngine Models here

"""

class Parent(Document):
    nom = StringField(required=True)
    prenom = StringField(required=True)
    telephone = StringField(min_length=10, max_length=10, required=True)
    email = EmailField(regex=())

    def __unicode__(self):
        return self.name

    def __repr__(self):
        return self.name