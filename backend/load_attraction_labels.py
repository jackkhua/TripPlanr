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
query_text = """UPDATE attraction_data SET labels = (%s) WHERE attraction_name = (%s)"""
predictions = pd.read_csv('final_prediction_median.csv').to_numpy()

for prediction in predictions:
    labels = json.loads(prediction[1])

    #recordstr = '{'
    #for item in val:
    #    recordstr = recordstr + '''"''' + item + '''",'''
    #if (recordstr[-1] == ','):
    #    recordstr = recordstr[:-1]
    #recordstr = recordstr + '}'
    record_to_insert = (prediction[1], prediction[0])
    try:
        cursor.execute(query_text, record_to_insert)
        connection.commit()
    except (Exception, psycopg2.Error) as error:   
        print(error)     
        cursor.execute("ROLLBACK")
        connection.commit()
        continue
cursor.close()
connection.close()

print("done")
