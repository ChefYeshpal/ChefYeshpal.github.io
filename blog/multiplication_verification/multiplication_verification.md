# What are you blabbering on about you fool!

So, you may have one day multiplied a few numbers in your 3rd grade, let's say 52 multiplied by 12. What was your answer?

Well, it probably went something like this, right?

<figure style="text-align: center;">
  <img src="1.png" alt="Very boring multiplication" width="256" height="256" style="image-rendering: pixelated;">
  <figcaption>How you'd normally do it...</figcaption>
</figure>

But then maybe must have stopped and thought for a second, 
> "wait... is this correct? I mean, w-what if I get this wrong?? what if the teacher berates me in front of the entire class!?!?!??!!" 

and went into your first panic attack. Well, dont worry anymore, because I've backed you up little buddy.

# An Example...

I give to you, a method on verify this very multiplication, to know if it is correct or not, so let's first break the rows and all down in this a bit, something like this:
<figure style="text-align: center;">
  <img src="2.png" alt="Giving numbers to the lines" width="256" height="256" style="image-rendering: pixelated;">
</figure>
So what've we done here? well, just given each line a number. And now the magic happens...

What we'll do now is:
- In the 1st line
  - Add the digit's of 5 and 2, which gives us 7
  - 5 + 2 = 7
  - This is a one digit number, so let it be as it is.
- In the 2nd line
  - Add the digits of 1 and 2, which gives us 3
  - 1 + 2 = 3
  - This is also a one digit number, so let it be as it is.
- Then, we'll multiply the 7 and 3 we have
  - 7 x 3 = 21
  - Let's add this again to make it a one digit number, making it 3
  - 2 + 1 = 3
  - No need for further addition, as it's a single digit number.
- In the 5th line
  - Add the digits 6, 2 and 4, which gives us 12
    - 6 + 2 + 4 = 12
  - Then, as 12 is a **two digit** number rather than one digit, we shall add it's numbers as well until it is also a one digit number
  - 1 + 2 = 3
  - 3 is a one digit number, so leave it be.

So, from that entire escapade what we got was two numbers... or, was it?

Looking closer, you can notice that when we added the number's of 1st and 2nd line **till** they became single-digit and then multiplyed it, then added it's digits again **if** it was more than single digit.

And, what did we get at the end? Two numbers, both the same. Meaning the addition of solution of 6, 2 and 4 till it became a unit digit was the same as the addition of the question numbers (i.e. 52 and 12) and their multiplication, then addition again till it was a single-digit number, were the same (i.e.3).

So, you may be asking:

> "Well okhay! But like... how do I know why it works huh?!??! are you just spouting nonsense???!?!?!"

I'll explain it to you, dont worry little one...

---

## How it works... and why.

The trick you just saw is actually a classic method known as *casting out nines*. It's based on a cool property of numbers related to something called **modulo 9 arithmetic**. Let me explain it in a simple way.

### Digital Root: The Key Idea

Every number can be reduced to a single digit by adding all its digits together, and if the result has more than one digit, you add those digits again. You repeat this until only one digit remains. This final single digit is called the **digital root**.

For example:
- The digital root of 52 is 5 + 2 = 7.
- The digital root of 12 is 1 + 2 = 3.

This digital root is special because it represents the original number’s remainder when divided by 9. We say:
$$
52 \equiv 7 \pmod{9}, \quad 12 \equiv 3 \pmod{9}
$$

### Why Multiplication Matches

When you multiply two numbers, their digital roots multiply in a way that matches the digital root of their product, because multiplication respects this modulo 9 relationship.

So, for the example:
- Digital roots:
  $$
  7 \times 3 = 21 
  $$
- Reduce 21 to a single digit:
  $$
  2 + 1 = 3
  $$
- Now check the product:
  $$
  52 \times 12 = 624
  $$
- Digital root of 624:
  $$
  6 + 2 + 4 = 12 \rightarrow 1 + 2 = 3
  $$

Since both give you 3, this confirms your multiplication likely didn’t have any simple errors!

### The Mathematical Reason

This works because of the key rule of modulo arithmetic:
$$
(a \times b) \bmod 9 = \big((a \bmod 9) \times (b \bmod 9)\big) \bmod 9
$$

So, whether you:
- Find the digital root of each number first and then multiply, **or**
- Multiply the numbers first and then find the digital root,

You will always end up with the same final single-digit number.

### What This Means for You

The digital root method is a handy way to **check** your multiplication answers quickly. If the digital root of your calculated answer doesn’t match the digital root of the multiplied digital roots, you know something went wrong.

### Keep In Mind...

- This trick can catch many mistakes, but **not all**. Sometimes different wrong answers can have the same digital root, so it’s **not** a *perfect* proof.
- It also works for addition and subtraction, making it a neat universal math check!

## Any cases where it doesn't work?

While the digital root (or casting out nines) method is a great quick check for multiplication and other arithmetic, it is important to understand that it **doesn’t catch every possible mistake**. Here are some cases where it might fail or give misleading results:

### Different Numbers Can Have The Same Digital Root

Two completely different numbers can have the same digital root because the digital root only captures the remainder mod 9. For example:

- \(23\) has digits \(2 + 3 = 5\), digital root \(= 5\).
- \(14\) has digits \(1 + 4 = 5\), digital root \(= 5\).

Even though \(23 \neq 14\), their digital roots are the same. So if you mistakenly use one number instead of the other, the check won’t catch that.

### Incorrect Products With Same Digital Root

The main problem is this: **A wrong answer can have the same digital root as the correct answer**, fooling the check.

For example, if the correct multiplication result has a digital root of 6, but your incorrect answer also has a digital root of 6, the casting out nines check will pass even though the answer is wrong.

### Why This Happens

This is a consequence of how modulo arithmetic works:
- Modulo 9 *collapses* many different numbers into the same equivalence class.
- Your check only verifies correctness *mod 9*, not exact equality.
- In other words, it confirms the answer is "right modulo 9," but the actual number could be off by a multiple of 9.

### Practical Implications

- For small calculations or basic error catching, it works really well and is quick.
- For very important or complex calculations, **never rely on this method alone**.
- Always do a full check or use a calculator for perfect certainty.

# Try it yourself!

Multiply the two numbers below. I've given the answer beforehand, all you have to do is check wether it's right or not!

**Multiply these:**

- Number 1: 2234 
- Number 2: 435
- Answer: 971793

Try to verify it, see if it works and celebrate with a little toffee!

---
## TL;DR

The trick works because of *casting out nines* (digital roots). By reducing numbers to their single form (mod 9), you can check if a multiplication is likely correct:
- Find the digital root of each number, multiply them, then reduce to a single digit.
- Compare this with the digital root of your final answer.
- If they match, then your answer is *probably* right. If not, it's definately wrong.
**But beware: two different numbers can share the same digital root, so this method is only a quick error check, not proof**
