from google.cloud.sql.connector import connector
import sqlalchemy
import pg8000.native

def getconn() -> pg8000.native.Connection:
    conn: pg8000.native.Connection = connector.connect(
        "concise-smoke-338321:us-central1:tripplanr",
        "pg8000",
        user="root",
        password="ece_tripplanr71",
        db="public"
    )
    return conn

pool = sqlalchemy.create_engine(
    "postgresql+pg8000://",
    creator=getconn,
)
test = sqlalchemy.text(
    "\dt",
)
with pool.connect() as db_conn:
    result = db_conn.execute(test).fetchall()
    print(result)

# from google.cloud import storage
# storage_client = storage.Client()
# buckets = list(storage_client.list_buckets())
# print(buckets)