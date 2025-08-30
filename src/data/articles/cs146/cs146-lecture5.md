# CS 146 Lecture 5 Notes

January 21, 2025

I missed my usual section of this lecture, so there may be some discontinuities between sections.

## Continued from [Lecture 4](./cs146-lecture4)
Now, lets talk about merging/combining binary files (different compiled C files). Recall the `printf` function from last lecture. When the `printf` code, or more specifically the `stdio.h` file was compiled, it was stored and put into another "standard place" like `/usr/lib`. Now that binary must be combined with our own code. This process is called **linking**. The linking step is processed by a tool called the linker. The linker will run automatically and it "knows" to link the code for printf. If you write your own modules, you will have to tell the linker about them.

## The C Language
### Compiling in C
`hello.c`:

```c
#include <stdio.h>

int main() {
	printf("Hello, world!\n");
	return 15;
}
```

To compile, run:

```bash
gcc -std=c99 -Wall hello.c
```
- `-std`: Version of C to compile with.
- `-Wall`: Warnings mean that there could be a mistake in the code.
- `-o name`: Give the output file a name. If not specified, default is `a.out`.
- `hello.c` It is the file we are compiling.
When this is run, all the preprocessor and compiling is done in one singular step. When no output file is specified, it will output to a file `a.out`. To then run this file, you run `./a.out` or run `./file_name` if a file name is specified. Then if we want to check the output code, we can do `echo $?`.

### Variables

```c
int f(int x, int y) {
	int z = x + y;
	int w = z;
	return z / w;
}
```

### Input
There is no such function `(read)` in C. Instead we will start from the most basic reading function from Racket, and see the alternative in C. Starting with `(read-char)`.

```c
#include <stdio.h>
int charRead() {
	char c = getchar(); // getchar() = (read)
	return c;
}
// But then how would we read in a number? 
int getIntHelper(int acc) {
	char c = getchar();
	if(c >= '0' && c <= '9') {
		return getIntHelper(acc * 10 + (c - '0')); // c - '0' = num
	} else {
		return acc;
	}
}

int getInt() {
	return getIntHelper(0);
}
// OR with ternary operators
int getIntHelper2(int acc) {
	char c = getchar();
	return (c >= '0' && c <= '9') ? getIntHelper(acc + 10 + c - '0') : acc
}

int getInt() {
	return getIntHelper2(0);
}

int main() {
	printf("1: %d\n 2: ", getInt(), getInt2())
	return 0;
}
```

Note that blocks can take the place of statements sometimes such as in the if statement. It is recommended to use blocks to prevent the following example.

```c
if(test1)
	if(test2)
		stmt1;
else 
	stmt2;
```

Which `if` does the `else` belong to? It in fact does not belong to the first `if`, it is the second. The way the code is interpreted would be:

```c
if(test1) {
	if(test2) {
		stmt1;
	} else {
		stmt2;
	}
}
```

### Conditional operator - `?:`
`if-else` is a statement, but `?:` creates an expression. `a?b:c` has value `b` if `a` is true and has value `c` if `a` is false. Not that there is no built-in boolean type in C. In reality, 0 means false, and 1 means true. Thus 0 and 1 can take the place of false and true respectively. Note that any number not 0 can represent true. The `bool` type and constants `true`/`false` are found in the `stdbool.h` header file.

### Characters
It is an even further restricted form of integer. Typically an int is 32 bits 2^32 integers (~4x10^9 distinct values). A char is 8 bits, or 256 distinct values. Note that the '0' (character zero) is numerically 48. Thus when `char c = '0';` is written in C, it is equivalent to `char c = 48;`. This leads to the next point where everything in memory is numbers. So each character must have a numeric code that corresponds to it. Thus, there is an old code called `ASCII`. This is a 7 bit code for transcribing integers from 0 to 127. Another code for information interchange from the time is `EBCDIC` - Encoded Binary Coded Decimal Interchange Code, and it is much less used than `ASCII` now. However, `Unicode` for the most part has taken over `ASCII` as it is also backwards compatible with `ASCII` code.

### A Second Look at `getchar()`
The prototype for `getchar` is really `int getchar();` Why is it returning an `int` if it is supposed to produce a `char`? Well, what if there is no character, but rather an `End-of-File` object.
