#!/usr/bin/env python
"""
This script queries and aggregates event data from Umami's PostgreSQL database.
You can optionally provide start and end dates. Otherwise, all event data from
the specified Umami website ID is returned.
"""
import argparse
import csv
import os
import psycopg2

umami_website_id = 22
psql_host = "umami.snap.uaf.edu"
psql_database = "umami"
psql_user = "umami"
psql_password = os.environ["PSQL_PASSWORD"]

parser = argparse.ArgumentParser()

parser.add_argument(
    "-s",
    "--start_date",
    action="store",
    dest="start_date",
    type=str,
    help="Start date for data",
)

parser.add_argument(
    "-e",
    "--end_date",
    action="store",
    dest="end_date",
    type=str,
    help="End date for data",
)

args = parser.parse_args()

conn = psycopg2.connect(
   database=psql_database,
   user=psql_user,
   password=psql_password,
   host=psql_host,
)

cursor = conn.cursor()
sql = """
    SELECT COUNT(*), event_data.event_data
    FROM event INNER JOIN event_data ON event.event_id = event_data.event_id
    WHERE event.website_id = %(website_id)s
"""

params = {
    "website_id": umami_website_id,
}

if args.start_date:
    sql += " AND created_at >= %(start_date)s"
    params["start_date"] = args.start_date

if args.end_date:
    sql += " AND created_at <= %(end_date)s"
    params["end_date"] = args.end_date

sql += " GROUP BY event_data ORDER BY count DESC"

cursor.execute(sql, params)
rows = cursor.fetchall()
conn.close()

with open("processed-ncasc-stats.csv", "w", newline="") as csvfile:
    csvwriter = csv.writer(csvfile)
    csvwriter.writerow([
        "Count",
        "Query",
        "Topic",
        "Subtopic",
        "Organization",
        "Project Type",
        "Fiscal Year",
        "Status"
    ])
    for row in rows:
        count = row[0]
        event_data = row[1]
        csvwriter.writerow([
            count,
            event_data["query"],
            event_data["topic"],
            event_data["subtopics"],
            event_data["organizations"],
            event_data["type"],
            event_data["fy"],
            event_data["status"]
        ])
