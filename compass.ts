export interface PathParams{
    [key:string]:string;
}

export interface PathDirection{
    path_params: PathParams;
    matched_pattern:string;
}

export class Compass {
    private path_tree:any ={};

    /**
     * use to define new paths, to later find them with find function.
     * 
     * you can use path params with a colon. Only simple path patterns supported.
     * @param path_pattern 
     */
    define(path_pattern: string){
        
        const parts = path_pattern.split("/");


        //this happens when path starts with '/', which creates a blank string, we will simply remove it
        while(parts[0]===""){
            parts.shift();
        }

        //First key wll be number of parts
        if(!this.path_tree[parts.length]){
            this.path_tree[parts.length]={
            };
        }
        let s=this.path_tree[parts.length];//start node
        let c=0;
        for(let p of parts){
            const isPlain = !(p.startsWith(":"));
            
            let t : any; //type

            if(isPlain){
                t=s.plain;
            }else{
                t=s.parameterized;
                p=p.slice(1);
            }
            
            if(!t){
                if(isPlain){
                    s.plain={};
                    t=s.plain;
                }else{
                    s.parameterized={};
                    t=s.parameterized;
                }
            }

            const v = t[p];//value
            const value_type=typeof v;
            if(value_type === "string"){
                return;
            }else if(value_type === "undefined"){
                if(parts.length-1===c){
                    //is last element;
                    t[p]=path_pattern;
                    return;
                }else{
                    t[p]={};
                    s=t[p];
                }
            }else{
                s=t[p];
            }
            c++;
        }
    }

    /**
     * Used to find the defined path, if not found it simply returns undefined.
     * 
     * if found the result object has two keys path_params object containing 
     * path parameter and their value, and a matched_pattern key, which signify
     * which path it has matched against
     * @param url_path 
     */
    find(url_path: string):PathDirection|undefined{
        const parts = url_path.split("/");


        //this happens when path starts with '/', which creates a blank string,
        // we will simply remove it
        while(parts[0]===""){
            parts.shift();
        }
        if(parts.length==0){
            return {path_params:{},matched_pattern:"/"};
        }
        let s = this.path_tree[parts.length];
        //no entry with the given length simply return
        if(!s){
            return;
        }else{
            let path_params:PathParams={};
            return this._find(0,parts,s, path_params);
        }
    }

    _find(d:number,parts:any[],s:any, path_params:PathParams):PathDirection|undefined{
        let p=parts[d];
        let t = s.plain?s.plain[p]:undefined;
        if(t){
            if(typeof t==='string'){
                if(d === parts.length-1){
                    return {path_params, matched_pattern:t};
                }else{
                    return;
                }
            }else{
                d++;
                return this._find(d,parts,t,path_params);
            }
        }else if(s.parameterized){
            for(let i of Object.keys(s.parameterized)){
                t= s.parameterized[i];
                path_params[i]=p;
                if(typeof t==='string'){
                    if(d===parts.length-1){
                        return {path_params, matched_pattern:t};
                    }else{
                        return;
                    }
                }else{
                    d++;
                    let z = this._find(d,parts,t,path_params);
                    if(z){
                        return z;
                    }else{
                        path_params={};
                        d--;
                    }
                }
            }
        }
    }
}

interface Probe{
    part:string;
    depth:number;
}

/**
 * path1: /name_of/:usrname/info
 * path2: /:docid/meta/:param_name
 * path3: /:pirates/of/:sea
{
    3:{
        parameterized:{
            "docid":{
                plain:{
                    meta:{
                        parameterized:{
                           "param_name":"/:docid/meta/:param_name" 
                        }
                    }
                }
            },
            "pirates":{
                plain:{
                    "of":{
                        parameterized:{
                            "sea": "/:pirates/of/:sea"
                        }
                    }
                }
            }
        },
        plain:{
            name_of:{
                parameterized:{
                    "usrname":{
                        plain:{
                            info: "/name_of/:usrname/info"
                        }
                    }
                }
            }
        }
    }
}
*/