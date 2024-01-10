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
import json

umami1_website_id = 22
umami2_website_id = "3124d660-fae0-4fac-8f4b-355cb31fc8ab"

psql_host = "umami.snap.uaf.edu"
psql_port = "5432"
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
    port=psql_port,
)


def umami1_payloads():
    sql = """
        SELECT v1_event_data.event_data
        FROM v1_event INNER JOIN v1_event_data
        ON v1_event.event_id = v1_event_data.event_id
        WHERE v1_event.website_id = %(website_id)s
    """

    params = {
        "website_id": umami1_website_id,
    }

    if args.start_date:
        sql += " AND created_at >= %(start_date)s"
        params["start_date"] = args.start_date

    if args.end_date:
        sql += " AND created_at <= %(end_date)s"
        params["end_date"] = args.end_date

    cursor.execute(sql, params)
    rows = cursor.fetchall()

    payloads = list(map(lambda row: row[0], rows))
    return payloads


def umami2_payloads():
    sql = """
        SELECT website_event_id, event_key, string_value
        FROM event_data WHERE website_id = %(website_id)s
    """

    params = {
        "website_id": umami2_website_id,
    }

    if args.start_date:
        sql += " AND created_at >= %(start_date)s"
        params["start_date"] = args.start_date

    if args.end_date:
        sql += " AND created_at <= %(end_date)s"
        params["end_date"] = args.end_date

    cursor.execute(sql, params)
    rows = cursor.fetchall()

    event_data = {}
    for row in rows:
        count = 1
        event_id = row[0]
        field_key = row[1]
        field_value = row[2]
        if event_id not in event_data:
            event_data[event_id] = {}
        event_data[event_id][field_key] = field_value

    return event_data.values()


cursor = conn.cursor()

payloads = umami1_payloads()
payloads += umami2_payloads()

# Tally the number of identical payload dicts
counts = {}
for payload in payloads:
    payload_key = json.dumps(payload, sort_keys=True)
    if payload_key not in counts:
        counts[payload_key] = 0
    counts[payload_key] += 1

# Sort payload tally by number of occurrences
counts = {
    k: v for k, v in sorted(counts.items(), key=lambda item: item[1], reverse=True)
}

with open("processed-ncasc-stats.csv", "w", newline="") as csvfile:
    csvwriter = csv.writer(csvfile)
    csvwriter.writerow(
        [
            "Count",
            "Query",
            "Topic",
            "Subtopic",
            "Organization",
            "Project Type",
            "Fiscal Year",
            "Status",
        ]
    )
    for payload, count in counts.items():
        event_data = json.loads(payload)
        csvwriter.writerow(
            [
                count,
                event_data["query"],
                event_data["topic"],
                event_data["subtopics"],
                event_data["organizations"],
                event_data["type"],
                event_data["fy"],
                event_data["status"],
            ]
        )

conn.close()
