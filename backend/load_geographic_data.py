import pandas as pd
import psycopg2

connection = psycopg2.connect(user="postgres",
                                  password="tripplanr69",
                                  host="localhost",
                                  port="5432",
                                  database="postgres")
cursor = connection.cursor()
query_text = "INSERT INTO geographic_data (location, city, country) VALUES (%s, %s, %s) ON CONFLICT (location) DO NOTHING"
reviews = pd.read_csv('tripadvisor_reviews.csv').to_numpy()
print(reviews[0][0])
cityset = {
    "London": "United Kingdom",
    "Singapore": "Singapore",
    "Seoul": "Korea",
    "New York City": "United States"
}
myset = set()
print(len(reviews))
for i in range(len(reviews)):
    city = reviews[i][6]
    if city in myset:
        continue
    if city != "London" and city != "Singapore" and city != "Seoul" and city != "New York City":
        continue
    country = cityset[city]
    record_to_insert = (city, city, country)
    try:
        print(record_to_insert)
        cursor.execute(query_text, record_to_insert)
        connection.commit()
        myset.add(city)
        print("Record inserted successfully into mobile table")
    except (Exception, psycopg2.Error) as error:
        myset.add(city)
        
        
        print("Failed to insert record into mobile table", error)
        continue
cursor.close()
connection.close()
print("done")
