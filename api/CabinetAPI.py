import logging
import json
from xml.dom import ValidationErr
from flask_restful import reqparse, Resource
from flask_security import login_required, roles_accepted
from app.Models.Patient import Adresse
from flask_login import current_user

from app.Models.User import Collaborateur, Cabinet, User

parser = reqparse.RequestParser()

# Main parser, do not overwrite please use copy
parser.add_argument('nomCabinet', location='json')
parser.add_argument('collaborateurs', type=list, location='json')
parser.add_argument('titulaires', type=list, location='json')
parser.add_argument('adresse', type=dict, location='json')
parser.add_argument('id', location='args')




class CabinetAPI(Resource):
    @login_required
    #@roles_accepted('Admin')
    def post(self):
        logging.debug(" -- starting creation cabinet --")
        logging.debug("req parsing : start")
        parser_copy = parser.copy()
        parser_copy.replace_argument('nomCabinet', required=True, location='json')
        parser_copy.replace_argument('titulaires', required=True, type=list, location='json')
        parser_copy.replace_argument('collaborateurs', type=list, location='json')
        parser_copy.replace_argument('adresse', required=True, type=dict, location='json')
        req = parser_copy.parse_args()
        logging.debug("req parsing : ok")
        titulaires = req.get('titulaires')
        adresse = req.get('adresse')
        collaborateurs = req.get('collaborateurs')
        new_cabinet = Cabinet(nomCabinet=req.get("nomCabinet"))
        try:
            #starting to build titulaires
            logging.debug("Build titulaires : starting")
            for titulaire in titulaires:
                if titulaire.get("username") is None:
                    raise ValidationErr("Username not found")
                new_titulaire=User.objects(username=titulaire["username"]).only('id').first()
                if new_titulaire is None:
                    raise ValidationErr("User not found")
                new_cabinet.titulaires.append(new_titulaire)
            #new_cabinet.nomCabinet = req.get('nomCabinet')
            logging.debug("Build titulaires : ok")
            #starting to build adresse
            logging.debug("Build adresse : starting")
            if adresse.get("ligne1") is None or adresse.get("codePostal") is None or adresse.get("ville") is None:
                raise ValidationErr("Ligne1, codePostal or ville not found")
            new_adresse=Adresse(
                ligne1=adresse.get("ligne1"),
                codePostal=adresse.get("codePostal"),
                ville=adresse.get("ville"))
            if not adresse.get("ligne2") is None:
                new_adresse.ligne2 = adresse.get("ligne2")
            if not adresse.get("ligne3") is None:
                new_adresse.ligne3 = adresse.get("ligne3")
            new_cabinet.adresse = new_adresse
            logging.debug("Build adresse : ok")
            logging.debug("validation cabinet : starting")
            new_cabinet.validate()
            logging.debug("validation cabinet : ok")
            #starting to build collaborateurs
            logging.debug("Build collaborateurs : starting")
            if not collaborateurs is None:
                for collaborateur in collaborateurs:
                    if collaborateur.get("username") is None or collaborateur.get("retrocession") is None:
                        raise ValidationErr("Username or retrocession not found")
                    new_collaborateur = Collaborateur(user=User.objects(
                        username=collaborateur["username"]).only('id').first(), 
                        retrocession=collaborateur["retrocession"]
                    )
                    new_cabinet.collaborateurs.append(new_collaborateur)
            logging.debug("Build collaborateurs : ok")
            new_cabinet.save()
            logging.debug(" -- end creation cabinet --")
            return {'message': "cabinet créé"}
        except Exception as err:
            logging.error(err.args)
            return {'message': err.args }, 400

    @login_required
    def get(self):
        logging.debug(" -- starting get cabinet --")
        try:
            req = parser.parse_args()
            if req.get("id") is None:
                qs = Cabinet.objects(collaborateurs__user=current_user.id)
                return json.loads(qs.to_json())
            qs = Cabinet.objects(collaborateurs__user=current_user.id, id=req.get("id"))
            return json.loads(qs.to_json())           
            logging.debug(" -- ending get cabinet --")
        except Exception as err:
            logging.error(err.args)
            return {'message': err.args }, 400
    
    @login_required
    def put(self):
        logging.debug(" -- starting put cabinet -- ")
        logging.debug("req parsing : start")
        parser_copy = parser.copy()
        parser_copy.replace_argument('id', required=True, location='args')
        req = parser_copy.parse_args()
        try:
            update_cab = Cabinet.objects(collaborateurs__user=current_user.id, id=req.get("id")).first()
            if update_cab is None:
                raise ValidationErr("cabinet not found")
            if not req.get('nomCabinet') is None:
                update_cab.nomCabinet = req.get('nomCabinet')
            if not req.get('adresse') is None:
                adresse = req.get('adresse')
                if not adresse.get("ligne1") is None:
                    update_cab.adresse.ligne1 = adresse.get("ligne1")
                if not adresse.get("ligne2") is None:
                    update_cab.adresse.ligne2 = adresse.get("ligne2")
                if not adresse.get("ligne3") is None:
                    update_cab.adresse.ligne3 = adresse.get("ligne3")
                if not adresse.get("codePostal") is None:
                    update_cab.adresse.codePostal = adresse.get("codePostal")
                if not adresse.get("ville") is None:
                    update_cab.adresse.ville = adresse.get("ville")
                update_cab.save()
                logging.debug(" -- endding put cabinet -- ")
            return json.loads(update_cab.to_json())
        except Exception as err:
            logging.error(err.args)
            return {'message': err.args }, 400

class CollaborateursAPI(Resource):
    @login_required
    def get(self, id):
        logging.debug(" -- starting get cabinet collaborateurs --")
        req = parser.parse_args()
        try:
            qs = Cabinet.objects(id=id, collaborateurs__oid=req.get("id"))
            logging.debug(" -- ending get cabinet --")
            return json.loads(qs.first().collaborateurs.get(oid=req.get("id")).to_json())
        except Exception as err:
            logging.error(err.args)
            return {'message': err.args }, 400
    