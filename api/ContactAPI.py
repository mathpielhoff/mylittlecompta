from flask_restful import reqparse, Resource
from flask_security import login_required

from app.models import Contact

parser = reqparse.RequestParser()

# Main parser, do not overwrite please use copy
parser.add_argument('nom', location='json')
parser.add_argument('prenom', location='json')
parser.add_argument('telephone', location='json')
parser.add_argument('email', location='json')
parser.add_argument('adresse', location='json')
parser.add_argument('id', location='args')


class ContactAPI(Resource):
    @login_required
    def get(self):
        parser_copy = parser.copy()
        req = parser_copy.parse_args()
        try:
            if not req.get('id') is None:
                qs = Contact.objects().with_id(req.get('id'))
                return qs.to_json(), 200
            qs = Contact.objects
            return qs.all_fields().to_json(), 200
        except Exception as err:
            return {'message': err.args }, 400
    
    @login_required
    def put(self):
        parser_copy = parser.copy()
        parser_copy.replace_argument('id', required=True, location='args')
        req = parser_copy.parse_args()
        try:
            modif_contact = Contact.objects().with_id(req.get('id'))   
            if not req.get('nom') is None:
                modif_contact.update(nom=req.get('nom'))
            if not req.get('prenom') is None:
                modif_contact.update(prenom=req.get('prenom'))
            if not req.get('telephone') is None:
                modif_contact.update(telephone=req.get('telephone'))
            if not req.get('email') is None:
                modif_contact.update(email=req.get('email'))
            if not req.get('adresse') is None:
                modif_contact.update(adresse=req.get('adresse'))
            modif_contact.save()       
            return {'message':'Contact modifié'}, 200
        except Exception as err:
            return {'message': err.args }, 400

    @login_required
    def post(self):
        parser_copy = parser.copy()
        parser_copy.replace_argument('nom', location='json', required=True)
        parser_copy.replace_argument('prenom', location='json', required=True)
        parser_copy.replace_argument('telephone', location='json', required=True)
        parser_copy.replace_argument('email', location='json', required=True)
        parser_copy.replace_argument('adresse', location='json', required=True)
        parser_copy.replace_argument('id', location='args')
        req = parser_copy.parse_args()
        
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
        except Exception as err:
             return {'message': err.args }, 400
        