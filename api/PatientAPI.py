from argparse import _AppendAction
import logging
from xml.dom import ValidationErr
from flask_restful import reqparse, Resource
from flask_security import login_required
from flask_login import current_user
from app.Models.Patient import Parent, Patient
from app.Models.User import User

parser = reqparse.RequestParser()

# Main parser, do not overwrite please use copy
parser.add_argument('genre', choices=('MASCULIN','FEMININ'), location='json')
parser.add_argument('lienParente', choices=('MERE','PERE', 'TUTEUR', 'AUTRE'), location='json')
parser.add_argument('adresse', type=dict, location='json')
parser.add_argument('parent', type=dict, location='json')
parser.add_argument('nom', location='json')
parser.add_argument('prenom', location='json')
parser.add_argument('dateDeNaissance', location='json')
parser.add_argument('telephone', location='json')
parser.add_argument('nomFacturation', location='json')
parser.add_argument('adresse', type=dict, location='json')
parser.add_argument('adresseFacturation', location='json')
parser.add_argument('id', location='args')



class PatientAPI(Resource):
    @login_required
    def get(self):
        parser_copy = parser.copy()
        req = parser_copy.parse_args()
        try:
            if not req.get('id') is None:
                qs = Patient.objects(
                    collaborateur=User.objects(username=current_user.username).only('id').first(), 
                    id=req.get('id')
                    )
                return qs.to_json(), 200
            qs = Patient.objects(
                collaborateur=User.objects(username=current_user.username).only('id').first()
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
                ).first()
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
            parser_copy.add_argument('genre', choices=('MASCULIN','FEMININ'), required=True, location='json')
            parser_copy.add_argument('adresse', type=dict, required=True, location='json')
            parser_copy.add_argument('parent', type=dict, required=True, location='json')
            parser_copy.add_argument('nom', required=True, location='json')
            parser_copy.add_argument('prenom', required=True, location='json')
            parser_copy.add_argument('dateDeNaissance', required=True, location='json')
            parser_copy.add_argument('telephone', required=True, location='json')
            parser_copy.add_argument('nomFacturation', required=True, location='json')
            parser_copy.add_argument('adresseFacturation', required=True, location='json')
            req = parser_copy.parse_args()
            
            #building parents
            logging.debug("Build parents : starting")
            parents = req.get('parents')
            new_patient = Patient()
            for parent in parents:
                new_patient.parents.append(Parent(
                    genre=parent.genre,
                    nom = parent.nom,
                    prenom = parent.prenom,
                    dateDeNaissance = parent.dateDeNaissance,
                    lieuDeNaissance = parent.lieuDeNaissance,
                    telephone = parent.telephone,
                    email = parent.email,
                    lienParente = parent.lienParente,
                ))

            new_patient = Patient(
                genre=req.get('genre'), 
                lienParente=req.get('lienParente'),
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
        


    