import { Compass } from "./compass.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts"

Deno.test("Test define and find",()=>{
    let c = new Compass();
    c.define("/");
    c.define("/name_of");
    c.define("/name_of/app/compass");
    c.define("/name_of/:usrname/info");
    c.define("/:docid/meta/:param_name");
    c.define("/name_of/department/:dep_code/info");

    //@ts-ignore
    assertEquals(c.path_tree,{
        value: "/",
        parameterized:{
            docid:{
                plain:{
                    meta:{
                        parameterized:{
                            param_name: {value: "/:docid/meta/:param_name"}
                        }  
                    }
                }
            }
        },
        plain:{
            name_of:{
                value: "/name_of",
                parameterized:{
                    usrname:{
                        plain:{
                            info: {value: "/name_of/:usrname/info"}
                        }
                    } 
                },
                plain:{
                   app:{
                       plain:{
                           compass: {value: "/name_of/app/compass"}
                       }
                   },
                   department:{
                        parameterized:{
                            dep_code:{
                                plain:{
                                    info:{value:"/name_of/department/:dep_code/info"}
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    console.log("testing for paths");
    
    let r0 = c.find("/");
    console.log(r0);
    assertEquals(r0?.matched_pattern,"/");
    assertEquals(r0?.parent_matches,[]);

    let r1 = c.find("/name_of/anurag/info");
    console.log(r1);
    assertEquals(r1!==undefined, true);
    assertEquals(r1?.matched_pattern,"/name_of/:usrname/info");
    assertEquals(r1?.parent_matches,["/", "/name_of"]);

    let r2 = c.find("123/meta/size");
    console.log(r2);
    assertEquals(r2!==undefined, true);
    assertEquals(r2?.matched_pattern,"/:docid/meta/:param_name");
    assertEquals(r2?.parent_matches,["/"]);

    let r3 = c.find("/name_of/department/123/info");
    console.log(r3);
    assertEquals(r3!==undefined,true);
    assertEquals(r3?.matched_pattern,"/name_of/department/:dep_code/info");
    assertEquals(r3?.parent_matches,[ "/", "/name_of"]);

    let r4=c.find("/path/not/defined");
    assertEquals(r4,undefined);
})
