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
query_text = """UPDATE attraction_data SET img = (%s) WHERE attraction_name = (%s)"""
images = pd.read_csv('attraction_images.csv').to_numpy()
for image in images:
    if image[1] == None:
        continue
    record_to_insert = (image[1], image[0])
    try:
        cursor.execute(query_text, record_to_insert)
        connection.commit()
    except (Exception, psycopg2.Error) as error:   
        print("ERROR: " + str(error))     
        cursor.execute("ROLLBACK")
        connection.commit()
        continue
cursor.close()
connection.close()

print("done")
