from xml.dom import ValidationErr
from flask_restful import reqparse, abort, Api, Resource
from flask import current_app
from flask_security import hash_password, login_required

from app.models import Contact

parser = reqparse.RequestParser()
parser.add_argument('nom', location='json', required=True)
parser.add_argument('prenom', location='json', required=True)
parser.add_argument('telephone', location='json', required=True)
parser.add_argument('email', location='json', required=True)
parser.add_argument('adresse', location='json', required=True)


class ContactAPI(Resource):
    @login_required
    def get(self):
        
        return 200
    @login_required
    def post(self):
        req = parser.parse_args()
        new_contact = Contact(
            nom=req.get('nom'), 
            prenom=req.get('prenom'),
            telephone=req.get('telephone'), 
            adresse=req.get('adresse'), 
            email=req.get('email')
        )
        try:
            new_contact.validate()
            new_contact.save()
            return {'message':'Contact créé'}, 200
        except ValidationErr as err:
             return {'message': err.args }, 400
        