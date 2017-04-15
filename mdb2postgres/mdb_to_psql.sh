#first param - filename
#second param - dbname
#third param - username
#fourth param - password

createdb $2

mdb-tables $1

#mdb-schema  --no-indexes --no-relations $1 postgres | PGPASSWORD=$4 psql -d $2 -U $3 -h localhost
mdb-schema  $1 postgres | PGPASSWORD=$4 psql -d $2 -U $3 -h localhost

mdb-tables -1 $1| while read TT
do
     mdb-export -I postgres -q \' -D '%Y-%m-%d %H:%M:%S' $1 "$TT" | PGPASSWORD=$4 psql -d $2 -U $3 -h localhost
done
