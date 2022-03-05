import pandas as pd
import psycopg2
from tags_mapping import general_tags
connection = psycopg2.connect(user="postgres",
                                  password="tripplanr69",
                                  host="localhost",
                                  port="5432",
                                  database="postgres")
cursor = connection.cursor()
query_text = """UPDATE attraction_data SET tags = (%s) WHERE attraction_name = (%s)"""
reviews = pd.read_csv('tripadvisor_reviews.csv').to_numpy()
print(reviews[0][0])
cityset = {
}
myset = set()
print(len(reviews))
query_text_2 = "SELECT * FROM geographic_data"
cursor.execute(query_text_2)
locations = cursor.fetchall()
attraction_map = {

}

for i in range(len(reviews)):
    if reviews[i][1] not in attraction_map:
        attraction_map[reviews[i][1]] = set()
    
    tags = reviews[i][9]
    if isinstance(tags, str) == False:
        continue
    tagsarr = tags.split("•")
    for tag in tagsarr:
        tag = tag.strip()
        attraction_map[reviews[i][1]].add(tag)
attraction_map2 = {


}
for key, val in attraction_map.items():
    if key not in attraction_map2:
        attraction_map2[key] = set()
    for v in val:
        for k1, v1 in general_tags.items():
            if v in v1:
                attraction_map2[key].add(k1)
for key, val in attraction_map2.items():
    recordstr = '{'
    for item in val:
        recordstr = recordstr + '''"''' + item + '''",'''
    if (recordstr[-1] == ','):
        recordstr = recordstr[:-1]
    recordstr = recordstr + '}'
    record_to_insert = (recordstr, key)
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
