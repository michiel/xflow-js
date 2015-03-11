{
  function makeInteger(o) {
    return parseInt(o.join(""), 10);
  }
}

expression
 = bool_expression

bool_expression
 = add_expression bool_operator bool_expression
 / add_expression

bool_operator
 = "=="
 / "!="
 / ">"
 / ">="
 / "<"
 / "<="

add_operator
 = "+"
 / "-"

mult_operator
 = "*"
 / "/"

add_expression
 = mult_expression add_operator add_expression
 / mult_expression

mult_expression
 = atom mult_operator mult_expression
 / atom

atom
 = function_call
 / string
 / real_number
 / integer
 / identifier

function_call
 = identifier "(" (expression ("," expression)*)? ")"

string
 = "'" [^']* "'"

identifier
 = [a-zA-Z_]+

integer
 = digits:[0-9]+ { return makeInteger(digits); }

real_number
 = integer "." integer?
 / "." integer
