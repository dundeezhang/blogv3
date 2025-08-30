# CS 146 Lecture 13 Notes

February 12, 2025

Recall the bad code from [Lecture 12](./cs146-lecture12).

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

Remember that was a poor version of a version that does work:

```c
struct Posn makePosn(int x, int y) {
	struct Posn p;
	p.x = malloc(sizeof(int));
	p.y = malloc(sizeof(int));
	*p.x = x;
	*p.y = y;
	return p;
}

int main() {
	struct Posn p = makePosn(3 ,4);
}
```

When `makePosn` returns, `p`, which includes `p.x` and `p.y` is popped out of the stack so it is no longer live, but the `3` and the `4` on the heap are still live. Then `p` from `makePosn` is copied back to main's frame, and main has access to `3` and `4` on the heap. So these values outlive `makePosn`.

> **Remark**:
> Q: What is the lifetime of allocated data in the heap?
> A: It is arbitrarily long.

Well, if the heap allocated data never goes away, since RAM is a finite resource, the program will eventually run out of memory, even though most of the data in memory is probably no longer in use. In Racket, a run-time process detects memory that is no longer accessibly and frees it up.

```scheme
(define (f x)
	(let ((p (posn 3 4)))
	...
	(+ x 1))
```

After `f` returns, the memory is no long accessible, so Racket automatically reclaims it. This process is called **garbage collection**. Note that in C, there is no automatic garbage collection. In C, heap memory is freed when you free it.

```c
int *p = malloc(...);
...
free(p); // this frees memory
```

Failing to free all allocated memory in C is called a memory leak. Overtime, a memory leak is going to cause the program to fail. In C, you are expected to write programs that do not leak.

```c
int *p = malloc(sizeof(int));
free(p);
*p = 7;
```

Notice that when you use the variable after `free()`, it is undefined behaviour. So this program may crash, but it is unlikely. We also know that `free(p)` does not change `p`, since `free()` is a function and `p` was passed in by value, so `p` still points to that memory address. Thus, it is still likely the program will still work as desired. But then, since p is not pointing to a valid location, another pointer may be assigned to that location through a `malloc` call, which is called a **dangling pointer**.

A better discipline after freeing p, would to be assign p to a guaranteed _invalid_ location.

```c
int *p = malloc(sizeof(int));
free(p);
p = NULL;
```

The `NULL` pointer points to nothing. Formally speaking, `NULL` is not even part of the C language. This is defined as a constant equal to 0, so we could equally say `p = 0`.

Well, what if you dereference `NULL`. Good news, it is undefined behaviour. So it might crash. So, never return a pointer to a local variable since that is also undefined behaviour. If you do want to return a pointer, it should point to static, heap or non-local stack data.
