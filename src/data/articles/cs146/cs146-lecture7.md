# CS 146 Lecture 7 Notes

January 28, 2025

Continuation of the end of [Lecture 6](./cs146-lecture6). Recall the `=` (assignment) operator.

## Assignment

It is usually best to use assignment only as a statement. Can leave variables uninitialized and assign them later. However, this is generally not a good idea, only do this with a good reason. This is due to when a variable is initialized, it returns a memory location to the program, and whatever is previously stored at the memory location will be stored in the variable that is initialized. In other words, the value of an uninitialized variable is not defined.

```c
// example
int main()
{
	int x;
	x = 4;
	// example of why this is bad
	int y;
	if(y == 0) {
		printf("hello"); // will this run?
	}
}

```

## Global Variables

Recall in Racket, we often made use of global variables. The entirety of 135/145 was almost written with code making use of global variables.

```c
int c = 0; // global variable
int f() {
	int d = c;
	c++;
	return d;
}

int main() {
	printf("%d\n", f());
	printf("%d\n", f());
	printf("%d\n", f());
	printf("%d\n", f());
}

/*
OUTPUTS
0
1
2
3
*/
```

This may not be always ideal as if you consider the case of combining all of the `printf()` into 1 line, the order evaluation is not specified. This is due to the order of argument evaluation is unspecified in the C language. Thus, do not write code that depends on this order.

```c
int main() {
	printf("%d\n%d\n%d\n%d\n", f(), f() , f(), f());
	// This could produce any order of 1 2 3 4
}
```

As we saw in Racket, we can interfere with `f()` by mutating `c`. Can we protect `c` from access by functions other than `f()`.

```c
int f() {
	// think of this like a global variable that only f can see.
	static int c = 0;

	int d = c;
	c += 1;
	return d;
}
```

## Repetition

Tail recursion is just repetition.

```c
void sayHiNTimes(int n) {
	if (n > 0) {
		printf("Hi!\n");
		sayHiNTimes(n - 1); // tail recursion
	}
}
```

The above function is expressed more idiomatically (idiom: "it's raining cats and dogs") as:

```c
void sayHiNTimes(int n) {
	while (n > 0) {
		printf("Hi!\n");
		n -= 1;
	}
}
```

This is a loop in C. A loop is where the body of the loop function is executed repeatedly as long as the condition remains true. In this case, the condition is `n > 0`.

Although it may be weird to see a loop as a tail recursive function, when coming from Racket, it makes intuitive sense. In general:

```c
void f(int c) {
	if (/* cont c */) {
		/* body c */
		f(/* update c */);
	}
}
// then becomes
void f(int c) {
	while (/* cont c */) {
		/* body c */
		c = /* update c */;
	}
}
```

Note that `f()` may not need to become it's own function anymore if it is only used once. This extension can even be extended to functions with accumulators.

```c
int f(int c, int acc) {
	if(cont(c)) {
		body(c);
		return f(update(c), update2(acc));
	}
	return g(acc);
}
// then becomes
int f(int c, int acc) {
	int acc = acc0;
	while(cont(c)) {
		body(c);
		acc = update2(acc));
		c = update(c);
	}
	acc = g(acc);
}

```

Example: Recall an early version of the getInt() function from [Lecture 5](./cs146-lecture5).

```c
int getIntHelper(int acc) {
	char c = getchar();
	if(isdigit(c)) {
		return getIntHelper(10 * acc + c - '0');
	}
	return acc;
}
int getInt() {
	return getIntHelper(0);
}
// becomes
int getInt() {
	int acc = 0;
	char c = getchar();
	while(isdigit(c)) {
		acc = 10 * acc + c - '0';
		c = getchar();
	}
	return acc;
}
```

There are some common patterns when switching to a loop. The structure goes:

1. (initialize variables)
2. while (condition)
   1. (body)
   2. update variables
3. return value
   An alternative format can also be:
4. for (init; condition; update) 1. body
   The meaning is the same as the while loop and the for loops is preferred over the while loop. We shall write the `getInt()` function again, but now with `for`.

```c
int getInt() {
	int acc = 0;
	for (char c = getchar(); isdigit(c); c = getchar()) {
		acc = 10 * acc + c - '0';
	}
	return acc;
}
```

Notice that this version of the function is the shortest and simplest yet. Notice that you can also declare and initialize variables in the first part of the `for` loop. If you want to be a disgusting human, then you can write:

```c
int getInt() {
	int acc = 0;
	for(char c=getchar(); isdigit(c); acc=10*acc+c-'0', c=getchar());
	return acc;
}
// note the usage of the comma operator
//not to be mistaken with the comma argument seperator
```

Then if we don't want to discard the last character, recall the `peekchar()` version from [Lecture 6](./cs146-lecture6).

```c
int getInt2() {
	int acc = 0;
	for(char c=peekchar(); isdigit(c); acc=10*acc+getchar()-'0', c=peekchar());
	return acc;
}

int getInt3() {
	for(char c = peekchar(); isdigit(c); c = (getchar(), peekchar())) {
		acc = 10 * acc + c - '0';
	}
}
```

### More on global data

Global variables such as `int i = 0;` creates hidden dependencies. However, constants are still useful like in Racket. In CS 145, global variables were encouraged because the variables / definitions were constant. Thus, in C, global variables are good if they are constant. Good news is that you can force variables to be constant in c by stating `const int PASSING_GRADE = 50;`. The variable `PASSING_GRADE` then cannot be mutated.
