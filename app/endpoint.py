from flask_restful import reqparse, abort, Api, Resource
from flask import current_app
from flask_security import hash_password, login_required


parser = reqparse.RequestParser()
parser.add_argument('nom', location='json')
parser.add_argument('prenom', location='json')
parser.add_argument('telephone', location='json')
parser.add_argument('email', location='json')

class ContactAPI(Resource):
    @login_required
    def post(self):
        current_app.logger.debug('debug - Creation contact')
        new_contact = parser.parse_args()
        return new_contact