#!/usr/bin/env bash
#first param - filename
#second param - dbname
createdb $2

mdb-tables $1

mdb-schema $1 postgres | psql -d $2 -U test -h localhost

mdb-tables -1 Test.mdb| while read TT
do
     mdb-export -I postgres -q \' -D '%Y-%m-%d %H:%M:%S' $1 "$TT" | psql -d $2 -h localhost
done
