import pandas as pd
import psycopg2

connection = psycopg2.connect(user="postgres",
                                  password="tripplanr69",
                                  host="localhost",
                                  port="5432",
                                  database="postgres")
cursor = connection.cursor()
query_text = """INSERT INTO attraction_data ("attraction_name", "rating", "location_code", "country") VALUES (%s, %s, %s, %s) ON CONFLICT (attraction_name) DO NOTHING"""
reviews = pd.read_csv('tripadvisor_reviews.csv').to_numpy()
print(reviews[0][0])
cityset = {
}
myset = set()
print(len(reviews))
query_text_2 = "SELECT * FROM geographic_data"
cursor.execute(query_text_2)
locations = cursor.fetchall()
for row in locations:
    cityset[row[1]] = (row[0], row[3])
for i in range(len(reviews)):
    city = reviews[i][6]
    if city != "London" and city != "Singapore" and city != "Seoul" and city != "New York City":
        continue
    country = cityset[city]
    record_to_insert = (reviews[i][1], reviews[i][10], cityset[city][0], cityset[city][1])
    try:
        cursor.execute(query_text, record_to_insert)
        connection.commit()
        myset.add(city)
    except (Exception, psycopg2.Error) as error:
        myset.add(city)
        
        cursor.execute("ROLLBACK")
        connection.commit()
        continue
cursor.close()
connection.close()
print("done")
