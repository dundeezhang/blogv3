# CS 146 Lecture 1 Notes

January 7, 2025

## Major Theme of CS 146: Side-Effects (impurity)

-   Anything the function might do other than produce the answer
    -   programs that do things
-   imperative programming
    -   Impure Racket
    -   C
    -   Low level machine

## Why function first?

-   Imperative programming is harder
-   Side-effect Examples:
    -   Text is printed to the screen
    -   Keystrokes collected from the keyboard
    -   Values of variables may change
    -   The 3 things above all change the state of the world
    -   In result, the state of the world affects the program
-   Functions all depend on the current value of the variables

Thus the semantics of an imperative program must take into account the current state of the world, even while changing state of the world.

Thus, a temporal component inherent in the analysis of imperative programs (not "what does this do?") but rather "what does this do at this point in time?".

## Why study imperative programming?

**That is because "the world is imperative"**

-   Even functional programs are eventually executed imperatively

-   Is "the world" constantly changing or is it constantly being reinvented?

-   When a character appears on the screen, does that change the world or create a new one?
-   Either way, Imperative programming matches up with the real world experience.
-   But a functional view may offer a unique take on side-effects, so we learn functional programming.

Recall from CS 135/145:

-   Structural recursion: the structure of the program mirrors the structure of the data

```scheme
;; Eg. Nats
(define (fact n)
  (if (zero? n)
	  1
	  (* n (fact (- n 1)))))
```

-   The cases in the fn match the cases in the data definition
-   The recursive call uses arguments that either stay the same or get one step closer to a base case.

Another example:

```scheme
(define (length L) (cond [(empty? L) 0] [else (+ 1 (length (rest L)))]))
;;  A (listof X) is
;; empty or
;; (cons x y) where x is an X and y is a (listof X)
```

If the recursion is structural, then the structure of the program matches the structure of its correctness proof by induction.

### Proof:

Claim: (length L) produces the number of elements in L
Proof: Structural induction on L
Case 1: L is empty. Then (length L) produces 0, which is the length of the empty list.
Case 2: L is (cons x L'). Assume (length L') produces the number of elements in L'. Then (length L) produces 1 more than (length L'), which is the number of elements in L.

Accumulative recursion. One or more extra params that "grow" while the other parameters shrink.

Another example:

```scheme
(define (sum-list L)
  (define (sum-list-a L acc)
	  (cond [(empty? L) acc]
			[else (sum-list-a (rest L) (+ acc (first L)))]))
 (sum-list-a L 0))
```

Proof method:
Induction on an invariant.

-   To prove that (sum-list L) produces the sum of the elements of L, it suffices to prove that (sum-list-a L 0) produces the sum of the elements of L .
-   So (sum-list-a L 0) produces the sum of elements of L.

### Attempt to prove by structural induction:

Case 1: L is empty. Then (sum-list-a L acc) produces acc, which is the sum of the elements of L plus acc. which is 0.

Case 2: L = (cons x L'). Assume (sum-list-a L' 0) produces the sum of the elements of L'.

```scheme
(sum0list-help (cons x L') 0)
(sum-list-help L' (+ 0 x))
(sum-list-help L' x)
```

The above proof fails.

We need a stronger statement about the relationship among L, acc, and the result that holds throughout the recursion. -> an invariant.

### Proof:

We prove the invariant that for all L' and for all acc, (sum-list-help L' acc) produces the sum of the elements of L' plus acc. Proof by structural induction.

Case 1: L is empty. Then (sum-list-help L acc) produces acc, which is the sum of the elements of L plus acc, which is 0.

Case 2: L = (cons x L').
Assume (sum-list-help L' acc)

```scheme
(sum-list-help L acc)
(sum-list-help (cons x L') acc)
;; = x + acc + sum of L'
;; = acc + (x + sum of L')
;; = acc + sum of L
```

Generative recursion - does not follow these structures

-   The proof requires more creativity.

Basic C Program Structure:

```c
#include <stdio.h>

int main() {
	printf("hello world");
	return 0;
}
```
