
let myAdd: (x: number, y: number) => number = function(x: number, y: number): number { return x + y; };


// myAdd1类型推论
let myAdd1 = function(x: number, y: number): number { return x + y; };




function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
  }
  
  let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
  