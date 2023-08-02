if(true) {
    // var message = 1;
    var message = 'matt';
    console.log(message); // matt
}

console.log(message);  // matt






 
// function foo() {
//     var age = 12;
//     console.log(age);
// }

// console.log(age); // ReferenceError: age is not defined



for(var i = 0; i < 5; i++) {
    console.log(i);
    setTimeout(()=> {
        console.log(i);
    },0);
}