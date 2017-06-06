/*
 Language: SQL
 Contributors: Nikolay Lisienko <info@neor.ru>, Heiko August <post@auge8472.de>, Travis Odom <travis.a.odom@gmail.com>, Vadimtro <vadimtro@yahoo.com>, Benjamin Auder <benjamin.auder@gmail.com>
 Category: common
 */

function(hljs) {
  var COMMENT_MODE = hljs.COMMENT('--', '$');
  return {
    case_insensitive: true,
    //illegal: /[<>{}*#]/,
    keywords: {
      keyword:
        '[^\\[\\]\\.,\\+\\-<> \r\n]', /* t-x */
      built_in:
        "\\[ \\] AND \* * \\*",
      literal:
        '\\* true false nothing'
    },
    contains: [
      {
        className: 'string',
        begin: '\'', end: '\''
      }, 
      {
        className: 'string',
        begin: '\"', end: '\"'
      } 
    ]
  };
}
