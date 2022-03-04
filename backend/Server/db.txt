CREATE DATABASE TripPlanr;


CREATE TABLE user_information (
    user_id SERIAL PRIMARY KEY,
    user_name VARCHAR (255) NOT NULL,
    created_dt TIMESTAMP DEFAULT NULL,
    last_login_dt TIMESTAMP DEFAULT NULL,
    meta_data TEXT DEFAULT NULL
);

CREATE TABLE login_credentials (
    credential_id VARCHAR (255) PRIMARY KEY,
    credential_pswd VARCHAR (255) NOT NULL,
    user_id INT REFERENCES user_information
);

CREATE TABLE geographic_data (
    location_code INT PRIMARY KEY,
    location VARCHAR (255) NOT NULL,
    city VARCHAR (255) NOT NULL,
    country VARCHAR (255) NOT NULL
);

CREATE TABLE attraction_data (
    attraction_id INT PRIMARY KEY,
    attraction_name VARCHAR (255) NOT NULL,
    rating REAL DEFAULT 1,
    location_code INT REFERENCES geographic_data,
    country VARCHAR (255) NOT NULL
);

CREATE TABLE restaurant_data (
    restaurant_id INT PRIMARY KEY,
    restaurant_name VARCHAR (255) NOT NULL,
    rating REAL DEFAULT 1,
    location_code INT REFERENCES geographic_data,
    country VARCHAR (255) NOT NULL,
    source_site_id INT DEFAULT NULL
);

CREATE TABLE restaurant_review_data (
    review_id INT PRIMARY KEY,
    review_text TEXT DEFAULT NULL,
    rating REAL DEFAULT 1,
    review_date TIMESTAMP DEFAULT NULL,
    restaurant_id INT REFERENCES restaurant_data
);

CREATE TABLE attraction_review_data (
    review_id INT PRIMARY KEY,
    review_text TEXT DEFAULT NULL,
    rating REAL DEFAULT 1,
    review_date TIMESTAMP DEFAULT NULL,
    attraction_id INT REFERENCES restaurant_data
);

\dt;