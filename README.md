# Compass
A very simple route detection library.\
![compass logo (image)](./logo.svg)

[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/compass)

Supports colon based path params, no regex matching [and hence very simple].


It can be used to define and find paths like:
```js
let c =  new Compass(); //no singleton, user can create a wrapper class over it if they want singleton behavior
c.define("/");
c.define("/name_of");
c.define("/name_of/app/compass");
c.define("/name_of/:usrname/info");
c.define("/:docid/meta/:param_name");
c.define("/name_of/department/:dep_code/info");

console.log(c.find("/"));
/*
 { path_params: {}, matched_pattern: "/", parent_matches: [] }
*/

console.log(c.find("/name_of/anurag/info"));
/*
{
  path_params: { usrname: "anurag" },
  matched_pattern: "/name_of/:usrname/info",
  parent_matches: [ "/", "/name_of" ]
}
*/

console.log(c.find("123/meta/size"));
/*
{
  path_params: { docid: "123", param_name: "size" },
  matched_pattern: "/:docid/meta/:param_name",
  parent_matches: [ "/" ]
}
*/

console.log(c.find("/name_of/department/123/info"));
/*
{
  path_params: { dep_code: "123" },
  matched_pattern: "/name_of/department/:dep_code/info",
  parent_matches: [ "/", "/name_of" ]
}
*/
```
