# CS 146 Lecture 10 Notes

February 5, 2025

> So now, tutorials are lectures. Yippee. Recall [Lecture 9](./cs146-lecture9) where we updated our substitution model.

```scheme
(define _v1 1)
lst2 = (cons 2 (cons _v1 empty))
lst3 = (cons 3 (cons _v1 empty))
```

Recall that the 'box' `_v1` is shared. But it is not just the box that is shared.

```scheme
(define lst2 (cons 2 lst1))
(define lst3 (cons 3 lst1))
```

In this example, `lst1` does not have a box in it it is just the list 1. But what if `lst1` has many many elements. In CS 145, it was given that the lists were defined in constant time. To achieve this, the entire tail is shared (`lst1`). Both occurrences of `lst1` refer to the same `lst1`, **not a copy**. So we need to rethink `define`.

```scheme
(define x 3) (set! x 7) x
=> (define x 7) (void) x
```

Define is not just replacing all occurrences of `x` with 3. Thus, we can say that x is not just a value, it is something we can mutate; something that we can access. `x` actually denotes a location, and the location contains the value. So, we do not actually just have 1 lookup; we have 2 lookups: We have the variable, which gives the location, and the location then gives the value. In general, it can visualized as:

```txt
variable -> location; then
location -> value
```

So, `set!` changes the `location -> value` map, but not the `variable -> location` map. Nothing changes the `variable -> location` map for now. Similarly, `set-box!` changes the `location -> value` map, and `define` creates a location and fills it with a value.

Next, in C, consider:

```c
int main() {
	int x = 1;
	int *y = &x;
	int *z = y;
	*y = 2;
	*z = 3;
	printf("%d %d %d\n", x, *y, *z);
}

// OUTPUT
// 3 3 3
```

Now why does this produce `3 3 3`. Well, `x` is initialized as 1. Then `y` is initialized to `x`'s address. So `y` points to the location where `x` resides. Now similarly, then `z` is initialized to be equal to `y`, which by extension is `x`'s address. Thus, when `y` or `z` is mutated, it is always going to mutate `x`'s value at it's address, which then is the value for all 3 variables. Thus, there is 3 different names for the same data. This process is called **aliasing**, meaning accessing the value by different names. Beware that this can be subtle.

```c
void f(int *x, int*y) {
	*y = *x + 1;
	if(*y == *x) {
		printf("How could this ever print?\n");
	}
}

int main() {
	int z = 1;
	f(&z, &z); // this will print
}
```

As you can see, aliasing makes programs very difficult to understand.

## Memory and Vectors

Recall that memory is a sequence of numbered "slots." Each slot (8 bits, one byte) is usually treated as part of a group of 4 (or 8). A **word** is 4 bytes in 32 bit machines and 8 bytes in 64 bit machines. Look back to [Lecture 2](./cs146-lecture2) for the visualization.

A new primitive data structure we can explore now is an _array_. An array is a "slice" of memory, which is a sequence of consecutive memory locations. This will be discussed in the future at length when we return to the C language.

In Racket (and Scheme), this also exists. In Racket, it is called a _vector_. It is used very much like a traditional array. However, unlike C arrays, Racket arrays can hold items of any size, meaning unlimited integers, strings, or anything you can imagine.

> But can it store your mom?

### Vectors in Racket

```scheme
(define x (vector 'blue 'true "you")) ;; not all same types
```

This is created in a C-like way, meaning the there is 2 parts of each element: the index, and the contents. However the width of the contents is unlimited.

```scheme
(define a (make-vector 100))
;; this will create a vector with a length of 100

(define b (make-vector 100 5))
;; this will create a vector with 100 5's

(define c (make-vector 100 sqr))
;; '#(0, 1, 4, 9, 16, 25 ... 99^2)

(vector-ref b 7)
;; => 5

(vector-set! b 42)
(vector-ref b 7)
;; => 42
```

The main advantage of vectors over lists is that `vector-ref`, and `vector-set!` run in O(1) time. The disadvantages of vectors is that they have a fixed size; it is difficult to add or remove elements; and `vector-set!` tends to force an imperative style.
