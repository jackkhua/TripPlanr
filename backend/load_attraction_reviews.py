import pandas as pd
import psycopg2

connection = psycopg2.connect(user="postgres",
                                  password="tripplanr69",
                                  host="localhost",
                                  port="5432",
                                  database="postgres")
cursor = connection.cursor()
query_text = """INSERT INTO attraction_review_data ("review_text", "rating", "attraction_id") VALUES (%s, %s, %s)"""
reviews = pd.read_csv('tripadvisor_reviews.csv').to_numpy()
print(reviews[0][0])
attractionset = {
}
myset = set()
print(len(reviews))
query_text_2 = "SELECT * FROM attraction_data"
cursor.execute(query_text_2)
locations = cursor.fetchall()
for row in locations:
    attractionset[row[1]] = row[0]
for i in range(len(reviews)):
    city = reviews[i][6]
    if city != "London" and city != "Singapore" and city != "Seoul" and city != "New York City":
        continue
    
    record_to_insert = (reviews[i][16], reviews[i][10], attractionset[reviews[i][1]])
    try:
        cursor.execute(query_text, record_to_insert)
        connection.commit()
        myset.add(city)
    except (Exception, psycopg2.Error) as error:
        myset.add(city)
        
        cursor.execute("ROLLBACK")
        connection.commit()
        print("error: ", error)
        continue
cursor.close()
connection.close()
print("done")
