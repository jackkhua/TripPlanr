from flask import Flask
from flask import request, jsonify
from flask_sqlalchemy import SQLAlchemy
import json
from datetime import datetime
import hashlib
import uuid

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:tripplanr69@localhost/postgres'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy()
db.init_app(app)

class user_information(db.Model):
    __tablename__ = "user_information"
    user_id = db.Column('user_id', db.Integer, primary_key = True)
    user_name = db.Column('user_name', db.String(255))
    created_dt = db.Column('created_dt', db.DateTime)
    last_login_dt = db.Column('last_login_dt', db.DateTime)
    meta_data = db.Column('meta_data', db.JSON)

class login_credentials(db.Model):
    __tablename__ = "login_credentials"
    credential_id = db.Column('credential_id', db.Integer, primary_key = True)
    credential_pswd = db.Column('credential_pswd', db.String(255))
    user_id = db.Column('user_id', db.Integer, foreign_key = True)

@app.route('/users', methods = ['POST'])
def users_create():
    
        
    if request.method == 'POST':
        if "user_name" in request.json.keys() and "password" in request.json:
            user = user_information(user_name=request.json["user_name"], created_dt=db.func.now(), last_login_dt=db.func.now(), meta_data=request.json["meta_data"])
            
            db.session.add(user)
            
            db.session.commit()
            salt = uuid.uuid4().hex
            credentials = login_credentials(credential_pswd=hashlib.sha256(salt.encode() + request.json["password"].encode()).hexdigest() + ':' + salt, user_id=user.user_id)
            db.session.add(credentials)
            
            db.session.commit()
            return {
            'user_id': user.user_id,
            'user_name': user.user_name,
            'created_dt': user.created_dt,
            'last_login_dt': user.last_login_dt,
            'meta_data': user.meta_data
            
            }
        else:
            return "User name and password must be provided.", 400

    return 400
@app.route("/users/<user_id>", methods = ['GET', 'DELETE'])
def users(user_id):
    if request.method == 'GET':
        user = user_information.query.filter_by(user_id = user_id).first()
        if user == None:
            return "User not found", 400
        return {
            'user_id': user.user_id,
            'user_name': user.user_name,
            'created_dt': user.created_dt,
            'last_login_dt': user.last_login_dt,
            'meta_data': user.meta_data
        }
    
    if request.method == 'DELETE':
        user = user_information.query.filter_by(user_id = user_id).first()
        credentials = login_credentials.query.filter_by(user_id = user_id).first()
        if user == None:
            return "User not found", 400
        db.session.delete(credentials)
        db.session.delete(user)
        db.session.commit()
        return {
            'user_id': user.user_id,
            'user_name': user.user_name,
            'created_dt': user.created_dt,
            'last_login_dt': user.last_login_dt,
            'meta_data': user.meta_data
        }

@app.route("/users/<user_id>/update_responses", methods = ['PATCH'])
def users_update_responses(user_id):
    if request.method == 'PATCH':
        user = user_information.query.filter_by(user_id = user_id).first()
        if user == None:
            return "User not found"
        if ("meta_data" in request.json.keys()):
            user.meta_data = request.json["meta_data"]
            db.session.merge(user)
            db.session.commit()
            return {
                'user_id': user.user_id,
                'user_name': user.user_name,
                'created_dt': user.created_dt,
                'last_login_dt': user.last_login_dt,
                'meta_data': user.meta_data
            }
        else:
            "no meta data", 400
    return "Must be patch"

@app.route("/users/<user_id>/location/<location_code>/generate_itinerary", methods = ['GET'])
def users_generate_itinerary(user_id, location_code):
    if request.method == 'GET':
        print ("GET")
    return

@app.route("/authenticate", methods = ['GET'])
def authenticate():
    user = user_information.query.filter_by(user_name = request.json["user_name"]).first()
    user_id = user.user_id
    credential_pass = login_credentials.query.filter_by(user_id = user_id).first().credential_pswd
    hashed_pass, salt = credential_pass.split(':')
    success = hashed_pass == hashlib.sha256(salt.encode() + request.json["password"].encode()).hexdigest()
    if success:
        user.last_login_dt = db.func.now()
            
        db.session.merge(user)
            
        db.session.commit()
        return {
            'user_id': user.user_id,
            'user_name': user.user_name,
            'created_dt': user.created_dt,
            'last_login_dt': user.last_login_dt,
            'meta_data': user.meta_data
        }
    return "Could not authenticate, invalid."

@app.route("/location/<location_id>", methods = ['GET'])
def location_get(location_id):
    return {name: "xd"}

@app.route("/location/country/<country>", methods = ['GET'])
def country_get(country):
    return [{name: "xd"}]

@app.route("/location/city/<city>", methods = ['GET'])
def city_get(city):
    return [{name: "xd"}]

@app.route("/attraction/<attraction_id>", methods = ['GET'])
def attraction_get(attraction_id):
    return {attraction_id: 1}

@app.route("/attraction/location/<location_code>", methods = ['GET'])
def location_attractions_get(location_code):
    return [{attraction_id: 1}]

@app.route("/attraction/country/<country_code>", methods = ['GET'])
def country_attractions_get(country_code):
    return [{attraction_id: 1}]

@app.route("/attraction/rating_above/<rating>", methods = ['GET'])
def attraction_get_by_rating(rating = 0):
    return [{attraction_id: 1}]

@app.route("/restaurant/<restaurant_id>", methods = ['GET'])
def restaurant_get(restaurant_id):
    return {restaurant_id: 1}

@app.route("/restaurant/location/<location_code>", methods = ['GET'])
def location_restaurants_get(location_code):
    return [{restaurant_id: 1}]

@app.route("/restaurant/country/<country_code>", methods = ['GET'])
def country_restaurants_get(country_code):
    return [{restaurant_id: 1}]

@app.route("/restaurant/rating_above/<rating>", methods = ['GET'])
def restaurant_get_by_rating(rating = 0):
    return [{restaurant_id: 1}]


if __name__ == '__main__':
    app.run(host='localhost', port=8080)