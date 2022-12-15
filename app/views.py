from flask import render_template, g
from app.models import Contact, Patient
from flask_appbuilder import ModelView
from flask_appbuilder.models.mongoengine.interface import MongoEngineInterface
from flask_appbuilder.models.mongoengine.filters import FilterStartsWith, FilterEqualFunction

from app import appbuilder

"""
    Define you Views here
"""

# get Current User
def get_user():
    return g.user

# View Contact
class ContactModelView(ModelView):
    datamodel = MongoEngineInterface(Contact)
    list_columns = ['nom', 'prenom', 'telephone', 'email']
    show_fieldsets = [
        ('Summary',{'fields':['nom','prenom','telephone','email']})]

# View Patient
class PatientModelView(ModelView):
    datamodel = MongoEngineInterface(Patient)
    list_columns = ['nom', 'prenom', 'dateDeNaissance', 'contacts']
    show_fieldsets = [
        ('Summary',{'fields':['nom', 'prenom', 'dateDeNaissance', 'contacts']})]

# Adding to Menu
appbuilder.add_view(PatientModelView, "Liste des Patients",icon = "fa-folder-open-o",category = "Patients",
                category_icon = "fa-envelope")

appbuilder.add_view(ContactModelView, "Liste des Contacts",icon = "fa-folder-open-o",category = "Patients",
                category_icon = "fa-envelope")

"""
    Application wide 404 error handler
"""
@appbuilder.app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', base_template=appbuilder.base_template, appbuilder=appbuilder), 404

