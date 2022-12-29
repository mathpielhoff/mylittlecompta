import re
from xml.dom import ValidationErr

PHONE_REGEX = '^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$'
MAIL_REGEX = '([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+'
CP_REGEX = '^([0-9]{5})$'

def _valide_telephone(telephone):
    if re.match(PHONE_REGEX, telephone) is None:
        raise ValidationErr('Le telephone ne respecte pas le bon format')

def _valide_email(email):
    if re.match(MAIL_REGEX, email) is None:
        raise ValidationErr('L email ne respecte pas le bon format')

def _valide_codePostal(codePostal):
    if re.match(CP_REGEX, codePostal) is None:
        raise ValidationErr('Le codePostal ne respecte pas le bon format')
