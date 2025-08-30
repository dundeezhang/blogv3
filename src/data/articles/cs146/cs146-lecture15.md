# CS 146 Lecture 15 Notes

February 25, 2025

> Forgot to watch lecture 14. I will post it later hopefully?

## Recall: Hash Tables

```scheme
(define (ht-add table key val)
	(define index (modulo key (vector-length table)))
	(define hash-list (vector-ref table index))
	(define look up (assoc key hash-list))
	(if lookup
		(when (not (equal? (second lookup) val)))
		(vector-set! table index
			(cons (list key val) (remove lookup has-list))))
	(vector-set! table index (cons (list key val) (hash-list))))
```

Hash tables have a reputation of being constant time. This is not an entirely deserved reputation, since they are not exactly constant time. It will degenerate back to linear searches once it stores enough elements.

Now how do we build abstract data types in C?

## ADTs in C

C does not have modules, but rather it has files. We want to implement _ADT Sequence_ in C.

**Operations of ADT Sequence:**

1. Empty Sequence - empty?
2. Insert (S, I, E) - Insert int E at index I in S (Pre: 0 ≤ i ≤ Size(S))
3. Size (S) - Number of elements in S
4. Remove (S, I) - Remove item from index I in S (Pre: 0 ≤ i < Size(S))
5. Index (S, I) - Return the Ith element of S (Pre: 0 ≤ i < Size(S))

> This may sound like an array, but this has no limits on size. Thus, the sequence can grow as needed.

**Implementation options:**

1. Linked List
    1. They are easy to grow, but they have a slow index.
2. Array
    1. They have a very fast index, but are hard to grow.

> To choose our desired approach, we need to consider both factors. In this case, we can ignore the size limits of arrays, and blissfully make a _partially-filled heap array_.

Writing: _Sequence.h_

```c
struct Sequence {
	int *theArray;
	int size; // how many items in use?
	int cap; // how many can we hold?
};
struct Sequence emptySeq();
int seqsize(struct Sequence s);
void add(struct Sequence *s, int i, int e);
void remove(struct Sequence *s, int i);
int index(struct Sequence s, int i);
void freeSeq(struct Sequence *s);
```

Now then, we write _Sequence.c_

```c
#include "Sequence.h"
struct Sequence emptySeq() {
	struct Sequence res;
	res.size = 0;
	res.theArray = malloc(10*sizeof(int));
	res.cap = 10;
	return res;
}

int seqSize(struct Sequence s) {
	return s.size;
}

void add(struct Sequence *s, int i, int e) {
	for (int n = s->size; n > i; --n) {
		s->theArray[n] = s->theArray[n - 1];
	}
	++s->size;
	s->theArray[i] = e;
}

// remove is left as an exercise
int index(struct Sequence s, int i) {
	return s.theArray[i];
}

// freeSeq is also left as an exercise
```

Now, we finally write _main.c_

```c
#include "Sequence.h"
int main() {
	struct Sequence s = emptySeq();
	add(&s, 0, 4);
	add(&s, 1, 7);
	...
}
```

> Now, this is workable, but since C does not have a module system, it does not prevent you from misusing any of the functions. There are two types of misuse in C called tampering and forgery.

What is **tampering**? It is when you interact with something in the ADT without using one of its functions. An example of tampering is `s.size = 8;`. The size is supposed to be added dynamically, not changed on it's own. This affects your stepping case inductively.

**Forgery** is creating something with the ADT type without using the function to create it. An example would be `struct Sequence t; t.size = 10; t.cap = 20;`. In other words, you are trying to set up the object without the built-in set up. This affects your base case inductively.

### Preventing Misuse

We can keep the details of the struct Sequence hidden. We can declare, but not define the struct.

```c
// sequence.h -----
struct Sequence;
struct Sequence emptySeq();
...

// sequence.c -----
#include "sequence.h"
struct Sequence {
	int *theArray, size, cap;
};

// main.c ---------
#include "sequence.h"
int main() {
	struct Sequence s; // THIS DOES NOT WORK
...
}
```

> This does not work because you are asking the compiler to allocate memory to the stack to hold S, but the compiler does not know anything about S. Thus, it does not know how much space it needs to allocate for S, thus it cannot compile.

Something else that we can try is this:

```c
// sequence.h -----
struct SeqImpl;
typedef struct SeqImpl *Sequence;
Sequence emptySeq();
void add(Sequence s, int i, int e);
...

// main.c ---------
#include "sequence.h"
int main() {
	struct Sequence s; // pointer, so it's okay
...
}
```

Now what happens when the array is full? We know it is full when the size and the cap are equal.

```c
void add(Sequence s, int i, int e) {
	if(s->size == s->cap) {
		// make the array bigger
		int *newArray = realloc(s->theArray, ...);
		if(newArray) {
			theArray = newArray;
		}
	}
}
```

> What is **realloc**? It increases a block of memory to a new size. If necessary, it allocates a new and larger block of memory and frees the old block (the data is copied over).

Now, how much bigger should we make the memory? The naive answer would be just to make it one larger, and keep making it 1 larger every time. Well, this is very expensive in time complexity since the memory has to be copied over every time. Thus, we must assume that each call to _realloc_ causes a copy.

Now, we if have a sequence of adds (at the end, so no shuffling cost). Then the number of steps is n + n+1 + n+2 + ... O(n^2) total cost, O(n) per add.

Now, what if we double the size instead. Now, each add is still O(n) in worst case.

### Amortized Analysis

It places a bound on a sequence on operations even if an individual operation may be expensive.

Consider the case of if an array has a cap of k and is empty:

1. k inserts cost $1$ each ($k$ steps taken).
2. 1 insert costs $k + 1$ steps - cap is now $2k$ and $k + 1$ steps have been taken.
3. Now, $k-1$ inserts cost $1$ each, so $k-1$ steps taken.
4. 1 insert costs $2k + 1$ steps - cap is now $4k$ and $2k + 1$ steps have been taken.
5. Now, $2k-1$ inserts cost $1$ each, so $2k-1$ steps taken.
6. ...
7. $2^{j-1} k - 1$ inserts cost 1 each, so $2^{j-1} k - 1$ steps taken.
8. 1 insert costs $2^{j} k + 1$ - so cap is now $2^j+1 k$, resulting in $2^j k + 1$ steps taken.
