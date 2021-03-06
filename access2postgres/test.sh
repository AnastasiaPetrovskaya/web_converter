#for TT in $(mdb-tables Test.mdb); 
#   do mdb-export  -I postgres -q ‘ Test.mdb "$TT" | psql -d test_import1 -h localhost
#done
#first param - filename
#second param - dbname
createdb $2

mdb-tables $1

#mdb-schema $1 postgres | psql -d olschimke -U olschimke -W -h localhost
mdb-schema $1 postgres | psql -d $2 -U test -h localhost

mdb-tables -1 Test.mdb| while read TT
do
     #mdb-export -I postgres Test.mdb "$TT" |   psql -d test_import1 -h localhost

     mdb-export -I postgres -q \' -D '%Y-%m-%d %H:%M:%S' $1 "$TT" | psql -d $2 -h localhost
     #mdb-export Test.mdb "$TT" > "$TT.csv"
done
