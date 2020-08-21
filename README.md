# Compass
A very simple route detection library.\
![compass logo](logo/logo.svg "Compass logo")


Supports colon based path params, no regex matching [and hence very simple].


It can be used to define and find paths like:
```js
let c =  new Compass(); //no singleton, user can create a wrapper class over it if they want singleton behavior
c.define("/name_of/app/compass");
c.define("/name_of/:usrname/info");
c.define("/:docid/meta/:param_name");
c.define("/name_of/department/:dep_code/info");

console.log(c.find("/name_of/anurag/info"));
/*
{
     path_params: { usrname: "anurag" }, 
     matched_pattern: "/name_of/:usrname/info" 
}
*/
console.log(c.find("/:docid/meta/:param_name"));
/*
{
  path_params: { docid: "123", param_name: "size" },
  matched_pattern: "/:docid/meta/:param_name"
}
*/


console.log(c.find("/name_of/department/:dep_code/info"));
/*
{
  path_params: { dep_code: "123" },
  matched_pattern: "/name_of/department/:dep_code/info"
}
*/
```
