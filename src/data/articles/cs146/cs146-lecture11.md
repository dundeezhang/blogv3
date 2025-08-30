# CS 146 Lecture 11 Notes

February 6, 2025

> The fire alarm went off this morning before class. We are starting 25 minutes late. I guess we lost our lead over the other section.

## Vectors Continued

Recall vectors from [Lecture 10](./cs146-lecture10). Specifically `vector-ref` and `vector-set!` run in O(1) time. However, you give up the variable size of lists and makes adding/removing elements more difficult. Consequently, this encourages more an imperative style of code.

We will now try to build our own vector function.

```scheme
(define (my-build-vector n f)
	(define res (make-vector n))
	(define (mbv-h i)
		(cond [(equal? i n) res]
			  [else (vector-set! res i (f i))
			        (mbv-h (add1 i))]))
	(mbv-h 0))
```

If you accept that vectors work well with an imperative style, you can further accept that this is essentially a repetitive algorithm that involves mutation. It is not difficult to think like this is a loop.

Thus, there exists macros in Racket such as `for` and `for/vector` can help with this vision.

```scheme
(define (my-build-vector n f)
	(define res (make-vector n))
	(for ([i n])
		 (vector-set! res i (f i)))
	res)
```

Or with `for/vector`:

```scheme
(define (my-build-vector n f)
	(for/vector [(i n)] (f i)))
```

Another example: Let's sum the elements of a vector.

```scheme
(define (sum-vector vec)
	(define (sv-h i acc)
		(cond
			[(equal? i (vector-length vec)) acc]
			[else (sv-h (add1 i) (+ acc (vector-ref vec i)))]))
	(sv-h 0 0))
```

Note again, this is very loop-like again. Now, if we used the template first approach from CS 135, we can rewrite this again.

```scheme
(define (sum-vector vec)
	(define sum 0)
	(for [(i (vector-length vec))]
		(set! sum (+ sum (vector-ref vec i))))
	sum)
```

This is not pure functional programming since it uses `set!`. However, this looks pure functional since the use of mutation is confined to variables inside the function. Thus, outsiders could consider it pure functional. This provides a strategy for keeping the problems with mutation under control by hiding it behind a pure functional interface.

Continue to recall the memory and vector model from [Lecture 10](./cs146-lecture10) and [Lecture 2](./cs146-lecture2). Well how does this work?

Recall: mutate-posn.

```scheme
(define (mutate-posn p)
	(set-posn-x! p (add1 (posn-x p))))
(define p (posn 3 4))
(mutate-posn p)
(posn-x p) ;; results in 4
```

But in the C alternative,

```c
void mutate(struct Posn p)
{
	p.x += 1;
}

int main()
{
	struct posn p {3, 4};
	mutate(p);
	printf("%d\n", p.x);
	// results in 3
}
```

We can see that the same code produces different results in these languages. Racket structs are not like C structs. The struct is copied, but changes to the fields persist when passed. Thus, the fields of a Racket struct are boxed, meaning they're pointers. Similarly, the items in a Racket vector are addresses that point to the actual contents (which can then be any size). Even more so, the fields of a cons are pointers.

```scheme
(cons 1 (cons 'blue (cons true empty)))
```

Recall the box-and-pointer cons diagram from the stepper questions in CS 145. Each cons is a 2 box model where the first box points to a value, and the second box points to another cons or empty.

Also, since Racket is dynamically typed (which allows different types to be contained in the same list), the values `1`, `'blue`, `true` must also include type information.

## Vectors in C-Arrays

An array is a sequence of consecutive memory locations.

```c
int main() {
	int grades[10];
	for (int i = 0; i < 10; i++) {
		printf("%d\n", &grades[i]);
	}
	int acc = 0;
	for (int i = 0; i < 10; i++) {
		acc += grades[i];
	}
	printf("Grades: %d\n", acc / 10);
}
```

Now we breakdown this code:

-   `a[i]`: Accesses the ith element of the array.
-   `int grades[10]`: Valid entries are `grades[0] ... grades[9]`.
    -   When you go out of bounds, it has undefined behaviour.
    -   This will have a non-zero chance of crashing your program, meaning that if it does not crash, it will corrupt your other data.

Now, you can give the bound implicitly.

```c
int main() {
	int grades[] = {0, 0, 0, 0, 0};
	// makes an array of size 5
	printf("Size of array: %zd\n", sizeof(grades) / sizeof(int));
}
```

Now what is `sizeof()`: This is evaluated at compile time, meaning that the compiler will turn it into what it means. It turns `sizeof()` into the amount of memory the passed in value occupies. Thus, `sizeof(grades)` would 20 bytes typically, and `sizeof(int)` would be 4 bytes. Thus, this program would result in 5, the size of the array. Note that `%zd` prints out a size_t in decimal, and size_t is the type that holds the size of memory.

Now, we can try passing arrays into functions.

```c
int sum(int arr[], int size) { // size is not part of the type
	int res = 0;
	for (int i = 0; i < size; i++) {
		res += arr[i];
	}
	return res;
}
```

Note that passing arrays by value is very expensive since you have to copy the entire array into the function. C will not do this.

Now if you call this function in main,

```c
int main() {
	int myArray[100];
	...
	int total = sum(myArray, 100);
	// how is this not a copy?
}
```

Now how is the `myArray` that is passed into `sum()` not a copy? Well, the name of an array is shorthand for a pointer to its first element. This is the most confusing rule in C according to Brad Lushman.
