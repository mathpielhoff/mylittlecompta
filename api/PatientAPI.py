from flask import session
from flask_restful import reqparse, Resource
from flask_security import login_required
from flask_login import current_user
from app.models import Patient, Contact, User

parser = reqparse.RequestParser()

# Main parser, do not overwrite please use copy
parser.add_argument('nom', location='json')
parser.add_argument('prenom', location='json')
parser.add_argument('dateDeNaissance', location='json')
parser.add_argument('telephone', location='json')
parser.add_argument('contacts', location='json')
parser.add_argument('adresseFacturation', location='json')
parser.add_argument('therapeute', location='json')
parser.add_argument('id', location='args')

class PatientAPI(Resource):
    @login_required
    def get(self):
        parser_copy = parser.copy()
        req = parser_copy.parse_args()
        try:
            if not req.get('id') is None:
                qs = Patient.objects(
                    therapeute=User.objects(username=current_user.username).only('id').first(), 
                    id=req.get('id')
                    )
                return qs.to_json(), 200
            qs = Patient.objects(
                therapeute=User.objects(username=current_user.username).only('id').first()
                )
            return qs.all_fields().to_json(), 200
        except Exception as err:
            return {'message': err.args }, 400

    @login_required
    def put(self):
        parser_copy = parser.copy()
        parser_copy.replace_argument('id', required=True, location='args')
        req = parser_copy.parse_args()
        try:
            modif_patient = Patient.objects(
                therapeute=User.objects(username=current_user.username).only('id').first(), 
                id=req.get('id')
                )
            if not req.get('nom') is None:
                modif_patient.update(nom=req.get('nom'))
            if not req.get('prenom') is None:
                modif_patient.update(prenom=req.get('prenom'))
            if not req.get('dateDeNaissance') is None:
                modif_patient.update(dateDeNaissance=req.get('dateDeNaissance'))
            if not req.get('telephone') is None:
                modif_patient.update(telephone=req.get('telephone'))
            if not req.get('adresseFacturation') is None:
                modif_patient.update(adresseFacturation=req.get('adresseFacturation'))      
            modif_patient.save()       
            return {'message':'Patient modifié'}, 200
        except Exception as err:
            return {'message': err.args }, 400
    
    @login_required
    def post(self):
            parser_copy = parser.copy()
            parser_copy.replace_argument('nom', location='json', required=True)
            parser_copy.replace_argument('prenom', location='json', required=True)
            parser_copy.replace_argument('dateDeNaissance', location='json', required=True)
            parser_copy.replace_argument('telephone', location='json', required=True)
            parser_copy.replace_argument('adresseFacturation', location='json', required=True)
            parser_copy.replace_argument('id', location='args')
            req = parser_copy.parse_args()
            
            new_patient = Patient(
                nom=req.get('nom'), 
                prenom=req.get('prenom'),
                dateDeNaissance=req.get('dateDeNaissance'), 
                telephone=req.get('telephone'), 
                adresseFacturation=req.get('adresseFacturation'),
                therapeute=User.objects(username=current_user.username).only('id').first()
            )
            try:
                new_patient.validate()
                new_patient.save()
                return {'message':'Patient créé'}, 200
            except Exception as err:
                return {'message': err.args }, 400
        



class PatientContactsAPI(Resource):
    @login_required
    def post(self):
        parser_copy = parser.copy()
        parser_copy.replace_argument('id', required=True, location='args')
        parser_copy.replace_argument('contacts', required=True, action=append, location='json')
        
        req = parser_copy.parse_args()
        list_contacts = Contact.objects()
        for id in req.get('contacts'):
            list_contacts.append(Contact.objects().with_id(id=id))



    