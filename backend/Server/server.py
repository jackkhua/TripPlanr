from flask import Flask
from flask import request, jsonify
from flask_sqlalchemy import SQLAlchemy
import json
from datetime import datetime

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
    meta_data = db.Column('meta_data', db.Text)

@app.route('/users', methods = ['POST'])
def users_create():
    
        
    if request.method == 'POST':
        print(request.json)
        user = user_information(user_name=request.json["user_name"], created_dt=db.func.now(), last_login_dt=db.func.now(), meta_data="{}")
        db.session.add(user)
        db.session.commit()
        db.session.flush()
        return str(user.user_id)

    if request.method == 'PATCH':
        return "xd"
    return "its not lit"

@app.route("/users/<user_id>", methods = ['GET', 'DELETE'])
def users(user_id):
    if request.method == 'GET':
        user = user_information.query.filter_by(user_id = user_id).first()
        if user == None:
            return "User not found"
        return {
            'user_id': user.user_id,
            'user_name': user.user_name,
            'created_dt': user.created_dt,
            'last_login_dt': user.last_login_dt,
            'meta_data': user.meta_data
        }
    
    if request.method == 'DELETE':
        user = user_information.query.filter_by(user_id = user_id).first()
        if user == None:
            return "User not found"
        db.session.delete(user)
        db.session.commit()
        return str(user_id)

@app.route("/users/<user_id>/update_responses", methods = ['PATCH'])
def users_update_responses(user_id):
    if request.method == 'PATCH':
        user = user_information.query.filter_by(user_id = user_id).first()
        if user == None:
            return "User not found"
        print("meta_data" in request.json.keys())
        if ("meta_data" in request.json.keys()):
            user.meta_data = json.dumps(request.json["meta_data"])
            db.session.merge(user)
            db.session.commit()
    return user_id

@app.route("/users/<user_id>/location/<location_code>/generate_itinerary", methods = ['GET'])
def users_generate_itinerary(user_id, location_code):
    if request.method == 'GET':
        print ("GET")
    return

@app.route("/authenticate", methods = ['GET'])
def authenticate():
    return "authenticated"

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