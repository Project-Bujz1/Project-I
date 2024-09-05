# from flask import Flask, request, jsonify
# import jwt
# from datetime import datetime, timedelta
# import os
# from functools import wraps

# app = Flask(__name__)
# app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')

# # Mock admin credentials (replace with database in production)
# ADMIN_USERNAME = 'admin'
# ADMIN_PASSWORD = 'password'


# def token_required(f):
#     @wraps(f)
#     def decorated(*args, **kwargs):
#         token = request.headers.get('Authorization')
#         if not token:
#             return jsonify({'message': 'Token is missing!'}), 401
#         try:
#             data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
#         except:
#             return jsonify({'message': 'Token is invalid!'}), 401
#         return f(*args, **kwargs)
#     return decorated

# @app.route('/api/admin/login', methods=['POST'])
# def admin_login():
#     auth = request.json
#     if not auth or not auth.get('username') or not auth.get('password'):
#         return jsonify({'message': 'Could not verify'}), 401
    
#     if auth['username'] == ADMIN_USERNAME and auth['password'] == ADMIN_PASSWORD:
#         token = jwt.encode({
#             'username': auth['username'],
#             'exp': datetime.utcnow() + timedelta(hours=24)
#         }, app.config['SECRET_KEY'])
#         return jsonify({'token': token})
    
#     return jsonify({'message': 'Invalid credentials'}), 401

# @app.route('/api/admin/protected', methods=['GET'])
# @token_required
# def protected():
#     return jsonify({'message': 'This is a protected route.'})

# if __name__ == '__main__':
#     app.run(debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta
import os
from functools import wraps

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key')

# Mock admin credentials (replace with database in production)
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'password'

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    auth = request.json
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({'message': 'Could not verify'}), 401
    
    if auth['username'] == ADMIN_USERNAME and auth['password'] == ADMIN_PASSWORD:
        token = jwt.encode({
            'username': auth['username'],
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        return jsonify({'token': token})
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/admin/protected', methods=['GET'])
@token_required
def protected():
    return jsonify({'message': 'This is a protected route.'})

if __name__ == '__main__':
    app.run(debug=True)