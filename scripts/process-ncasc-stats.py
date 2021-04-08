"""
Munge the Events report from Google Analytics to be more usable.

In the console, go to Behavior > Events > Top Events.
Switch the time period to cover Feb 15 on.
Change Primary Dimension to be "Event Action".
Show as many rows as possible/desired, then Export as CSV.
Change name of script to match `ncasc-stats.csv`, then run this.
A bit of manual cleanup may be needed for a few garbled rows, afterward.
"""

import csv
import re
import urllib.parse

with open('processed-ncasc-stats.csv', 'w', newline='') as csvfile:
    csvwriter = csv.writer(csvfile)
    with open("ncasc-stats.csv", newline="") as f:
        reader = csv.reader(f)
        for row in reader:
            #print(row)
            query = re.match(r".*Query\:(.*)Topic\:", row[0])
            if query:
                query = urllib.parse.unquote(query.group(1).replace("&query=", "")).strip()
                if query == "null":
                    query = None

            topic = re.match(r".*Topic\:(.*)Subtopics\:", row[0])
            if topic:
                topic = urllib.parse.unquote(topic.group(1).replace("&topics=", "")).strip()
                # print("TOPIC " + topic)

            subtopic = re.match(r".*Subtopics\:(.*)Organizations\:", row[0])
            if subtopic:
                subtopic = urllib.parse.unquote(subtopic.group(1).replace("&subtopics=", "")).strip()
                # print("SUBTOPIC " + subtopic)

            orgs = re.match(r".*Organizations\:(.*)$", row[0])
            if orgs:
                orgs = urllib.parse.unquote(orgs.group(1).replace("&organizations=", "")).strip()
                # print("ORGS " + orgs)

            if query or topic or subtopic or orgs:
                if query is None:
                    query=""
                csvwriter.writerow([query, topic, subtopic, orgs, row[1], row[2]])