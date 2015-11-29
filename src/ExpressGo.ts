///<reference path='typings/tsd.d.ts'/>
///<reference path='boot/Boot.ts'/>
///<reference path='boot/Loader.ts'/>

//import ClassTwo = module('./boot/Loader');
//import {Boot} from "./boot/Boot";

module ExpressGo
{
    import ClassTwo = Boot;

    export class Main
    {
        constructor( app : Express.Application )
        {
            console.log("ClassTwo", ClassTwo);
            console.log("Main ExpressGo");
            //new ClassTwo( app );
        }
    }
}

module.exports = ExpressGo;