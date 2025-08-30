# CS 146 Tutorial 1 Notes

January 8, 2025

## Data Types:

````txt
- Integer 5 :: Integer

- Bool ('b, 4) :: (Char, Integer)

- Char 'a' :: Character

- String inc :: Integer -> Integer

- Etc. [1, 2, 3] :: [Integer] :: List of Integers
```

In Haskell:

```haskell
data Bool = True | False

data Color = Red | Green | Blue

data Lst = Empty | Cons Integer Lst --deriving (show)
````

## Functions:

```haskell
Length :: Lst -> Integer
first :: Lst -> Integer

Length Empty = 0
Length (cons i l) = 1 + Length l
Length (cons _ l) = 1 + Length l



Length [1, 2, 3] = 3
Length [[1, 2, 1]] = 1
```

## Currying:

```haskell
map :: (integer -> integer) -> (Lst -> Lst)
-- equivalent to:
map :: (integer -> integer) -> Lst -> Lst -- * right-associativity

map f Empty = Empty

map f (cons i rest) = (cons (f i) (map f rest))

foldl :: (integer -> intger -> integer) -> integer (acc) -> Lst -> integer (result)

foldl f a Empty = a.

foldl f a (cons first rest) = foldl f a' rest

where a' = f a first
```

## Lambda:

```haskell
inc :: Integer -> Integer

inc x = x + 1

inc = \x -> x + 1 -- the \ is used to define a lambda function
```

## Lists:

```haskell
[1, 2, 3]

lit = [1, 2, 3]

l1 = [1 .. 3]

l2 = [1, 3 .. ] -- [1, 3, 5, 7, ...]

l3 = 1 :(2 :(3 : [])) -- [1, 2, 3]

l4 = [5, 8 ..] -- [5, 8, 11, 14, ...] 3 step size starting form 5
```

## If-then-else:

```haskell
if x > 0 then True else False

isNeg :: Integer -> Bool
isNeg x = if x < 0 then True else False

-- isNeg (-30) => True
```

## Homework

Write a function that:

-   Takes in an integer and a list of lists of integers.
-   Prepend this integer to every list of integers.
