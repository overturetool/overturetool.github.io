---
layout: default
title: LUHNSL
---

## LUHNSL
Author: Nick Battle


Luhn algorithm
See http://en.wikipedia.org/wiki/Luhn_algorithm

The Luhn algorithm or Luhn formula, also known as the "modulus 10" or "mod 10" algorithm, is a simple
checksum formula used to validate a variety of identification numbers, such as credit card numbers,
IMEI numbers, National Provider Identifier numbers in US and Canadian Social Insurance Numbers. It was
created by IBM scientist Hans Peter Luhn and described in U.S. Patent No. 2,950,048, filed on
January 6, 1954, and granted on August 23, 1960.

The algorithm is in the public domain and is in wide use today. It is specified in ISO/IEC 7812-1.[1]
It is not intended to be a cryptographically secure hash function; it was designed to protect against
accidental errors, not malicious attacks. Most credit cards and many government identification numbers
use the algorithm as a simple method of distinguishing valid numbers from collections of random digits.

| Properties | Values          |
| :------------ | :---------- |
|Language Version:| vdm10|
|Entry point     :| LUHN`luhn([1,2,3,4,5])|
|Entry point     :| LUHN`luhns("12345")|
|Entry point     :| LUHN`luhnn(12345)|


### LUHN.vdmsl

{% raw %}
~~~
/**
 * A specification of the Luhn check digit algorithm.
 */
types
  Digit = nat      -- A decimal digit, 0-9
  inv d == d < 10;
  
functions
  luhn: seq1 of Digit -> Digit  -- Non empty list input
  luhn(data) ==
    total(data) * 9 mod 10;
  
  -- Convenience function for "12345"
  luhns: seq1 of char -> Digit
  luhns(number) ==
    luhn(strToSeq(number));
  
  -- Convenience function for numbers
  luhnn: nat -> Digit
  luhnn(number) ==
    luhn(natToSeq(number));
    
  total: seq of Digit -> nat
  total(data) ==
    if data = []
    then
      0
    else
      let multipler = (len data) mod 2 + 1,
        product = hd data * multipler
      in
        total(tl data) +  -- recurse
          if product < 10
          then product
          else (product mod 10) + 1
  measure len data;
      
  strToSeq: seq1 of char -> seq1 of Digit
  strToSeq(s) ==
    [ cases i :
      '0'  -> 0, '1' -> 1, '2' -> 2, '3' -> 3, '4' -> 4,
      '5'  -> 5, '6' -> 6, '7' -> 7, '8' -> 8, '9' -> 9
      end | i in seq s];

  natToSeq: nat -> seq of Digit
  natToSeq(n) ==
    if n < 10
    then [n]
    else natToSeq(n div 10) ^ [n rem 10]
  measure n;

traces
  /**
   * Generate all the possible 1, 2 and 3 digit sequences and check that the luhn
   * calculation completes without breaking any constraints.
   */
  First1000:
    let a,b,c,d in set {0,...,9} in
    (
      luhn([a]);
      luhn([a,b]);
      luhn([a,b,c]);
      luhn([a,b,c,d])
    );
    
  /**
   * The Luhn algorithm will detect any single-digit error, as well as almost all
   * transpositions of adjacent digits. It will not, however, detect transposition
   * of the two-digit sequence 09 to 90 (or vice versa).
   *
   * See http://en.wikipedia.org/wiki/Luhn_algorithm
   */
  AllOneDigitErrors:
    let input = [7,9,9,2,7,3,9,8,7,1] in
    let pos in set inds input in
    let replacement in set {0,...,9} \ {input(pos)} in
    let corrupt = input(1,...,pos-1) ^ [replacement] ^ input(pos+1,...,len input) in
      checkFail(corrupt, 3);

  AllAdjacentTranspositions:
    let input = [7,9,9,2,7,3,9,8,7,1] in
    let pos in set inds tl input be st  -- ie. one less that the length
      input(pos+1) <> input(pos)
      and {input(pos+1), input(pos)} <> {0,9} in
    let replacement = [input(pos+1), input(pos)] in
    let corrupt = input(1,...,pos-1) ^ replacement ^ input(pos+2,...,len input) in
      checkFail(corrupt, 3);

--  AllTwoDigitErrors:
--    let input = [7,9,9,2,7,3,9,8,7,1] in
--    let p1, p2 in set inds input in
--    let r1 in set {0,...,9} \ {input(p1)} in
--    let r2 in set {0,...,9} \ {input(p2)} in
--    let first  = input(1,...,p1-1) ^ [r1] ^ input(p1+1,...,len input) in
--    let second = first(1,...,p2-1) ^ [r2] ^ first(p2+1,...,len first) in
--      checkFail(second, 3);
  
  /**
   * It will detect 7 of the 10 possible twin errors (it will not detect
   * 22 <> 55, 33 <> 66 or 44 <> 77).
   *
   * See http://en.wikipedia.org/wiki/Luhn_algorithm
   */
  AllTwinErrors:
    let input = [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,0,0] in
    let pos in set inds tl input be st input(pos) = input(pos+1) in
    let rep in set {0,...,9} \ {input(pos)} in
    let corrupt = input(1,...,pos-1) ^ [rep, rep] ^ input(pos+2,...,len input) in
      checkFail(corrupt, 0);
  
  /**
   * Because the algorithm operates on the digits in a right-to-left manner and zero
   * digits affect the result only if they cause shift in position, zero-padding the
   * beginning of a string of numbers does not affect the calculation.
   *
   * See http://en.wikipedia.org/wiki/Luhn_algorithm
   */
  ZeroPadding:
    let input = [7,9,9,2,7,3,9,8,7,1] in
    let number in set {1, ..., 10} in
    let padding = [p-p | p in set {1, ..., number}] in 
      checkOK(padding ^ input, 3);
  
operations
  /**
   * These operations support the traces above
   */
  checkFail: seq1 of Digit * Digit ==> bool
  checkFail(data, expected) ==
    return luhn(data) <> expected  -- Expect failure!
  post RESULT = true;
  
  checkOK: seq1 of Digit * Digit ==> bool
  checkOK(data, expected) ==
    return luhn(data) = expected  -- Expect success!
  post RESULT = true;
  
~~~
{% endraw %}

