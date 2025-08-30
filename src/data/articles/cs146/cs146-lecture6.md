# CS 146 Lecture 6 Notes

January 23, 2025

There may be a small disconnect from [last lecture's notes](./cs146-lecture5) since I am back to my original section now.

### The `getInt()` function

```c
int getIntHelper(int acc) {
	int c = peekchar();
	return isdigit(c) ? getIntHelper(10 * acc + getchar() - '0') : acc;
}
```

Note that this function is different that last classes, as c is a `peekchar()` so that it doesn't read 1 extra character. But this essentially call's `getchar()` twice per character. A version that doesn't call `getchar()` twice per character is provided below.

```c
int getIntHelper(int acc) {
	int c = getchar();
	return isdigit(c) ? 
	getIntHelper (10 * acc + c - '0') : 
	(ungetc(c, stdin), acc); // the comma evaluator
}
```

The comma evaluator is the same as `(begin)` in Racket, meaning that `a, b` would be evaluate `a`, then evaluate `b`, then return the value of `b`. 

What if there is whitespace before we reach the int?

```c
void skipws() { // a void function
	int c = getchar();
	if(isspace(c)) {
		skipws();
	} else {
		ungetc(c, stdin));
	}
}
```

This is a void function, it returns nothing. Unlike Racket, void is actually void. There are no void variables. Then, this asks the question, how do we return from a void function? To return from the void function, you either reach the end, or you `return;`.

```c
int getInt() {
	skipws();
	return getIntHelper(0);
}
```

Now we have finished our `getInt()` function.

## Mutation
Basic Mutation: `set!` (set-bang). The `!` means that there is side-effects, more specifically a mutation side-effect.

```scheme
(define x 3)
(set! x 4) ;; produces (void) - changes ∂
;; NOTE that x must be previously defined before using set!
;; now x = 4
```

Now what do we use this for?

```scheme
;; phone number looker upper
(lookup 'Dundee)
;; returns false
(add 'Dundee 7960)
(lookup 'Dundee)
;; returns 7960
```

This example is not possible in pure Racket. The same expression cannot produce different results in pure functional programs. Now, how do we implement this in impure Racket?

```scheme
(define address-book empty)

(define (add name number) 
  (set! address-book (cons (list name number) address-book)))

(define (lookup-helper name lst)
  (cond [(empty? lst) false]
	    [(equal? (first (first lst)) name) (second (first lst))]
	    [else (lookup name (rest lst))]))

(define (lookup name) (lookup-helper name address-book))
```

This is an example of global data, since the data, address-book can be accessed everywhere in the program. This type of data is good for defining constants to be used repeatedly, but it is *not* good for global data that will be mutated. Also keep in mind any part of the program can change the global variable, and that will change the entire program. From the use of global variables, there will be hidden dependencies among different parts of the program, and that makes it harder to reason about the program.

### Application: Memoization
There is a more primitive version of this called *caching*, which is saving the results of computation to avoid repeating it. *Memoization* is essentially systematic caching, meaning maintaining a list or table of cached values.

Consider the fibonacci function.

```scheme
(define (fib n)
  (cond [(zero? n) 0]
		[(= n 1) 1]
		[else (+ (fib (sub1 n)) (fib (- n 2)))]))
```

This is a very inefficient fibonacci function because recursive calls are repeated. Suppose you are to evaluate `(fib 100)` with this definition. Then it will evaluate `(fib 99) `and `(fib 98)`. To then evaluate `(fib 99)`, you need to evaluate `(fib 98)` and `(fib 97)`, and to evaluate `(fib 98)`, you need to evaluate `(fib 97)` and `(fib 96)`. Now you can see that there is repetition in the evaluations. To be specific, 
```
| Function      | Times Called  |
| ------------- | ------------- |
| (fib 100)     |       1       |
| (fib 99)      |       1       |
| (fib 98)      |       2       |
| (fib 97)      |       3       |
| (fib 96)      |       5       |
| (fib 95)      |       7       |
```

Now that the function's runtime is proportionate to the size of the sequence. So `(fib n)` is about 1.6^n. 

To avoid repetition, you keep an association list of pairs (n, Fn).

```scheme
(define fib-table empty)

(define (memo-fib n)
  (define return (assoc n fib-table))
  (cond [result => second]
        [else (define fib-n
                 (cond [(<= n 1) n]
                       [else (+ (memo-fib (sub1 n))
                                (memo-fib (- n 2)))]))
              (set! fib-table (cons (list n fib-n) fib-table))
              fib-n]))
```

Notes from `(memo-fib n)`
- `assoc`
	- It is a built in function for association list lookup.
	- `(assoc x lst)`: produces the pair (x y) from `lst`, or false if not found.
	- Any value can be used as a test
		- false is false; anything else is true
	- `(cond [x => f]`: if x passes (meaning it isn't false), produce `(f x)`.
	- Therefore, `(cond [result => second] ...` is equivalent to `(cond [(list? result) (second result)] ...`.

The calls to `(memo-fib n)` now happens only once. Now the next question is that can we hide `fib-table`, the global variable.

```scheme
(define memo-fib
  (local [(define fib-table empty)
          ;; the exact same memo-fib as before, but renamed
          (define (memo-fib-inner n) ...)]
         memo-fib-inner))
```

This code doesn't quite work for the address-book. In that case, two functions need access to it. It is left as an exercise to try to adapt this idea to work with multiple functions.

### Mutation in C
An operator would perform a mutation ("assignment operator").

```c
int main() {
	int x = 3;
	printf("%d\n", x);
	x = 4;
	printf("%d\n", x);
}

// OUTPUT
// 3
// 4
```

Note that `=` is an operator. This implies that `x = y` is an expression. This expression also has a value and an effect. The value `x = y` produces is that value `x` is assigned. Thus, the previous code can be rewritten to be more difficult to read.

```c
int main() {
	int x = 3;
	printf("%d\n", x);
	printf("%d\n", x = 4);
}

// OUTPUT
// 3
// 4

```

There are almost no advantages to this knowledge, where as there are many disadvantages. `x = y = z = 0;` would set all of x, y, z to be 0. 

```c
int main() {
	int x = 5;
	if (x = 4) {
		printf("x is four\n");
	}
	x = 0;
	if (x = 0) {
		printf("x is zero\n");
	}
}
```

This will output "x is four", since `=` is an operator. The equality checker is `==`.
