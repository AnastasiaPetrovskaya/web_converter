#for TT in $(mdb-tables Test.mdb); 
#   do mdb-export  -I postgres -q ‘ Test.mdb "$TT" | psql -d test_import1 -h localhost
#done

mdb-tables -1 Test.mdb| while read TT
do
     #mdb-export -I postgres Test.mdb "$TT" |   psql -d test_import1 -h localhost

     mdb-export -I postgres -q \' -D '%Y-%m-%d %H:%M:%S' Test.mdb "$TT" | psql -d test_import1 -h localhost
     #mdb-export Test.mdb "$TT" > "$TT.csv"
done
