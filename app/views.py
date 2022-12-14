from flask import render_template
from app.models import Parent
from flask_appbuilder import ModelView
from flask_appbuilder.models.mongoengine.interface import MongoEngineInterface
from app import appbuilder

"""
    Define you Views here
"""
class ParentModelView(ModelView):
    datamodel = MongoEngineInterface(Parent)
    list_columns = ['nom', 'prenom', 'telephone', 'email']
    show_fieldsets = [
        ('Summary',{'fields':['nom','prenom','telephone','email']})]

appbuilder.add_view(ParentModelView, "List Parents",icon = "fa-folder-open-o",category = "Contacts",
                category_icon = "fa-envelope")

"""
    Application wide 404 error handler
"""
@appbuilder.app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', base_template=appbuilder.base_template, appbuilder=appbuilder), 404

