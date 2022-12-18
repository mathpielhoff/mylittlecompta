from xml.dom import ValidationErr
from flask_restful import reqparse, abort, Api, Resource
from flask import current_app
from flask_security import auth_required, login_required

from app.models import Contact

parser = reqparse.RequestParser()
parser.add_argument('nom', location='json', required=True)
parser.add_argument('prenom', location='json', required=True)
parser.add_argument('telephone', location='json', required=True)
parser.add_argument('email', location='json', required=True)
parser.add_argument('adresse', location='json', required=True)

parser.add_argument('id', location='args')


class ContactAPI(Resource):
    @auth_required('token','session')
    def get(self):
        req = parser.parse_args()
        if not req.get('id') is None:
            qs = Contact.objects().with_id(req.get('id'))
            return qs.to_json(), 200
        qs = Contact.objects
        return qs.all_fields().to_json(), 200
    
    @auth_required('token','session')
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
        