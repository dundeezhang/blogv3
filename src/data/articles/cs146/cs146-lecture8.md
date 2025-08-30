# CS 146 Lecture 8 Notes

January 30, 2025

## Intermediate Mutation (Racket)

See previous [lecture](./cs146-lecture7).

Recall the address books example from [Lecture 6](./cs146-lecture6). What if we want to work with multiple address books? For example, what if we want to have a home address books, and a work address book.

```scheme
(define work '((Manager 12345) '(Director 23456)))
(define home empty)
(define (add-entry abook name number)
  (set! abook (cons (list name number) abook)))
```

Note that when you run this code and try to add-entry a number on to the home book, there is no change to the home book. The code doesn't work. To understand why, we can look at the substitution model.

```scheme
;; model
(add-entry home 'Neighbour 34567)
=> (add-entry '() 'Neighbour 34567)
=> (set! '() (cons (list 'Neighbour 34567) '()))
```

In the code above, note that we are `set!` onto an empty list, not the home variable. To make this work, we first do a little bit of lambda calculus. Recall from CS 145 that we can simulate structures using lambda. Thus, we are going to do the same thing to create a struct with one field called a box. There are going to be two operations for the box:

1. Get the value in the box.
2. Set the value to a new value.

```scheme
(define (get b) (b 'get))
(define (make-box v)
  (lambda (msg)
    (cond [(equal? msg 'get) v])))

(define b1 (make-box 7))
(get b1)

;; REDUCTIONS
=> (define b1 (lambda (msg) (cond [(equal? msg 'get) 7])))
   (get b1)
=> ((lambda (msg) (cond [(equal? msg 'get) 7]) 'get)
=> (cond [(equal? 'get 'get) 7])
=> (cond [(#t) 7])
=> 7
```

To support `set!`, you need to introduce a local copy of `v`.

```scheme
(define (make-box v)
  (local [(define val v)]
    (lambda (msg)
      (cond [(equal? msg 'get) val]))))
(define (get b) (b 'get))

(define b1 (make-box 7))
(get b1)

;; REDUCTIONS
=> (define b1 (local [(define val v)]
    (lambda (msg) (cond [(equal? msg 'get) val]))))
   (get b1)
=> (define val_0 7)
   (define b1 (lambda (msg) (cond [(equal? msg 'get) val_0])))
   (get b1)
=> ...
=> 7
```

Adding `set!` into this function requires an extra parameter. You can achieve this by having box return a function.

```scheme
(define (make-box v)
  (local [(define val v)]
    (lambda (msg)
      (cond [(equal? msg 'get) val]
            [(equal? msg 'set)
             (lambda (newv)
                (set! val newv))]))))
(define (get b) (b 'get))
(define (set b v) ((b 'set) v))

(define b1 (make-box 7))
(set b1 4)

;; REDUCTIONS
=> (define b1 (local [(define val v)]
    (lambda (msg)
      (cond [(equal? msg 'get) val]
            [(equal? msg 'set)
             (lambda (newv)
                (set! val newv))]))))
   (set b1 4)
=> (define val_0 7)
   (define b1 (lambda (msg)
   (cond [(equal? msg 'get) val_0]
         [(equal? msg 'set (lambda (newv)
                             (set! val_0 newv)))])))
   (set b1 4)
=> ...
=> 4
```

But how does all of this code fix the problem? Well before we couldn't update home because home would be substituted before it is mutated.

```scheme
(define home '())
(add home __ __)
=> (add '() __ __)
=> (set! '() __ __)
```

But now, we can define home to be a box, which contains the empty list.

```scheme
(define home (make-box '()))
(define (add abook name phone)
  (set abook (cons (list name phone) ;; this is our set function we wrote.
				   (get abook))))
;; set: updates the variable
;; get: fetches the variable

(add home __ __) ;; is now a function that can update the address book.
```

Although we did all of this work to make our own boxes, boxes are actually built into Racket.

```scheme
;; SYNTAX -----------
(box expr)
(unbox expr)
(set-box! expr expr)
;;        ~~~~ does not have to be an id

;; SEMANTICS --------
(define home (box '((Mom 45678))))
(define work (box '((56789))))
(define (add abook name phone)
  (set-box! abook (cons (list name phone) (unbox abook))))

;; Stepping
(box v) (v a value)
=> (define _u v) (u a freshname)
=> _u            (then (box v) becomes _u)
;; the underscore means don't look up the value unless unbox is called.
;; this is not Racket notation, it is a convention.

(unbox _n) -find (define _n v)
=> v
(set-box! _n v) -find (define _n __)
                -replace with (define _n v)
=> (void)

;; EXAMPLE ----------
(define box1 (box 4))
(unbox box1)
(set-box! box1 true)
(unbox box1)
=>
(define _u1 4)
(define box1 _u1)
(unbox box1)
(set-box! box1 true)
(unbox box1)
=>
(define _u1 4)
(define box1 _u1)
(unbox _u1)
(set-box! box1 true)
(unbox box1)
=>
(define _u1 4)
(define box1 _u1)
4
(set-box! _u1 true)
(unbox box1)
=>
(define _u1 true)
(define box1 _u1)
4
(void)
(unbox box1)
=>
(define _u1 true)
(define box1 _u1)
4
(void)
(unbox _u1)
=>
(define _u1 true)
(define box1 _u1)
4
(void)
true
=> true
```

This is a little bit messy. The substitution model does not work so well with mutation.

Now consider the same problem in C.

```c
void inc(int x) {
	x += 1;
}
int main() {
	int x = 1;
	inc(x);
	printf("%d\n", x); // want to produce 2, but we get 1
}
```

What is the equivalent of a one-field structure in C?

```c
struct Posn {
	int x;
	int y;
} a, b, c;
// a, b, c are variables for the Posn.

int main() {
	struct Posn p;
	p.x = 3;
	p.y = 4;
	printf("p = (%d, %d)\n", p.x, p.y);
	// or you can initialize and assign at once
	// this notation only works for initialization, NOT assignment
	struct Posn n = {5, 6};
	printf("n = (%d, %d)\n", n.x, n.y);
}
```

Now, if we want to swap the x and y values of the Posn, we need to write a function for it.

```c
void swap(struct Posn p) {
	int x = p.x;
	p.x = p.y;
	p.y = p.x;
}
```

But this function does not work. The problem is that C (and also Racket) passes parameters by a mechanism called pass-by-value. The function operates on a copy of the argument, not the actual argument itself. It is also worth noting that the substitution model we learned in Racket is also implicitly pass-by-value.

```c
void inc (int n) {
	++n;
}
```

In this code, the `n` is really mutated. The value is actually incremented by one, but the passed in argument is a copy, it is not the original from the caller. The original would remain the same. When something is passed into the arguments of a function, it is always passed as a copy, meaning that even entire structures are just copied.

So there is something special about boxes. They are not equal to the value they hold. They tell you how to find the value, and how to fetch the value. Think of it like an agent; Unbox is to find the value, rather than just calling box.

This leads to the next question, how do we actually find a value. Well, the values are stored in memory (RAM). Every value in memory has an address, which tells you were to find the value. If you are given an address, you can "find" the value, meaning the location of where the value is stored. Thus in a way, addresses could function as boxes in C.
