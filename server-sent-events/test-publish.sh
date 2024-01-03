#!/bin/bash

curl -S --location --request POST 'http://localhost:8080/api/v1/live-scores' \
--header 'Content-Type: application/json' \
--data-raw '{
    "homeTeam": "Arsenal",
    "awayTeam": "Tottenham",
    "homeScore": 1,
    "awayScore": 1
}'

