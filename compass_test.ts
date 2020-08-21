import { Compass } from "./compass.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts"

Deno.test("Test define and find",()=>{
    let c = new Compass();
    c.define("/");
    c.define("/name_of/app/compass");
    c.define("/name_of/:usrname/info");
    c.define("/:docid/meta/:param_name");
    c.define("/name_of/department/:dep_code/info");

    //@ts-ignore
    assertEquals(c.path_tree,{
        0:{},
        3:{
            parameterized:{
                docid:{
                    plain:{
                        meta:{
                            parameterized:{
                                param_name: "/:docid/meta/:param_name"
                            }  
                        }
                    }
                }
            },
            plain:{
                name_of:{
                    parameterized:{
                        usrname:{
                            plain:{
                                info: "/name_of/:usrname/info"
                            }
                        } 
                    },
                    plain:{
                       app:{
                           plain:{
                               compass: "/name_of/app/compass"
                           }
                       }
                    }
                }
            }
        },
        4:{
            plain:{
                name_of:{
                    plain:{
                        department:{
                            parameterized:{
                                dep_code:{
                                    plain:{
                                        info:"/name_of/department/:dep_code/info"
                                    }
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

    let r1 = c.find("/name_of/anurag/info");
    console.log(r1);
    assertEquals(r1!==undefined, true);
    assertEquals(r1?.matched_pattern,"/name_of/:usrname/info");

    let r2 = c.find("123/meta/size");
    console.log(r2);
    assertEquals(r2!==undefined, true);
    assertEquals(r2?.matched_pattern,"/:docid/meta/:param_name");

    let r3 = c.find("/name_of/department/123/info");
    console.log(r3);
    assertEquals(r3!==undefined,true);
    assertEquals(r3?.matched_pattern,"/name_of/department/:dep_code/info");

    let r4=c.find("/path/not/defined");
    assertEquals(r4,undefined);
})