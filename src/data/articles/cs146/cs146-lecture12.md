# CS 146 Lecture 12 Notes

February 11, 2025

Recall from [Lecture 11](./cs146-lecture11) that the name of an array stands for a pointer to its first item. So for example, `myArray[]` becomes `&myArray[0]`. Meaning that this passes a pointer, not a full array into the function. That is why you must also pass in the size of the array into the function as well when you pass it as a parameter.

```c
int sum(int arr[], int size) { // size is not part of the type
	int res = 0;
	for (int i = 0; i < size; i++) {
		res += arr[i];
	}
	return res;
}
```

> Similar to how Java functions, the name of the array is a reference to the location of where the first element of the array is.

Also note that sum is expected an array, not a pointer. So why not write it as:

```c
int sum(int *arr, int size);
```

You can write it as such. Both `*arr` and `arr[]` are identical in parameter declarations. So then the code becomes:

```c
int sum(int *arr, int size) { // size is not part of the type
	int res = 0;
	for (int i = 0; i < size; i++) {
		res += arr[i];
	}
	return res;
}
```

Note that we are still using array notation on a pointer. This is allowed, and this is a perfectly valid way of writing the program. This becomes possible due to a concept called **pointer arithmetic**.

## Pointer Arithmetic

Let t be a type. So `t arr[10]`. We know `sizeof(arr) = 10 * sizeof(t)`; `arr` is equivalent to (≡) `&arr[0]`; `*arr` ≡ `arr[0]`. Well then, what expression produces a pointer to `arr[1]`? Well then, `arr + 1` ≡ `$arr[1]`, and `arr + 2` ≡ `&arr[2]`. Numerically, `arr + n` produces the address equal to `arr + n * sizeof(t)`.

> **Remark:**
> If `arr + k` ≡ `&arr[k]`, then `*(arr + k)` ≡ `arr[k]`.

Thus, sum is equivalent to:

```c
int sum(int *arr, int size) { // size is not part of the type
	int res = 0;
	for (int i = 0; i < size; i++) {
		res += *(arr + i);
	}
	return res;
}
```

> **Remark:**
> In fact, `a[i]` is defined as `*(a + i)`. So the following holds:
> `a[i] `≡ `*(a + i)` ≡ `*(i + a)` ≡ `i[a]`.

```c
int sum(int *arr, int size) { // size is not part of the type
	int res = 0;
	for (int *cur = arr; cur < arr + size; ++cur) {
		res += *cur;
	}
	return res;
}
```

Something like the above concept will show up in CS 246, so it might be good to understand it.

Any pointer can be thought of pointing to the beginning of an array. We also observed there is the same syntax for accessing items through an array as through a pointer. The following question follows:

> Q: So are arrays and pointers the same thing?
> A: **No**.

For this function:

```c
void f(int arr[]) {
	printf("%zd\n", sizeof(arr));
}

int main() {
	int myArray[10];
	printf("%d\n", sizeof(myArray));
	f(myArray);
}

// OUTPUT
// 40 - size of the array
// 8  - size of a pointer to the array
```

They print out different things because they are different things in memory. In the main functions print, it prints out the size of the entire array, but in the f function, it only prints out the size of the pointer to where the array is stored.

From the compiler: the following steps happen for `myArray[i]`

1. Fetch `myArray` location in environment.
2. Add `i * sizeof(int)`.
3. Fetch into this address from RAM.

But the following steps happen for `arr[i]`:

1. Fetch `arr` location in environment.
2. Fetch `myArray` address from RAM.
3. Add `i * sizeof(int)`.
4. Fetch value from RAM.

So, `myArray[i]` and `arr[i]` look the same, but do slightly different things.

We saw that a Racket struct `(struct posn (x y))` is like a C struct whose fields are pointers. Recall the Racket struct boxes its contents from [Lecture 8](./cs146-lecture8). Well, how can we achieve this in C?

```c
struct Posn {
	int *x;
	int *y;
};

int main() {
	struct Posn p;
	*p.x = 3;
	*p.y = 4;
}
```

There is a high possibility that this program will crash. If you look closely, you can see that `p.x `and `p.y` are uninitialized pointers. Thus, they can be pointing to any arbitrary location dictated by what values they already hold.

So for `(posn 3 4)` in Racket, DrRacket must be reserving memory for x and y to point at to hold the 3 and 4. So now we need to do the same in C. To achieve this, `#include <stdlib.h>` is needed.

```c
#include <stdlib.h>
struct Posn makePosn(int x, int y) {
	struct Posn p;
	p.x = malloc(sizeof(int));
	p.y = malloc(sizeof(int));
	*p.x = x;
	*p.y = y;
	return p;
}
```

> **Remark:**
> Note that malloc(n) just requests n bytes of memory. It can be read as memory allocate.

```c
int main() {
	struct Posn p = makePosn(3, 4);
}
```

Now the code works. But what exactly is happening?

## Memory layout

This applies to both C and Racket.

```txt
RAM:
._________________________________________________
|              |
|    code      |    Your program's binary code
|______________|___________________________________
|              |
|    static    |
|______________|
|              |
|     heap     |    Your program's data
|______________|
|              |
|    stack     |
|______________|___________________________________

```

In the static area, it is where global/static variables are stored. The lifetime of this memory is throughout the entire program.

In the stack area, it is storing a stack, which is essentially an _Abstract Data Type (ADT)_ with _Last In First Out (LIFO)_ semantics. Thus, it can only remove the most recently inserted item. Operations for stack include:

1. Push - add an item to the stack.
2. Top - the most recently inserted item.
3. Pop - Remove the most recently inserted item.
4. Empty? - Is the stack empty?

> Notice that we were working with stacks the entire time. Racket lists are stacks.

In Racket, the list operations correspond to the stack operations:

1. Push - cons
2. Pop - rest
3. Top - first
4. Empty? - empty?

Now let us program something using stack, where it stores local variables.

```c
int fact(int n) {
	int rec = 0;
	if (n == 0) {
		return 1;
	}
	rec = fact(n - 1);
	return n * rec;
}

int main() {
	int f = fact(3);
	printf("%d\n%", f);
	return 0;
}
```

Now this becomes:

```txt
________________    <- stack pointer
| rec: 0       |
| n: 0         |
| ret : 1      |
|______________|
| rec: 0       |
| n: 1         |
| ret : fact   |
|______________|
| rec: 0       |
| n: 3         |
| ret : fact   |
|______________|
| rec: 0       |
| n: 3         |
| ret : fact   |
|______________|
| f: 6         |
|______________|
```

> **Remark:**
> When the program is called, it goes bottom up, then it returns top to bottom.

Each function call gets a stack frame.

-   Local vars are pushed onto the stack.
-   Also return address are pushed - where to go when the function returns.
-   Each invocation of the function gets its own version of the local variables.

When a function returns, its stack frame is popped.

-   All local variables in that frame are released.
-   Albeit the local variables are not typically erased.

The lifetime of the variables in the stack frame is the lifetime of the function itself. When the function ends, the variables life ends.

So what if we have data that must persist after a function returns?

```c
struct Posn makePosn(int x, int y) {
	struct Posn p;
	int a = x;
	int b = y;
	p.x = &a;
	p.y = &b;
	return p;
}
```

This is very bad. This function does not work.

```txt
.______________.
|   makePosn   |
|______________|
| p (x)        |
| p (y)        |
| x 3          |
| y 4          |
| a 3          |
| b 4          |
|______________|
|              |
|   ...        |
|______________|
|     main     |
|______________|
| p            |
|______________|
```

becomes when returned:

```txt
.______________.
|   makePosn   |
|______________|
| p (x)        |
| p (y)        |
| x 3          |
| y 4          |  killed after function ends
| a 3          |
| b 4          |
|______________|
|   other      |
|   ...        |
|______________|
|     main     |
|______________|
| p (x)        |
| p (y)        |
|______________|
```

This returned p that contains pointers to local stack-allocated data. Do not do this. The `x` and `y` (also the `a` and `b`) will not survive past the end of `makePosn`.

Well, `malloc` basically just requests memory from the heap. The heap is just a pool of memory from which you explicitly request chunks. The lifetime of stack memory is until the variable's scope ends (the end of a function). However, the lifetime of a heap memory is arbitrary.
