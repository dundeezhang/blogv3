# CS 146 Lecture 9 Notes

February 4, 2025

Recall: "Finding" a value from [Lecture 8](./cs146-lecture8). Every value in memory has an address, so addresses could function as boxes.

Then for the increment function from [Lecture 8](./cs146-lecture8), instead of passing a value to a function, you pass the memory address.

## Pointers

```c
int main() {
	int x = 1;
	inc(&x); // & - address-of operator
}
```

The `&` operator passes x into the function, not the value.

```c
void inc(int x) {
	x += 1; // wrong: did not get int, got address
}
```

Then we need to update the code so that the program knows we are passing it an address.

```c
void inc(int* x) { // x is called a pointer to an int
	x += 1; // note that this is mutating the address, not the int.
}
```

So we need to improve this further to mutate the integer stored at the given memory address. Thus, we can use the `*` symbol again. This star has a different meaning than the multiplication meaning.

```c
void inc(int *x) { // x is called a pointer to an int
	*x += 1; // note that this is mutating the address, not the int.
	/*
	Alternatives:
	*x = *x + 1;
	++*x;
	*/
}
```

On the left hand side on assignment, there is a slightly different meaning to the operator. For example `*x = expression` would mean that the program would store the value of `expression` at address `x`. Note that `*x++;` would not work as in C, postfix operators always takes precedence over prefix operators. Consequently, `*x++` is evaluated like `*(x++)`. Thus, the address is incremented (whatever that means), and a value is fetched from the un-incremented address (since it is postfix which returns the previous value), and then it is thrown away. Thus, there is no change to the original variable. The correct way to use postfix is `(*x)++`.

Now consider,

```c
void swap(struct Posn *p) {
	int temp = *p.x;
	*p.x = *p.y;
	*p.y = temp;
}
```

Note that this does not work again since C always evaluates postfix before prefix. Thus `*p.x = *p.y;` really means `*(p.x) = *(p.y);` which does not exist. To make it work, you need parameters (brackets) once again.

```c
void swap(struct Posn *p) {
	int temp = (*p).x;
	(*p).x = (*p).y;
	(*p).y = temp;
}
```

Since structures are very common in C, `(*p).x` would be used a lot. Thus, the designers of C made a new notation for this: `p->x`.

Now, more sophisticated user input is available to us to use: `scanf()`.

### Input

`scanf()` works a lot like `printf()`. It works by taking in the memory addresses of variables and puts the user input into the desired address.

```c
int main() {
	int x, y;
	scanf("%d %d", &x, %y);
}
```

It essentially works the same way as `printf()`, but you need to put in the memory addresses of the variables instead of the value of the variable itself. This is because `scanf()` is a function, which would face the same limitations as our functions from before. The `scanf()` function also returns the number of values actually read.

> At this point in the lecture, I am very close to falling asleep, I hope my note quality is not terrible. I wanna sleep. I wanna sleep. I wanna sleep.

## Advanced Mutation

Racket came out of Scheme since the creators of Racket wanted to change the way mutation of datatypes worked in Scheme to the point where they could not call their language Scheme anymore.

In Scheme, you can mutate the parts of a cons with `set-car!` and `set-cdr!`. Now why did Racket split off and become incompatible with Scheme? In Racket, `cons` fields are immutable, which means that they cannot be mutated. For mutable pairs, Racket provides `mcons`. And when you need to mutate the fields, you have `mset-car!`, and `mset-cdr!`.

For structs, provide the option `#:mutable`.

```scheme
(struct Posn (x y))

(define p (Posn 3 4))

p
;; Ouputs:
;; #<Posn>

;; But if you add the option transparent,
(struct Posn (x y) #:transparent)

(define p (Posn 3 4))

p
;; Ouputs:
;; (Posn 3 4)

;; And if you add the option mutable as well,
(struct Posn (x y) #:transparent #:mutable)

(define p (Posn 3 4))
(set-Posn-x! p 999)
p

;; Ouputs:
;; (Posn 999 4)

```

This knowledge requires a change in our understand of the semantics. In CS 145, `(make-posn v1 v2)` is a value. Now, `(posn v1 v2)` cannot be a simple value if it is mutable. This structure has to behave more like a box. How would this be done? Is a struct automatically boxed, or is a struct a box?

```scheme
(struct posn (x y))

(define (mutated-posn p)
	(set-posn-x! p (+ 1 (posn-x p))))

(define (mutated-posn-2 p)
	(set! p (posn (+ 1 (posn-x p)) (posn-y p))))
```

From the code above, the first function works whereas the second one does not work. This means that a struct is not automatically boxed, but it does box its contents. So we can rewrite `(posn v1 v2)` as:

```scheme
(define _val1 v1)
(define _val2 v2)
(posn _val1 _val2)
(posn-x p)
;; where p is (posn _val1 _val2) and find the definition for _val1 and fetch the value.

(set-posn-x! p v)
;; where p = (posn _val1 _val2) where it
;; finds (define _val1 ~~~)
;; replaces with (define _val1 v)
```

Then do a little bit of stepping!

```scheme
(define p1 (posn 3 4))
(set-posn-x! p1 5)

=>
(define _v1 3)
(define _v2 4)
(define p1 (posn _v1 _v2))
(set-posn-x! p1 5)

=>
(define _v1 3)
(define _v2 4)
(define p1 (posn _v1 _v2))
set-posn-x! (posn _v1 _v2) 5)

=>
(define _v1 5)
(define _v2 4)
(define p1 (posn _v1 _v2))
(void)
```

Generally, you can generalize this to any mutable struct. Then if you want the semantics of `mcons`, it works here as well.

Consider:

```scheme
(define lst1 (cons (box 1) empty))
(define lst2 (cons 2 lst1))
(define lst3 (cons 3 lst1))
(set-box! (first (rest lst2)) 4)
(unbox (first (rest lst3)))
```

By the 1A (CS 145) understanding of this code, this would produce 1.

```scheme
lst2 = (cons 2 (cons (box1) empty))
lst3 = (cons 3 (cons (box1) empty))
```

But this does not produce 1, this would produce 4. The two `(box 1)`'s are the same object. Under the old substitution rules, would would have no way of indicating that the two `(box 1)`'s would be the same objects. Under the new substitution rules, the correct value 4 would be returned since boxes are rewritten as separate defines with deferred lookup.

```scheme
(define _v1 1)
lst2 = (cons 2 (cons _v1 empty))
lst3 = (cons 3 (cons _v1 empty))
```

Thus, it is easy to see that the `(box 1)`'s are the same object. They have a shared variable in the rewrite.
