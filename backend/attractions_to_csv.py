import psycopg2
import csv
connection = psycopg2.connect(user="postgres",
                                  password="tripplanr69",
                                  host="localhost",
                                  port="5432",
                                  database="postgres")
cursor = connection.cursor()
query_text = "SELECT * FROM attraction_data"
cursor.execute(query_text)
attractions = cursor.fetchall()

wtr = csv.writer(open ('out.csv', 'w'), delimiter=',', lineterminator='\n')
for x in attractions:
    if x[4] == "United Kingdom" or x[4] == "Korea" or x[4] == "United States" or x[4] == "Singapore":
        wtr.writerow([x[1]])