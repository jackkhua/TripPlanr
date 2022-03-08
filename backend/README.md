Step 1: Start up psql and connect using default values:
Server: localhost
Database: postgres
Port: 5432
Username: postgres

And set the password to tripplanr69

Run \i <path_to_TripPlanr>/backend/Server/db_initialization.sql

Step 2:

NOTE: Make sure to have tripadvisor_reviews.csv in backend folder before running these commands

cd to <path_to_TripPlanr>/backend

Run py load_geographic_data.py

Run py load_attractions.py

Run py_load_attraction_imgs.py

Run py_load_attraction_tags.py

Run py_load_attraction_urls.py

Step 3:

cd to <path_to_TripPlanr>/backend/server

Run pip install

Run py server.py

The server should be up and running now! You can play around with the API calls in postman or try to use it with the frontend.