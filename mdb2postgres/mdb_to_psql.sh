#first param - filename
#second param - dbname
createdb $2

mdb-tables $1

mdb-schema $1 postgres | PGPASSWORD=user psql -d $2 -U make_db -h localhost

mdb-tables -1 $1| while read TT
do
     mdb-export -I postgres -q \' -D '%Y-%m-%d %H:%M:%S' $1 "$TT" | PGPASSWORD=user psql -d $2 -U make_db -h localhost
done
