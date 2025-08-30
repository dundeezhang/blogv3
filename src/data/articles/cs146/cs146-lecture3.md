# CS 146 Lecture 3 Notes

January 14, 2025

## Reasoning about output continued:
Output is the easiest side-effect to deal with since it's the least impactful. Before we had output, the following was true:
- Order of operations did not matter, assuming no crashes or non-termination.
	- However, now order of evaluation may affect order of output.
- All non-terminating programs could be considered equivalent (non-meaningful since the program isn't doing anything).
	- Now, non-terminating programs can be meaningful such as a program that prints out the digits of e or π.
	- The semantic model should include the possibility of non-terminating programs.
		- What is produced "at the limit?"
		- Recall: [Semantics Definition](https://en.wikipedia.org/wiki/Semantics_(computer_science)).
## Modelling Input
We need to define how we can interpret input.
- Let `I` represent the infinite sequence consisting of all characters the user will ever press.
	- Recall [Lecture 2](./cs146-lecture2), the model is now `(π, ∂, Ω, I)`.
- When the program accepts an input character, it means the program is removing a character from `I`.
But there is a small problem from this model such as in video games.
- The input from video games is often a response to visual or audio queues (output) from the game. So in a way, the sequence may depend on the output. Thus a more realistic model of input would perhaps not assume all the input is available at once.
- An alternative would be to request for input yields a function consuming one or more characters and produces the next program `π` , with the user's characters substituted for the input request.
For example:
```scheme
(read-line) ;; (lambda (line) line)
```

Entire program the becomes a big "nesting" of input request functions, one per "prompt"; supplying user input for each prompt yields final result.

### Input in Racket
```scheme
(read-line) 
```
`(read-line)` produces a string of all chars pressed until the first newline (string does not contain newline).
For example:
```scheme
;; Read a line and turn into list
(string->list (read-line))
;; output '(#\H #\i) if we input Hi

;; Read in a list of lines
(define (read-input)
  (define nl (read-line))
  (cond [(eof-object? nl) empty]
		[else (cons nl (read-input))])) ;; not tail recursive
;; Input: ---
;; hi
;; this
;; hello
;; this worlds
;; Output: ---
;;'("hi" "this" "hello" "this worlds")
```

### Some more primitive input examples:
- `(read-char)`: It only extracts one character from the input sequence.
- `(peek-char)`: Examples the next char in the sequence without removing it from the sequence.

Example in usage:
```scheme
(define (my-read-line)
  (define (mrl-h acc)
    (define ch (read-char))
    (cond [(or (eof-object? ch) (char=? ch #\newline)) 
           (list->string (reverse acc))]
		  [else (mrl-h (cons ch acc))]))
  (mrl-h empty))
```

### Some less primitive input examples:
- `(read)`: consumes from input (and produces) an S-expression no matter how many characters or lines it occupies.
	- An S-expression is any piece of Racket data.
	- For example, it only displays back once you have finished inputing the list (fully finishing the parentheses).
Now we write DrRacket:
```scheme
(define (repl)
  (define exp (read))
  (cond [(eof-object? exp) void]
        [else (display (interp (parse exp)))
         (newline)
         (repl)]))
```

Let's write out own version of `(read)`. The process typically happens in 2 steps.
1. Tokenization - convert a sequence of raw characters to a sequence of tokens (meaningful "words"). For example, `( )`, identifiers or number.
	- Identifiers start with a letter.
	- Numbers start with a digit.
	- Key observation: peeking at the next character tells us what kind of token we are getting, and what to look for to complete the token.
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

;; need to build list->symbol/list->number
```
2. Parsing - are the tokens arranged in a sequence that has the structure of an S-expression.
	- If so, produce the S-expression.
```scheme
;; Helper:
;; read-list: -> (listof S-expr)
(define (read-list) ;; assumes left-par has already been read
  (define tk (read-token))
  cond [(token-rightpar? tk) empty];; need to define token-rightpar
       [(token-left-par? tk) (cons (read-list) (read-list))]
       [else (cons (token-value tk) (read-list))]))
```

The rest of the code will be finished in Lecture 4.