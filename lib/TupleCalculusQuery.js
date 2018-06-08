var os = require("os");

function TupleCalculusQuery (query_object) {

    this.title = query_object.title;
    this.alias = query_object.alias;
    this.target_list = query_object.target_list;
    this.query_body = query_object.query_body;
    this.description = query_object.description || "";
    this.sql = "";

    //вспомогательные поля
    //таблицы, атрибуты которых попали в целевой список
    this.outer_tables = [];
}

/*
function DoQuote(y){

    var posFirstQuote = y.indexOfstrpos(/\"/);
    
    while (posFirstQuote > 0){
        w = w + y.substr(0, posFirstQuote);
        w1 = y.substr(posFirstQuote + 1);
        posSecondQuote = w1.indexOfstrpos(/\"/);
        w2 = w1.substr(0, posSecondQuote);
        w2 = w2.replace(" ", "~");
        w2 = w2replace(".", "^");
        w = w + w2;
        y = substr(w1, posSecondQuote + 1);
        posFirstQuote = y.indexOfstrpos(/\"/);
    }
        DoQuote = w + y;
        return DoQuote;
    }

*/


TupleCalculusQuery.prototype.make_sql = function() {
    var sql = "";
    console.log('herTCQ');

    return new Promise(function(resolve, reject) {
          

        //   var re = new RegExp();
        // var reg = new RegExp();

        // re=/^[a-zа-яё]+ AS [a-z](?:, [a-zа-яё]+ AS [a-z])*$/i;        //Выражение для списка типов переменных
        // reg=/^[a-z]\.(?:[a-zа-яё]+|\*)(?:, [a-z]\.(?:[a-zа-яё]+|\*))*$/ig;       //Выражение для целевого списка
        // // console.log('ПРОВЕРКА целевого списка', reg.test(this.target_list));
        // if (re.test(this.alias)){
        //     // массив алиасов
        //     //console.log('ПРОВЕРКА алиасов', re.test(this.alias));

        //     if (reg.test(this.target_list)){
        //         // массив ЦС

        //         // console.log('ПРОВЕРКА целевого списка', reg.test(this.target_list));

        //     }
        // }
        

      var inTables = new Object();
      var wVarInList= new Object();
      var wStrIn = this.alias;
      var lastComma = -2;
      var pos = -1;

//       // составляется ассоциативный массив , ключи которого - переменные, элементы - строка типа "студенты as x"
      while ((pos = this.alias.indexOf(",", pos + 1)) != -1) {
      
          wVar = this.alias.charAt(pos-1);
          wTabl = this.alias.substring(lastComma+2,pos);
          inTables[wVar] = wTabl;
          lastComma = pos;            // позиция предыдущей запятой   
  
      }
        wVar = this.alias.charAt(this.alias.length-1);
          wTabl = this.alias.substring(lastComma+2);
          inTables[wVar] = wTabl;

         // составляется ассоциативный массив , ключи которого - j, элементы - переменная таблицы
    var wStrVar="";       // строка из всех (уникальных) переменных 
    var j=0;
    var lastComma = -2;
    var pos = -1;
    var flg = 1;
// var t = ((pos = targetList.indexOf(",", pos + 1)) != -1 )|| (flg == 1);
// alert (t);

    while (((pos = this.target_list.indexOf(",", pos + 1)) != -1 )|| (flg == 1)) {

      if (pos == -1) {flg = 0;}       // дошли до последнего выражения в целевом списке

      wVar = this.target_list.charAt(lastComma+2);     // находим переменную

      if (inTables[wVar]){          // если переменная объявлена в типах переменных
        
        if (pos != -1) { lastComma = pos;}

        if (wStrVar.indexOf(wVar) == -1){     // если в строке из переменных целевого списка нет найденной переменной
          
          wStrVar = wStrVar + wVar;           // добавляем ее в строку переменых из целевого списка
          wVarInList[j] = wVar;               // добавляем в ассоциатвный массив из переменных целевого списка
          j=j+1;

        } 
      }
      else  {var errorMsg="Невозможно определить, какая таблица соответствует переменной " + wVar; break;}

    }

    var srcQueryBody = this.query_body.trim();
    var w1 = srcQueryBody.replace(/\(/, "");
    var w2 = srcQueryBody.replace(/\)/, "");
     if (w1.length != w2.length) {
       reject(new Error("Проверьте парность КРУГЛЫХ скобок !"));
    }

    // scrQueryBody.DoQuote(scrQueryBody);
    // // scrQueryBody.K_Prepare(scrQueryBody);
    // scrQueryBody = scrQueryBody.replace("~", " ");
    sql = "SELECT DISTINCT " + this.target_list + " FROM ";

    var i=0;
    q = wVarInList[i];

    while (i < j-1){
            
            sql = sql + inTables[q]+', ';
            i = i + 1;
            q = wVarInList[i];
        }
      // q = wVarInList[i];
      sql = sql + inTables[q] + '\n' + '  WHERE ';


  var qtyFORALL=0;
  posFORALL = srcQueryBody.search(/FORALL/);
  while ( posFORALL >= 0){
       
       
      srcQueryBody =  srcQueryBody.substring(0, posFORALL) + "NOT EXISTS " + srcQueryBody.charAt(posFORALL + 7) + " NOT (" + srcQueryBody.substring(posFORALL + 10);
      srcQueryBody = srcQueryBody.replace(/NOT \(NOT /, '(');
        // console.log('ПЕРЕМЕННАЯ КВАНТОРА  wVarTable', wVarTable);
       qtyFORALL = qtyFORALL + 1;
        // console.log('ПОСЛЕ ОБРАБОТКИ', wVarTable);
        posFORALL = srcQueryBody.indexOf("FORALL");
   }


  if (qtyFORALL == 1){
    srcQueryBody = srcQueryBody.replace(/NOT \(/, '(NOT (') + ")";
  } else{
    srcQueryBody = srcQueryBody.replace(/NOT \(/, '(NOT (');
  }

  posIMPLY = srcQueryBody.search(/IMPLY/);
  if (posIMPLY > 0){
    var w = srcQueryBody.indexOf("NOT (");
    srcQueryBody = srcQueryBody.substring(0, w) + srcQueryBody.substring( w + 5);
    srcQueryBody = srcQueryBody.replace(/IMPLY/, 'AND NOT');
  }

  qtyOpenBracket = srcQueryBody.length - (srcQueryBody.replace(/\(/g, "")).length;
  qtyCloseBracket = srcQueryBody.length - (srcQueryBody.replace(/\)/g, "")).length;

  if (qtyOpenBracket != qtyCloseBracket){
    srcQueryBody = srcQueryBody.slice(0,-1);
  }

  while ( srcQueryBody.search(/EXISTS/)  >= 0){
        posEXISTS = srcQueryBody.indexOf("EXISTS");
        wVarTable = srcQueryBody.charAt(posEXISTS + 7);
        w = inTables[wVarTable] ;
        // console.log('ПЕРЕМЕННАЯ КВАНТОРА  wVarTable', wVarTable);
        sql = sql + srcQueryBody.substring( 0, posEXISTS + 6) + "\n" + "(SELECT * FROM " +  w + "\n" + "    WHERE ";
       
  
        srcQueryBody = srcQueryBody.substring(posEXISTS + 10);
        // console.log('ПОСЛЕ ОБРАБОТКИ', wVarTable);
        
   }

    sql = sql + srcQueryBody + ";";
  
    sql = sql.replace("^", ".")

    sql = sql.replace(/\"/g, "'");
    this.sql = sql;
    resolve();
        
        // reject("failure reason");
  }.bind(this));
};


module.exports = TupleCalculusQuery;