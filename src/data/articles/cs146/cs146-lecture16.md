# CS 146 Lecture 16 Notes

February 26, 2025

> Recall from [Lecture 15](./cs146-lecture15) the _Amortized Analysis_.

1. k inserts cost $1$ each ($k$ steps taken).
2. 1 insert costs $k + 1$ steps - cap is now $2k$ and $k + 1$ steps have been taken.
3. Now, $k-1$ inserts cost $1$ each, so $k-1$ steps taken.
4. 1 insert costs $2k + 1$ steps - cap is now $4k$ and $2k + 1$ steps have been taken.
5. Now, $2k-1$ inserts cost $1$ each, so $2k-1$ steps taken.
6. ...
7. $2^{j-1} k - 1$ inserts cost 1 each, so $2^{j-1} k - 1$ steps taken.
8. 1 insert costs $2^{j} k + 1$ - so cap is now $2^j+1 k$, resulting in $2^j k + 1$ steps taken.

> We are ending on an expensive operation, and we cannot pad this operation out with "fake" cheap operations.

Thus, we can now begin to factor it out. So the total steps taken would result in:

$= k(1 + 2 + 4 + ... + 2^{j}) + 2^{j} k + 1$
$= 2^{j + 1} + 2^{j} k - k + 1$
$= 2*2^{j} + 2^{j} k - k + 1$
$= 3*2^{j} - k + 1$

Then, the total number of insertions is equal to the number of items in the array = $2^{j}k + 1$.

So then number of steps per insertion would be:

${3*2^{j}k - k + 1}/{2^{j}k + 1} \approx {3*2^{j}k}/{2^{j}k} = 3$

Now then the double capacity is O(1) amortized time.

```c
// sequence.c
void increaseCapacity(Sequence s) {
	if *(s->size == s->cap) {
		s->theArray = realloc(s->theArray, 2 * s->cap * sizeof(int));
		s->cap *= 2;
	}
}

void add(Sequence s, int i, int e) {
	increaseCapacity(s);
	...
}
```

The helper function `increaseCapacity` should be only called by `add`. Thus mean should not be calling this. Then how do we prevent it? Thus, we can just leave it out of the header file. But in the `main.c` file, one can still "order off the secret menu."

```c
//main.c
#include "sequence.h"
void increaseCapacity(Sequence s);
// what we main declares its own header.
```

Then to prevent these annoying people, we can use the keyword `static`.

```c
// sequence.c
static void increaseCapacity(Sequence s) {
	...
}
```

The static keyword prevents other files from having access even if they write their own header. The static keyword means that the function is only visible in this file.

The midterm content ends here.

## Interpreting Mutation

Now we are going to write an interpreter in Haskell. More specifically, we are writing an interpreter for Faux Racket that allows for mutation.

Recall the deferred substitution interpreter for Faux Racket in Haskell.

The syntax of Faux Racket is:

```haskell
exp = number
	| (op exp exp)
	| (fun (id) exp)
	| (with ((id exp1)) exp2)
	| (exp exp)
	| id
op  = + | *
```

This was the previous syntax we used to make a non-mutable version of Faux Racket.

In Racket we write _Concrete Syntax_, and in Haskell, we write _Abstract Syntax_.

> **Concrete Syntax:** It is the exact form of the thing it takes when it is read by the interpreter.
>
> **Abstract Syntax:** It is the abstract data form of the thing it takes in by the interpreter.

```haskell
data Op = Plus | Times
opTrans Plus = (t)
opTrans Times = (*)

data Ast = Number Integer | Bin Op Ast Ast
         | Fun String Ast | App Ast Ast | Var String

-- What about With? -> Can be re-expressed as a function to an argument.
-- (with ((id exp)) exp) == ((fun (id) exp2) exp1)

data Val = Numb Integer | Closure String Ast Env
type Env = [(String , Val)]

interp::Ast -> Env -> Val

interp (Number v) _ = Numb v
interp (Fun p b) e = Closure p b e
interp (Bin op x y) e = Numb (opTrans op v w) -- want to interp x y
	where
	(Numb v) = interp x e
	(Numb w) = interp y e
-- insist that fp = y
interp (App f x) e = interp fb ((fp, y):fe)
	where
	Closure fp fb fe = interp f e
	y = interp x e
-- if there is a variable encountered, need to look it up in env
-- but it could fail; Haskell deals with that by returning maybe type.
interp (Var x) e = fromMaybe undefined (lookup x e)
-- if undefined is ever the answer, program crashes!
```

> We have not done mutation yet, but now we can add `set` (form mutation) and `seq` (for sequencing). `set` is replacing `set!` and `seq` is replacing `begin`.

So now, we can update our code.

```haskell
exp = number
	| (op exp exp)
	| (fun (id) exp)
	| (with ((id exp1)) exp2)
	| (exp exp)
	| id
	| (set id exp) -- new
	| (seq exp exp) -- new
op  = + | *

data Ast = Number Integer | Bin Op Ast Ast
         | Fun String Ast | App Ast Ast | Var String
         | Set String Ast | Seq Ast Ast -- new

data Val = Numb Integer | Closure String Ast Env
		 | Void -- new
```
