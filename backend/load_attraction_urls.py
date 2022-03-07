import pandas as pd
import psycopg2
from tags_mapping import general_tags
import json
connection = psycopg2.connect(user="postgres",
                                  password="tripplanr69",
                                  host="localhost",
                                  port="5432",
                                  database="postgres")
cursor = connection.cursor()
query_text = """UPDATE attraction_data SET source_url = (%s) WHERE attraction_name = (%s)"""
reviews = pd.read_csv('tripadvisor_reviews.csv').to_numpy()
attractions_map = {

}
for review in reviews:
    record_to_insert = (review[0], review[1])
    if review[1] in attractions_map:
        continue
    try:
        cursor.execute(query_text, record_to_insert)
        connection.commit()
        attractions_map[review[1]] = True
    except (Exception, psycopg2.Error) as error:   
        print("ERROR: " + str(error))     
        cursor.execute("ROLLBACK")
        connection.commit()
        continue
cursor.close()
connection.close()

print("done")
