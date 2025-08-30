# CS 146 Lecture 2 Notes

January 9, 2025

In preparation for side-effects.

## Introducing `begin`

```scheme
(begin exp_1, exp_2, ... , exp_n)
```

-   Evaluates all of `exp1, ... exp_n` in left-to-right order
    -   In scheme, it's unordered evaluation, so `begin` was needed.
    -   However, Racket evaluates in order from left-to-right without begin.
-   The `begin` function produces the value of `exp_n`. Thus, it is useless in a pure functional setting as you would only care about the output.
-   `begin` is useful if `exp_1 ... exp_n-1` are evaluated for their side-effects.
    -   Recall side-effects include input, displaying, or anything that is not computing the output.
-   Implicit `begin` in the bodies of `fns`, `lambdas`, `local`, `answers` of `cond`/`match` in Racket.
    -   These functions will execute from left-to-right order without the usage of `begin`.

## Reasoning about side-effects

For pure functional programming, there is the _substitution model_ (stepping from CS 145).

### Can the substitution model be adapted in Imperative Programs?

The "state of the world" is an extra input and extra output at each step. Also, each reduction step would transform the program and also the "state of the world."

### So, how do we model the "state of the world?"

-   Simple cases -> list of definitions
-   Some complex cases -> Memory Model (RAM)
    -   We will do this later in the course

### For now - RAM is conceptualization of the machine

Where memory is a sequence of "boxes":

-   Indexed by natural numbers (addresses).
-   Containing a fixed size number (e.g. 32 bits).
-   Any boxes contents can be fetched in constant \[O(1)\] time.
    Pictorially:
    32-bit RAM (Random Access Machine)

```txt
Address         |-------Contents-------|
    4           1100111000111 ...
    8           1010011. ...
    12           .
    16           .
    20          1011011000101 ...
    24           .
    28           .
    ...          ...
    256          .
    ...         |--------32 bits-------|
```

Will use in a later module. (We are currently in module 1).

### Modelling Output

Simplest kind of side-effect:

-   "State of the world" is the sequence of characters that have been printed to the screen.
-   Each step of computation potentially adds characters to this sequence.

_Note: Every string is just a sequence of characters._
In Racket:

```scheme
(string->list "abcd") ;; => (list #\a #\b #\c #\d)
```

### Substitution model: `π0 => π1 => π2 => ... => πn.`

-   `π` is pi. P for Program.
-   Each `πi` is a version of the program, obtained by applying one reduction step to `πi-1`.

### Now also: `Ω0 => Ω1 => ... => Ωn.`

-   `Ω` is omega. O for Output.
-   Each `Ωi` is a version of the output sequence.
-   Each `Ωi` is a prefix of `Ωi+1` (can't "unprint characters").
    -   Backspace is a character that is pressed and the screen reads it as a function that removes something from the screen. It doesn't unprint a character.
    -   In essence, you press down a character to display on the screen, which removes the last 2 characters from the screen.

### Then `(π0, Ω0) => (π1, Ω1) => (π2, Ω2) => ... => (πn, Ωn)`

Some program reductions create definitions. E.g. in Racket, `local`, `define`. However, even defined values will eventually change in the real world. So, in order to prepare for this eventuality, we separate out the sequence of definitions: `∂`.

-   `∂` is delta. D for Definition.

### Then `(π0, Ω0, ∂0) => ... => (πn, Ωn, ∂n) `

To help understand:

-   `∂0` and `Ω0 `are `empty`.

If `π0` = `(define id exp)...`

-   We would reduce `exp` according to the usual CS 145 rules in addition to the new CS 145 rules.
-   This may cause `chars` to be sent to `Ω` (or inner definitions to be sent to `∂`).
-   `exp` now reduced to a `val`.
-   So then we remove `(define id val)` from π and add to `∂`.

If `π0` = `exp ...`

-   Reduce `exp` by usual rules - may affect `Ω/∂`.
-   `exp` now reduced to a `val`, then we can remove it from `π`.
-   `chars` that make up `val` are added to `Ω`.

This goes on until `π` is `empty`, which then we are done.

-   `∂, Ω` - the state - that which changes, other than the program itself.
-   `Ω` - relatively harmless - changes to `Ω` don't affect the running of the program.
-   `∂` - easy for now because `vars` are not changing yet.
    -   (adding new definitions is not really a change of state)

### Affecting `Ω`

Essentially, "how do we print stuff in Racket?"

```scheme
(display x) ;; outputs the value of x (NO LINE BREAK)
(newline) ;; LINE BREAK
(printf "The answer is ~a.\n" x) ;; ~a: variable x, \n: new line
;; \n in Racket is represented as: #\newline
```

Example Racket program:

```scheme
(display "Hello, World!")
(printf "Hello, ~a!\n" "world")
(newline)
(begin (display "Hello") (newline) (display "World"))
;; OUTPUT
;; Hello, World
;; Hello, world
;;
;; Hello
;; World
```

### What do `display`, `newline`, and `printf` return?

```scheme
(define (f x) (+ x 1))
(f 4)
;; OUTPUT
;; 5
```

The above program outputs a number or in other words, it returns a value.

Then, what about display?

```scheme
(list (display "Hello, world!"))
;; OUTPUT
;; Hello, world!'(#<void>)
```

So what does `display`, `newline`, and `printf` return?

-   Special value `#<void>` - not displayed in DrRacket
-   For functions that essentially return nothing
-   Functions that return nothing are called statements or procedures.

Recall: `map`.

```scheme
(map f (list e0 e1 ... en)) ;; => (list (f e1) (f e2) ... (f en))
```

-   What if `f` is a statement - Needed for side-effects. - Produces `#<void>`.
    E.g.

```scheme
(map display (list 1 2 3 4 5))
;; OUTPUT
;; 12345'(#<void> #<void> #<void> #<void> #<void>)
```

-   Then, `(map f (list e0 e1 ... en))` produces `(list #<void> #<void>  ... #<void>)`
    -   This is not useful.

Now consider: `for-each`.

```scheme
(for-each f (list e1 ... en))
```

-   It performs (`f e1) ... (f en)` and produces `#<void>`
    E.g.

```scheme
(define (print-with-spaces lst)
  (for-each (lambda (x) (printf "~a " x)) lst))
```

How to define `for-each`:

```scheme
(define (for-each f lst)
  (cond [(empty? lst) (void)]
		[else (f (first lst) (for-each f (rest lst))]))
```

-   Note that there is an implicit begin for the `cond` definition.
    Or by using `if`:

```scheme
(define (for-each f lst)
  (if (empty? lst)
	  (void)
	  (begin (f (first lst)) (for-each f (rest lst)))))
```

Doing nothing in one case of an if is common and has a specialized form:

```scheme
(define (for-each f lst)
  (unless (empty? lst) (f (first lst)) (for-each f (rest lst))))
```

-   Evaluates body expressions if the test is `false`. Similarly, `(when...)` evaluates body exprs if the test is `true`.

### Why do we need output?

-   We never used this in CS 145.
    -   Racket has a REPL (Read Evaluate Print Loop). Essentially, we can call the function and see the result.
-   Many languages:
    -   Compile, link, execute cycle. This means that the program is translated by a compiler to native machine code and then executed by the command line. Thus, we only see output if the program prints it.

E.g. in C. C is the compile, link and execute cycle.

```c
#include <stdio.h>
int main() {
	printf("hello worl!d\n");
	return 0;
}
```

A use in Racket: tracing programs.

```scheme
(define (fact n)
  (printf "fact applied to ~a" n)
  (if (= n 0) 1 (* n (fact (sub1 n)))))
```

-   Can aid debugging.
