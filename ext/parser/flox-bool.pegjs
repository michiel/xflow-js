{
  function makeInteger(o) {
    return parseInt(o.join(""), 10);
  }
  function produceBoolean(left, op, right) {
    res = false;
    switch (op) {
      case '==':
      res = (left == right);
      break;
      case '!=':
      res = (left != right);
      break;
      case '>=':
      res = (left >= right);
      break;
      case '<=':
      res = (left <= right);
      break;
      case '>':
      res = (left > right);
      break;
      case '<':
      res = (left < right);
      break;
    }
    return res;
  }
  function addExpression(left, op, right) {
    res = 0;
    switch (op) {
      case '+':
      res = (left + right);
      break;
      case '-':
      res = (left - right);
      break;
    }
    return res;
  }
  function multExpression(left, op, right) {
    res = 0;
    switch (op) {
      case '*':
      res = (left * right);
      break;
      case '/':
      res = (left / right);
      break;
    }
    return res;
  }
}

expression
 = bool_expression

bool_expression
 = left:add_expression op:bool_operator right:bool_expression { return produceBoolean(left, op, right); }
 / add_expression

bool_operator
 = "=="
 / "!="
 / ">="
 / "<="
 / ">"
 / "<"

add_operator
 = "+"
 / "-"

mult_operator
 = "*"
 / "/"

add_expression
 = left:mult_expression op:add_operator right:add_expression { return addExpression(left, op, right); }
 / mult_expression

mult_expression
 = left:atom op:mult_operator right:mult_expression { return multExpression(left, op, right); }
 / atom

atom
 = string
 / real_number
 / integer
 / identifier

string
 = "'" [^']* "'"

identifier
 = [a-zA-Z_]+

integer
 = digits:[0-9]+ { return makeInteger(digits); }

real_number
 = integer "." integer?
 / "." integer
