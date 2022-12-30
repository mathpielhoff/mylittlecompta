import os
basedir = os.path.abspath(os.path.dirname(__file__))


## Security Configuration
# Your App secret key
SECRET_KEY = 'ed66400a-8b65-43e1-b503-09dc95e8ee7c'
# Generate a good salt using: secrets.SystemRandom().getrandbits(128)
SECURITY_PASSWORD_SALT = '146585695368132386173505879516728509634'
# no forms so no concept of flashing
SECURITY_FLASH_MESSAGES = False
# Need to be able to route backend flask API calls. Use 'accounts'
# to be the Flask-Security endpoints.
SECURITY_URL_PREFIX = '/api/accounts'
# Turn on all the great Flask-Security features
SECURITY_RECOVERABLE = True
SECURITY_TRACKABLE = True
SECURITY_CHANGEABLE = True
SECURITY_CONFIRMABLE = False
SECURITY_REGISTERABLE = True
SECURITY_UNIFIED_SIGNIN = False
# These need to be defined to handle redirects
# As defined in the API documentation - they will receive the relevant context

SECURITY_POST_CONFIRM_VIEW = "/confirmed"
SECURITY_CONFIRM_ERROR_VIEW = "/confirm-error"
SECURITY_RESET_VIEW = "/reset-password"
SECURITY_RESET_ERROR_VIEW = "/reset-password"
SECURITY_REDIRECT_BEHAVIOR = "spa"
# CSRF protection is critical for all session-based browser UIs
# enforce CSRF protection for session / browser - but allow token-based
# API calls to go through
SECURITY_CSRF_PROTECT_MECHANISMS = ["session", "basic"]
SECURITY_CSRF_IGNORE_UNAUTH_ENDPOINTS = True
# Send Cookie with csrf-token. This is the default for Axios and Angular.
SECURITY_CSRF_COOKIE_NAME = "XSRF-TOKEN"
WTF_CSRF_CHECK_DEFAULT = False
WTF_CSRF_TIME_LIMIT = None

SECURITY_TOKEN_MAX_AGE = 10

# ----- DEV ONLY ------
SECURITY_REGISTERABLE = True

## Database Configuration
# The MongoEngine connection string.
MONGODB_SETTINGS = {'HOST': 'localhost',
                    'PORT': 27017,
                    'DB': 'maPetiteCompta'}


CSRF_ENABLED = True
APP_NAME = "maPetiteCompta"