# CS 146 Lecture 4 Notes

January 16, 2025

### Continuation from [Lecture 3](./cs146-lecture3)

Recall the code from the end of [Lecture 3](./cs146-lecture3).

```scheme
;; Helper:
;; read-list: -> (listof S-expr)
(define (read-list) ;; assumes left-par has already been read
  (define tk (read-token))
  (cond [(token-rightpar? tk) empty];; need to define token-rightpar
       [(token-left-par? tk) (cons (read-list) (read-list))]
       [else (cons (token-value tk) (read-list))]))

;; New Code
;; my-read : -> s-exp
(define (my-read)
  (define tk (read-token))
  (if (token-leftpar? tk)
      (read-list)
      (token-value tk)))
```

Now, the full code is ready:

```scheme
(struct token (type value))
;; type: kind of token:
;;  'lp, 'rp 'id 'num
;; value: "value" of the token
;;  (numeric value, name, etc...)

(define (token-leftpar? x)
  (symbol=? (token-type x) 'lp))

(define (token-rightpar? x)
  (symbol=? (token-type x) 'rp))

;; read-id: -> (listof char)
(define (read-id) ;; Assumes first ch has already been read
  (define nc (peek-char)) ;; nc: new character
  (if (or (char-alphabetic? nc) (char-numeric? nc))
      (cons (read-char) (read-id))
      empty))

;; read-num: -> (listof char)
(define (read-num) ;; Assumes first ch has already been read
  (define nc (peek-char)) ;; nc: new character
  (if (number? nc)
      (cons (read-char) (read-num))
      empty))

;; Main tokenizer
;; read-token: -> token
(define (read-token)
  (define fc (read-char)) ;; fc: first character
  (cond [(char-whitespace? fc) (read-token)]
        [(char=? fc #\() (token 'lp fc)]
        [(char=? fc #\)) (token 'rp fc)]
        [(char-alphabetic? fc)
         (token 'id (list->symbol (cons fc (read-id))))]
        [(char-numeric? fc)
         (token 'num (list->number (cons fc (read-num))))]
        [else (error "lexical error")]))

;; Helper:
;; read-list: -> (listof S-expr)
(define (read-list) ;; assumes left-par has already been read
  (define tk (read-token))
  cond [(token-rightpar? tk) empty];; need to define token-rightpar
       [(token-left-par? tk) (cons (read-list) (read-list))]
       [else (cons (token-value tk) (read-list))]))

;; New Code
;; my-read : -> s-exp
(define (my-read)
  (define tk (read-token))
  (if (token-leftpar? tk)
      (read-list)
      (token-value tk)))

;; need to build list->symbol/list->number
```

Some exercises you could do with this is:

1. Support other tokens.
2. Support other kinds of brackets.

### What have we lost by accepting input/producing output?

We have lost referential transparency. It essentially says that the same expression always has the same value. In the example below, under referential transparency it is expected that `(f 4)` always will produce the same value.

```scheme
;; Example
(f 4) ;; for a function f
```

Another example:

```scheme
(let ((z (f 4))) body)
```

In this example, every (free) `z` in `body` can be replaced by `(f 4)` and vice versa, or in other words, equals can be substituted for equals. This has been lost and is not true anymore when accepting input/producing output. For example, `(read)` does't always produce the same value! Consequently, now it is more difficult to reason about programs since simple algebraic manipulation is no longer possible.

## Intro to C

C is mainly built up of 5 things.

1. Expressions:
    - `1 + 2`: Note that unlike Racket, the operators are infix (not prefix). With this infixed expression, an order of precedence matters.
    - `f(4)`: This is a function call in C.
    - `printf("%d\n", 5)`: A sample print function in C. This is a function call of the print function.
        - The `%d` means display as a decimal number
            - This extends for `%s` and so on.
        - Produces the number of characters printed.
    - Operator precedence is the usual mathematical conventions. The `1 + 2 * 3` becomes evaluated like `1 + (2 * 3)`.
    - Function calls can also be part of expressions such as `3 + f(x, y)`.
2. Statements
    - `printf("%d\n", 5);`: The presence of a `;` (semicolon) makes any expression a statement.
    - The value produced by the expression is then ignored.
    - The expression is evaluated for its side-effects.
        - In this case, `printf` side-effect is to output on the screen.
        - `1 + 2;` is legal, but then is useless.
    - `return 0;`: Produce the value 0 as the result of the function. The function stops running, meaning that the control returns immediately to the caller.
    - `;`: The singular semicolon is the empty statement (it does nothing).
    - There are more statement forms to come.
3. Blocks
    - A block is a sequence of statements treated as one statement.
    - To indicate a block, `{ stmt1; stmt2; ... stmtn; }`.
    - In Racket equivalence is `(void exp1 ... expn)`.
4. Functions

```c
int f(int x, int y) {
	printf("Hello Agent %d, I'm %d years old", x, y);
	return x + y;
}
```

```scheme
;; Racket equivalent
;; f: Num Num -> Num
(define (f x y)
  (printf "Hello Agent ~a, I'm ~a years old" x, y)
  (+ x y))
```

-   Note that contracts (type signatures) are required and enforced in C. Racket is a dynamically typed language, where as C is statically typed (variables types are known at compile time).
    -   Static means before the program runs.
    -   Dynamic means while the program is running.

5. Program
    - The program is mostly just a sequence of functions (there can be other things, but for now it's just a sequence of functions).
    - Starting point of the program is a `main` function.
    - `int main(void) { ... return 0;}`.

```c
#include <stdio.h>

// sample c program
int f(int x, int y) {
	printf("Hello Agent %d, I'm %d years old", x, y);
	return x + y;
}

int main() {
	f(4, 3);
	return 0; // giving the 0 to the OS - echo $
}

/*
OUTPUT
"Hello Agent 4, I'm 3 years old"
*/
```

When the zero is passed to operating system, it acts like a status code, meaning that the program succeeded to finish running. If the number is not 0, it means the program did not succeed to run the way it was intended.

When compiled, the compiler reads from top to bottom, so if a function is defined underneath the main function, it cannot find it and compilation fails. C enforces declaration before use.

Two ways to fix this issue.

-   The first way is to put all functions before they are used.
-   The second way is to prototype the functions before use.
    -   When a function is declared like above, it does two things, it both declares the function (tells the compiler about the function existence), and the definition (completely constructs the function).
    -   C requires declaration before use, but not definition before use.

Example of function prototype/header:

```c
#include <stdio.h>

// function prototype / declaration of f
int f(int x, int y);
// can also write int f(int, int); but not recommended

// main function
int main() {
	f(4, 3);
	return 0; // giving the 0 to the OS - echo $
}

// function definition
int f(int x, int y) {
	printf("Hello Agent %d, I'm %d years old", x, y);
	return x + y;
} // now you can put the function underneath :)
```

The `printf` function also needs to be declared, so it needs to be _included_ by the program from `<stdio.h>` (standard input/output library).

Rather than declare every standard library function header before you use it, C provides "header files." The `#include` looks out of place in the code because it is not part of the C language. The C compiler does not understand the `#include`. This is the directive to a step (step 0) which runs before the compiler runs called the C preprocessor. The purpose of the preprocessor is to make changes to the program text before the compiler sees it. In particular, the line `#inlcude <file.h>` takes the content of `file.h` and drops the contents of the file into the line where the `#include` is stated.

The `stdio.h` file:

-   The file contains declarations for `printf` and other I/O (input/output) functions.
-   This file is located in a "standard place" such as a `/usr/include` directory.
-   The program is still technically incomplete since where is the code that implements `printf`.
    -   The code for printf exists since someone wrote it once, but it's compiled binary code that's ready to go. So the binary that implements printf and the binary for my file are separate, so the binary has to be merged. These two binaries getting merged together is called linking, which results in a complete program.
