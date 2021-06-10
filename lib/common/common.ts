/* lib/common/common - A collection of tools available to any environment. */

const common:module_common = {

    // capitalizes a string
    capitalize: function common_capitalize(input:string):string {
        return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    },

    // takes a number returns a string of that number with commas separating segments of 3 digits
    commas:  function common_commas(number:number):string {
        const str:string = String(number);
        let arr:string[] = [],
            a:number   = str.length;
        if (a < 4) {
            return str;
        }
        arr = String(number).split("");
        a   = arr.length;
        do {
            a      = a - 3;
            arr[a] = "," + arr[a];
        } while (a > 3);
        return arr.join("");
    },

    // takes a number returns something like 1.2MB for file size
    prettyBytes: function common_prettyBytes(an_integer:number):string {
        //find the string length of input and divide into triplets
        let output:string = "",
            length:number  = an_integer
                .toString()
                .length;
        const triples:number = (function terminal_common_prettyBytes_triples():number {
                if (length < 22) {
                    return Math.floor((length - 1) / 3);
                }
                //it seems the maximum supported length of integer is 22
                return 8;
            }()),
            //each triplet is worth an exponent of 1024 (2 ^ 10)
            power:number   = (function terminal_common_prettyBytes_power():number {
                let a = triples - 1,
                    b = 1024;
                if (triples === 0) {
                    return 0;
                }
                if (triples === 1) {
                    return 1024;
                }
                do {
                    b = b * 1024;
                    a = a - 1;
                } while (a > 0);
                return b;
            }()),
            //kilobytes, megabytes, and so forth...
            unit    = [
                "",
                "KB",
                "MB",
                "GB",
                "TB",
                "PB",
                "EB",
                "ZB",
                "YB"
            ];
    
        if (typeof an_integer !== "number" || Number.isNaN(an_integer) === true || an_integer < 0 || an_integer % 1 > 0) {
            //input not a positive integer
            output = "0B";
        } else if (triples === 0) {
            //input less than 1000
            output = `${an_integer}B`;
        } else {
            //for input greater than 999
            length = Math.floor((an_integer / power) * 100) / 100;
            output = length.toFixed(1) + unit[triples];
        }
        return output;
    }

};

export default common;