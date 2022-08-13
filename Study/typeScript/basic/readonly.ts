let a: number[] = [1, 2, 3, 4];
let ro: ReadonlyArray<number> = a;

// ro[1] = 2

// a = ro;
a = ro as number[]; //类型断言重写