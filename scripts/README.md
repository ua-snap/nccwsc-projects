# Analytics CSV export script

The `process-ncasc-stats.py` script in this directory pulls event tracking data
from the Umami server's PostgreSQL database, aggregates unique combinations of
event parameters between a provided date range, and writes a CSV file of these
events sorted by a count of their occurrences to `processed-ncasc-stats.csv`.

First make sure you are on the UAF network or VPN, then run:

```
pipenv install
export PSQL_PASSWORD="..." # Grab the password from Bitwarden
pipenv run ./process-ncasc-stats.py -s 2023-02-01 -e 2023-03-01
```

If all went as planned, this will generate `processed-ncasc-stats.csv`.
