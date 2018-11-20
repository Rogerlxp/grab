interface ARGUMENTS {method: string;
    url:string;
    enctype?:string;
    data?:any;
    isAsync?:boolean;
    headers?:any;
    progressFn?:(xhr:XMLHttpRequest)=>void;
}
export default ARGUMENTS;