# web_converter
web-application system for learning relational algebra and tuples

### Required packages

* node -v 8.0^
* npm 
* mdbtools
  apt get install mdb tools
 * postgresql 
  
 * Java JDK
 * graphviz 
 * schemacrawler  
    https://github.com/schemacrawler/SchemaCrawler/releases/
    
***
### Deployment

#### Step 1

> npm install

#### Step 2

Start Postgres prompt: 
> sudo -u postgres psql

Create new role for Web - Converter database
> CREATE ROLE converter WITH LOGIN CREATEDB PASSWORD "user123"

Create system database
> CREATE DATABASE db_converter WITH OWNER converter

Create study databases
> CREATE DATABASE kino_for_tests WITH OWNER converter
> CREATE DATABASE kino_1 WITH OWNER converter

And exit from Postgres prompt
> \q

Import databases from *.sql
```powershell
  sudo -u postgres psql -U converter -h 127.0.0.1 -d db_converter -f backup.sql
  sudo -u postgres psql -U converter -h 127.0.0.1 -d kino_for_tests -f kino_for_tests.sql
  sudo -u postgres psql -U converter -h 127.0.0.1 -d kino_1 -f kino_1.sql
```

#### Step 3

Unzip *schemacrawler* to project's root and fix in models/methods/data_base.js
```javascript
DataBase.get_schema = function (db_id) {
        return DataBase.findById(db_id)
            .then(function (db) {
                ...
                    //change here for your SC version!
                    {cwd: "./schemacrawler-15.06.01-distribution/_schemacrawler"});
            }).then(function(result) {
                ...
            }).catch(function(err) {
                ...
            });
    },
```
to your version 

***
### Using

run
> NODE_ENV=test node index.js

and visit
http://127.0.0.1:2004

You can login as administrator with:  
```bash
   login: user  
   password: user  
```
