// 类型别名

type Alias = (number | string) [];
let arr: Alias = [1, 2, '2']; 


interface IPerson {
    name: string,
    age: number,  
}

type APerson = number | string;

type Direction = 'left' | 'right' | 'up' | 'down';
function changeDirection(direction: Direction) {

}

changeDirection('up');