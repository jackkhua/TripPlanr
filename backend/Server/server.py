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
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('user_information.user_id'))

class geographic_data(db.Model):
    __tablename__ = "geographic_data"
    location_code = db.Column('location_code', db.Integer, primary_key = True)
    location = db.Column('location', db.String(255))
    city = db.Column('city', db.String(255))
    country = db.Column('country', db.String(255))

class attraction_data(db.Model):
    __tablename__ = "attraction_data"
    attraction_id = db.Column('attraction_id', db.Integer, primary_key = True)
    attraction_name = db.Column('attraction_name', db.String(255))
    rating = db.Column('rating', db.Integer)
    location_code = db.Column('location_code', db.Integer, db.ForeignKey('geographic_data.location_code'))
    country = db.Column('country', db.String(255))
    labels = db.Column('labels', db.JSON)
    tags = db.Column('tags', db.ARRAY(db.String(255)))

class trip_data(db.Model):
    __tablename__ = "trip_data"
    trip_id = db.Column('trip_id', db.Integer, primary_key = True)
    # schedule will be a json with dates as keys, and list of attraction_ids as value
    schedule = db.Column('schedule', db.JSON)
    user_id = db.Column('user_id', db.Integer, db.ForeignKey('user_information.user_id'))
    meta_data = db.Column('meta_data', db.JSON)



@app.route('/users', methods = ['POST'])
def users_create():
    
        
    if request.method == 'POST':
        if "user_name" in request.json and "password" in request.json:
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
            return "User not found", 400
        if ("meta_data" in request.json):
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

@app.route("/users/<user_id>/trip", methods = ['POST'])
def create_trip(user_id):
    user = user_information.query.filter_by(user_id = user_id).first()
    if request.method == 'POST':
        if user == None:
            return "User not found", 400
        if "meta_data" in request.json:
            trip = trip_data(schedule={}, user_id = int(user_id), meta_data=request.json["meta_data"])
            db.session.add(trip)
            db.session.commit()
            return {
                'trip_id': trip.trip_id,
                'schedule': trip.schedule,
                'user_id': trip.user_id,
                'meta_data': trip.meta_data
            }
    return "Error", 400

@app.route("/users/<user_id>/trip/<trip_id>", methods = ['GET', 'PATCH'])
def trip(user_id, trip_id):
    user = user_information.query.filter_by(user_id = user_id).first()
    if user == None:
        return "User not found", 400
    if request.method == 'GET':
        

        trip = trip_data.query.filter_by(trip_id = trip_id).first()
        if trip.user_id == int(user_id):
            return {
                'trip_id': trip.trip_id,
                'schedule': trip.schedule,
                'user_id': trip.user_id,
                'meta_data': trip.meta_data
            }
        else:
            return "Could not find user for trip", 400
    if request.method == 'PATCH':
        trip = trip_data.query.filter_by(trip_id = trip_id).first()
        if trip.user_id == int(user_id):
        
            if 'schedule' in request.json:
                trip.schedule = request.json['schedule']
            if 'meta_data' in request.json:
                trip.meta_data = request.json['meta_data']
            db.session.merge(trip)
            db.session.commit()
            return {
                'trip_id': trip.trip_id,
                'schedule': trip.schedule,
                'user_id': trip.user_id,
                'meta_data': trip.meta_data
            }
    return "Error", 400

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

@app.route("/location/<location_code>", methods = ['GET'])
def location_get(location_code):
    location = geographic_data.query.filter_by(location_code = location_code).first()
    if location == None:
        return "Location not found", 400
    return {
        'location_code': location.location_code,
        'location': location.location,
        'city': location.city,
        'country': location.country
    }

@app.route("/location", methods = ['GET'])
def location_get_by_name():
    location = geographic_data.query.filter_by(location = request.json["location"]).first()
    if location == None:
        return "Location not found", 400
    return {
        'location_code': location.location_code,
        'location': location.location,
        'city': location.city,
        'country': location.country
    }

@app.route("/location/all", methods = ['GET'])
def location_all():
    locations = geographic_data.query.all()
    if locations == None:
        return "Locations not found", 
    locations_dict = {}
    for location in locations:
        locations_dict[location.location] = {
            'location_code': location.location_code,
            'location': location.location,
            'city': location.city,
            'country': location.country
        }
    return locations_dict



@app.route("/location/country/<country>", methods = ['GET'])
def country_get(country):
    locations = geographic_data.query.filter_by(country = country)
    if locations == None:
        return "Locations not found", 
    locations_dict = {}
    for location in locations:
        locations_dict[location.location] = {
            'location_code': location.location_code,
            'location': location.location,
            'city': location.city,
            'country': location.country
        }
    return locations_dict



@app.route("/attraction/<attraction_id>", methods = ['GET'])
def attraction_get(attraction_id):
    attraction = attraction_data.query.filter_by(attraction_id = attraction_id).first()
    if attraction == None:
        return "Attraction not found", 400
    return {
        'attraction_id': attraction.attraction_id,
        'attraction_name': attraction.attraction_name,
        'rating': attraction.rating,
        'location_code': attraction.location_code,
        'country': attraction.country,
        'labels': attraction.labels,
        'tags': attraction.tags
    }


@app.route("/attraction/location/<location_code>", methods = ['GET'])
def location_attractions_get(location_code):
    attractions = attraction_data.query.filter_by(location_code = location_code)
    if attractions == None:
        return "Attractions not found", 
    attractions_dict = {}
    for attraction in attractions:
        attractions_dict[attraction.attraction_name] = {
            'attraction_id': attraction.attraction_id,
            'attraction_name': attraction.attraction_name,
            'rating': attraction.rating,
            'location_code': attraction.location_code,
            'country': attraction.country,
            'labels': attraction.labels,
            'tags': attraction.tags
        }
    return attractions_dict

# dont need restaurants rn
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

@app.route("/location/city/<city>", methods = ['GET'])
def city_get(city):
    # dont need
    return [{name: "xd"}]

@app.route("/attraction/country/<country_code>", methods = ['GET'])
def country_attractions_get(country_code):
    # dont need
    return [{attraction_id: 1}]

@app.route("/attraction/rating_above/<rating>", methods = ['GET'])
def attraction_get_by_rating(rating = 0):
    # dont need
    return [{attraction_id: 1}]


if __name__ == '__main__':
    app.run(host='localhost', port=8080)