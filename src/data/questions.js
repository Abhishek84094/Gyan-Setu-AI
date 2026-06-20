export const questions = [
  // ================= 1-MARK QUESTIONS (1 to 10) =================
  {
    id: 1,
    marks: 1,
    subTopic: "Nature of Roots",
    difficulty: "Easy",
    isHot: true,
    question: "Find the discriminant of the quadratic equation: 2x² - 4x + 3 = 0, and hence find the nature of its roots.",
    modelSolution: [
      { step: 1, description: "Identify coefficients a = 2, b = -4, c = 3.", marks: 0.5 },
      { step: 2, description: "Calculate Discriminant D = b² - 4ac = (-4)² - 4(2)(3) = 16 - 24 = -8. Since D < 0, roots are imaginary (no real roots).", marks: 0.5 }
    ],
    expectedAnswer: "Discriminant = -8, Nature = No real roots (imaginary roots)"
  },
  {
    id: 2,
    marks: 1,
    subTopic: "Identifying Quadratic Equations",
    difficulty: "Easy",
    isHot: false,
    question: "Check whether x(x + 1) + 8 = (x + 2)(x - 2) is a quadratic equation.",
    modelSolution: [
      { step: 1, description: "Simplify LHS: x² + x + 8. Simplify RHS: x² - 4.", marks: 0.5 },
      { step: 2, description: "Equate and simplify: x + 12 = 0. Since the degree is 1, it is NOT a quadratic equation.", marks: 0.5 }
    ],
    expectedAnswer: "Not a quadratic equation"
  },
  {
    id: 3,
    marks: 1,
    subTopic: "Roots Verification",
    difficulty: "Easy",
    isHot: true,
    question: "Is x = -2 a root of the equation 3x² + 13x + 14 = 0?",
    modelSolution: [
      { step: 1, description: "Substitute x = -2 into LHS: 3(-2)² + 13(-2) + 14 = 12 - 26 + 14 = 0.", marks: 0.5 },
      { step: 2, description: "Since LHS = RHS = 0, x = -2 is a root.", marks: 0.5 }
    ],
    expectedAnswer: "Yes, x = -2 is a root"
  },
  {
    id: 4,
    marks: 1,
    subTopic: "Nature of Roots",
    difficulty: "Easy",
    isHot: false,
    question: "For what value of k does the equation kx² - 5x + k = 0 have equal roots?",
    modelSolution: [
      { step: 1, description: "For equal roots, D = b² - 4ac = 0 => (-5)² - 4(k)(k) = 0 => 25 - 4k² = 0.", marks: 0.5 },
      { step: 2, description: "Solve for k: k² = 25/4 => k = ±5/2.", marks: 0.5 }
    ],
    expectedAnswer: "k = ±5/2 (or ±2.5)"
  },
  {
    id: 5,
    marks: 1,
    subTopic: "Roots Verification",
    difficulty: "Easy",
    isHot: true,
    question: "If one root of the quadratic equation 2x² + kx - 6 = 0 is 2, find the value of k.",
    modelSolution: [
      { step: 1, description: "Substitute x = 2 in the equation: 2(2)² + k(2) - 6 = 0.", marks: 0.5 },
      { step: 2, description: "Simplify: 8 + 2k - 6 = 0 => 2k + 2 = 0 => k = -1.", marks: 0.5 }
    ],
    expectedAnswer: "k = -1"
  },
  {
    id: 6,
    marks: 1,
    subTopic: "Nature of Roots",
    difficulty: "Easy",
    isHot: false,
    question: "State the nature of roots of the quadratic equation: x² + x + 1 = 0.",
    modelSolution: [
      { step: 1, description: "Find D = b² - 4ac = 1² - 4(1)(1) = -3.", marks: 0.5 },
      { step: 2, description: "Since D < 0, the roots are non-real/imaginary.", marks: 0.5 }
    ],
    expectedAnswer: "No real roots (imaginary)"
  },
  {
    id: 7,
    marks: 1,
    subTopic: "Nature of Roots",
    difficulty: "Easy",
    isHot: false,
    question: "Find the discriminant of: √3x² + 2√2x - 2√3 = 0.",
    modelSolution: [
      { step: 1, description: "Identify a = √3, b = 2√2, c = -2√3.", marks: 0.5 },
      { step: 2, description: "D = b² - 4ac = (2√2)² - 4(√3)(-2√3) = 8 + 24 = 32.", marks: 0.5 }
    ],
    expectedAnswer: "Discriminant = 32"
  },
  {
    id: 8,
    marks: 1,
    subTopic: "Roots Verification",
    difficulty: "Easy",
    isHot: true,
    question: "If the discriminant of the quadratic equation 4x² - px + 9 = 0 is zero, find the positive value of p.",
    modelSolution: [
      { step: 1, description: "Set D = 0 => (-p)² - 4(4)(9) = 0 => p² - 144 = 0.", marks: 0.5 },
      { step: 2, description: "Solve for p: p = ±12. The positive value of p is 12.", marks: 0.5 }
    ],
    expectedAnswer: "p = 12"
  },
  {
    id: 9,
    marks: 1,
    subTopic: "Identifying Quadratic Equations",
    difficulty: "Easy",
    isHot: false,
    question: "Express the following statement as a quadratic equation: 'The product of two consecutive positive integers is 306.'",
    modelSolution: [
      { step: 1, description: "Let the integers be x and x + 1.", marks: 0.5 },
      { step: 2, description: "Product: x(x + 1) = 306 => x² + x - 306 = 0.", marks: 0.5 }
    ],
    expectedAnswer: "x² + x - 306 = 0"
  },
  {
    id: 10,
    marks: 1,
    subTopic: "Nature of Roots",
    difficulty: "Easy",
    isHot: false,
    question: "If equation x² - kx + 4 = 0 has equal roots, find values of k.",
    modelSolution: [
      { step: 1, description: "D = (-k)² - 4(1)(4) = k² - 16.", marks: 0.5 },
      { step: 2, description: "Set D = 0 => k² = 16 => k = ±4.", marks: 0.5 }
    ],
    expectedAnswer: "k = ±4"
  },

  // ================= 2-MARK QUESTIONS (11 to 20) =================
  {
    id: 11,
    marks: 2,
    subTopic: "Factorization Method",
    difficulty: "Medium",
    isHot: true,
    question: "Solve the quadratic equation x² - 3x - 10 = 0 by factorization.",
    modelSolution: [
      { step: 1, description: "Split the middle term: x² - 5x + 2x - 10 = 0.", marks: 1.0 },
      { step: 2, description: "Factorize: x(x - 5) + 2(x - 5) = 0 => (x - 5)(x + 2) = 0. Therefore, roots are x = 5 and x = -2.", marks: 1.0 }
    ],
    expectedAnswer: "x = 5, -2"
  },
  {
    id: 12,
    marks: 2,
    subTopic: "Quadratic Formula",
    difficulty: "Medium",
    isHot: false,
    question: "Solve for x using the quadratic formula: x² + 6x + 5 = 0.",
    modelSolution: [
      { step: 1, description: "Identify a = 1, b = 6, c = 5. Calculate D = 6² - 4(1)(5) = 36 - 20 = 16.", marks: 1.0 },
      { step: 2, description: "Apply quadratic formula: x = [-6 ± √16] / (2*1) = [-6 ± 4] / 2 => x = -1 or x = -5.", marks: 1.0 }
    ],
    expectedAnswer: "x = -1, -5"
  },
  {
    id: 13,
    marks: 2,
    subTopic: "Nature of Roots",
    difficulty: "Medium",
    isHot: true,
    question: "Find the values of k for which the quadratic equation 2x² + kx + 3 = 0 has two equal roots.",
    modelSolution: [
      { step: 1, description: "Set discriminant D = 0. Here, a = 2, b = k, c = 3. D = k² - 4(2)(3) = k² - 24 = 0.", marks: 1.0 },
      { step: 2, description: "Solve for k: k² = 24 => k = ±√24 = ±2√6.", marks: 1.0 }
    ],
    expectedAnswer: "k = ±2√6 (or approx ±4.9)"
  },
  {
    id: 14,
    marks: 2,
    subTopic: "Factorization Method",
    difficulty: "Medium",
    isHot: false,
    question: "Solve the quadratic equation: 6x² - x - 2 = 0.",
    modelSolution: [
      { step: 1, description: "Split the middle term: 6x² - 4x + 3x - 2 = 0.", marks: 1.0 },
      { step: 2, description: "Factorize: 2x(3x - 2) + 1(3x - 2) = 0 => (3x - 2)(2x + 1) = 0. Roots: x = 2/3, x = -1/2.", marks: 1.0 }
    ],
    expectedAnswer: "x = 2/3, -1/2"
  },
  {
    id: 15,
    marks: 2,
    subTopic: "Roots Verification",
    difficulty: "Medium",
    isHot: true,
    question: "If x = 2/3 and x = -3 are the roots of the equation ax² + 7x + b = 0, find the values of a and b.",
    modelSolution: [
      { step: 1, description: "Using sum of roots: 2/3 + (-3) = -7/a => -7/3 = -7/a => a = 3.", marks: 1.0 },
      { step: 2, description: "Using product of roots: (2/3) * (-3) = b/a => -2 = b/3 => b = -6.", marks: 1.0 }
    ],
    expectedAnswer: "a = 3, b = -6"
  },
  {
    id: 16,
    marks: 2,
    subTopic: "Quadratic Formula",
    difficulty: "Medium",
    isHot: false,
    question: "Solve for x: x - 1/x = 3, (x ≠ 0).",
    modelSolution: [
      { step: 1, description: "Form the equation: Multiply by x => x² - 1 = 3x => x² - 3x - 1 = 0.", marks: 1.0 },
      { step: 2, description: "Solve using quadratic formula: a = 1, b = -3, c = -1. x = [3 ± √(9 - 4(1)(-1))] / 2 = (3 ± √13) / 2.", marks: 1.0 }
    ],
    expectedAnswer: "x = (3 ± √13) / 2"
  },
  {
    id: 17,
    marks: 2,
    subTopic: "Factorization Method",
    difficulty: "Medium",
    isHot: false,
    question: "Find the roots of the quadratic equation 3x² - 2√6x + 2 = 0.",
    modelSolution: [
      { step: 1, description: "Rewrite: 3x² - √6x - √6x + 2 = 0 => √3x(√3x - √2) - √2(√3x - √2) = 0.", marks: 1.0 },
      { step: 2, description: "Factorize: (√3x - √2)(√3x - √2) = 0. Real equal roots: x = √2/√3, √2/√3.", marks: 1.0 }
    ],
    expectedAnswer: "x = √(2/3), √(2/3)"
  },
  {
    id: 18,
    marks: 2,
    subTopic: "Word Problems",
    difficulty: "Medium",
    isHot: true,
    question: "Find two numbers whose sum is 27 and product is 182.",
    modelSolution: [
      { step: 1, description: "Let the numbers be x and (27 - x). Set equation: x(27 - x) = 182 => x² - 27x + 182 = 0.", marks: 1.0 },
      { step: 2, description: "Factorize: (x - 13)(x - 14) = 0. The numbers are 13 and 14.", marks: 1.0 }
    ],
    expectedAnswer: "13 and 14"
  },
  {
    id: 19,
    marks: 2,
    subTopic: "Word Problems",
    difficulty: "Medium",
    isHot: false,
    question: "The altitude of a right triangle is 7 cm less than its base. If the hypotenuse is 13 cm, find the other two sides.",
    modelSolution: [
      { step: 1, description: "Let base be x cm. Altitude = x - 7 cm. Pythagoras theorem: x² + (x - 7)² = 13² => 2x² - 14x + 49 = 169 => 2x² - 14x - 120 = 0 => x² - 7x - 60 = 0.", marks: 1.0 },
      { step: 2, description: "Factorize: (x - 12)(x + 5) = 0. Since side cannot be negative, base x = 12 cm, and altitude = 12 - 7 = 5 cm.", marks: 1.0 }
    ],
    expectedAnswer: "Base = 12 cm, Altitude = 5 cm"
  },
  {
    id: 20,
    marks: 2,
    subTopic: "Nature of Roots",
    difficulty: "Medium",
    isHot: false,
    question: "If the roots of the equation (b - c)x² + (c - a)x + (a - b) = 0 are equal, prove that 2b = a + c. (Provide the key mathematical relation).",
    modelSolution: [
      { step: 1, description: "Notice x = 1 satisfies the equation since (b - c) + (c - a) + (a - b) = 0. Thus, x = 1 is one root.", marks: 1.0 },
      { step: 2, description: "Since roots are equal, both roots are 1. Product of roots = (a - b)/(b - c) = 1*1 => a - b = b - c => 2b = a + c.", marks: 1.0 }
    ],
    expectedAnswer: "2b = a + c (Roots are equal, product of roots is 1)"
  },

  // ================= 3-MARK QUESTIONS (21 to 30) =================
  {
    id: 21,
    marks: 3,
    subTopic: "Factorization Method",
    difficulty: "Medium",
    isHot: true,
    question: "Solve for x: 1/(x - 1) - 1/(x + 5) = 6/7, (x ≠ 1, -5).",
    modelSolution: [
      { step: 1, description: "Combine terms: [(x + 5) - (x - 1)] / [(x - 1)(x + 5)] = 6 / [x² + 4x - 5] = 6/7.", marks: 1.0 },
      { step: 2, description: "Cross multiply and simplify: 6(x² + 4x - 5) = 42 => x² + 4x - 5 = 7 => x² + 4x - 12 = 0.", marks: 1.0 },
      { step: 3, description: "Factorize x² + 6x - 2x - 12 = 0 => (x + 6)(x - 2) = 0. Thus, x = 2 or x = -6.", marks: 1.0 }
    ],
    expectedAnswer: "x = 2, -6"
  },
  {
    id: 22,
    marks: 3,
    subTopic: "Quadratic Formula",
    difficulty: "Hard",
    isHot: false,
    question: "Solve the quadratic equation for x: 9x² - 9(a + b)x + (2a² + 5ab + 2b²) = 0.",
    modelSolution: [
      { step: 1, description: "Find the discriminant D = [-9(a+b)]² - 4(9)(2a² + 5ab + 2b²) = 81(a²+2ab+b²) - 72a² - 180ab - 72b² = 9a² - 18ab + 9b² = 9(a - b)².", marks: 1.0 },
      { step: 2, description: "Calculate √D = 3(a - b). Apply quadratic formula: x = [9(a + b) ± 3(a - b)] / 18.", marks: 1.0 },
      { step: 3, description: "Evaluate solutions: Case 1: x = [12a + 6b]/18 = (2a + b)/3. Case 2: x = [6a + 12b]/18 = (a + 2b)/3.", marks: 1.0 }
    ],
    expectedAnswer: "x = (2a + b)/3, (a + 2b)/3"
  },
  {
    id: 23,
    marks: 3,
    subTopic: "Word Problems",
    difficulty: "Medium",
    isHot: true,
    question: "A motor boat whose speed is 18 km/h in still water takes 1 hour more to go 24 km upstream than to return downstream to the same spot. Find the speed of the stream.",
    modelSolution: [
      { step: 1, description: "Let speed of stream be x km/h. Upstream speed = 18 - x, Downstream speed = 18 + x.", marks: 1.0 },
      { step: 2, description: "Set time equation: 24/(18 - x) - 24/(18 + x) = 1. Combine: 24(18 + x - 18 + x) / (324 - x²) = 1 => 48x = 324 - x² => x² + 48x - 324 = 0.", marks: 1.0 },
      { step: 3, description: "Factorize: (x + 54)(x - 6) = 0. Speed cannot be negative, so stream speed is 6 km/h.", marks: 1.0 }
    ],
    expectedAnswer: "Speed of stream = 6 km/h"
  },
  {
    id: 24,
    marks: 3,
    subTopic: "Word Problems",
    difficulty: "Medium",
    isHot: false,
    question: "The sum of the reciprocals of Rehman's ages, (in years) 3 years ago and 5 years from now is 1/3. Find his present age.",
    modelSolution: [
      { step: 1, description: "Let present age be x. Rehman's age 3 years ago = x - 3, 5 years from now = x + 5. Equation: 1/(x - 3) + 1/(x + 5) = 1/3.", marks: 1.0 },
      { step: 2, description: "Simplify: [(x + 5) + (x - 3)] / (x² + 2x - 15) = 1/3 => 3(2x + 2) = x² + 2x - 15 => 6x + 6 = x² + 2x - 15 => x² - 4x - 21 = 0.", marks: 1.0 },
      { step: 3, description: "Factorize: (x - 7)(x + 3) = 0. Age cannot be negative, so present age is 7 years.", marks: 1.0 }
    ],
    expectedAnswer: "7 years"
  },
  {
    id: 25,
    marks: 3,
    subTopic: "Factorization Method",
    difficulty: "Hard",
    isHot: false,
    question: "Solve for x: (x - 3)/(x + 3) - (x + 3)/(x - 3) = 48/7, (x ≠ 3, -3).",
    modelSolution: [
      { step: 1, description: "Let y = (x - 3)/(x + 3). The equation is y - 1/y = 48/7 => (y² - 1)/y = 48/7 => 7y² - 48y - 7 = 0.", marks: 1.0 },
      { step: 2, description: "Factorize y: 7y² - 49y + y - 7 = 0 => (7y + 1)(y - 7) = 0 => y = 7 or y = -1/7.", marks: 1.0 },
      { step: 3, description: "Substitute y back: Case 1: (x - 3)/(x + 3) = 7 => x - 3 = 7x + 21 => 6x = -24 => x = -4. Case 2: (x - 3)/(x + 3) = -1/7 => 7x - 21 = -x - 3 => 8x = 18 => x = 9/4. Therefore, x = -4, 9/4.", marks: 1.0 }
    ],
    expectedAnswer: "x = -4, 9/4"
  },
  {
    id: 26,
    marks: 3,
    subTopic: "Word Problems",
    difficulty: "Medium",
    isHot: true,
    question: "Two water taps together can fill a tank in 9⅜ hours. The tap of larger diameter takes 10 hours less than the smaller one to fill the tank separately. Find the time in which each tap can separately fill the tank.",
    modelSolution: [
      { step: 1, description: "Let smaller tap take x hours. Larger tap takes (x - 10) hours. Tank fills in 75/8 hours. Equation: 1/x + 1/(x - 10) = 8/75.", marks: 1.0 },
      { step: 2, description: "Simplify: [2x - 10] / [x(x - 10)] = 8/75 => 75(2x - 10) = 8(x² - 10x) => 150x - 750 = 8x² - 80x => 8x² - 230x + 750 = 0 => 4x² - 115x + 375 = 0.", marks: 1.0 },
      { step: 3, description: "Factorize: 4x² - 100x - 15x + 375 = 0 => 4x(x - 25) - 15(x - 25) = 0 => (4x - 15)(x - 25) = 0. x = 25 (x = 15/4 is rejected since larger tap would be negative). Smaller tap = 25 hrs, Larger tap = 15 hrs.", marks: 1.0 }
    ],
    expectedAnswer: "Smaller tap = 25 hours, Larger tap = 15 hours"
  },
  {
    id: 27,
    marks: 3,
    subTopic: "Roots Verification",
    difficulty: "Hard",
    isHot: false,
    question: "Determine the values of m for which the quadratic equation (m + 1)x² - 2(m - 1)x + 1 = 0 has real and equal roots.",
    modelSolution: [
      { step: 1, description: "Set D = 0 => [-2(m - 1)]² - 4(m + 1)(1) = 0.", marks: 1.0 },
      { step: 2, description: "Expand: 4(m² - 2m + 1) - 4m - 4 = 0 => 4m² - 8m + 4 - 4m - 4 = 0 => 4m² - 12m = 0.", marks: 1.0 },
      { step: 3, description: "Solve: 4m(m - 3) = 0 => m = 0 or m = 3. Since m+1 cannot be 0 (equation would not be quadratic), m = 0 or 3 are both acceptable roots.", marks: 1.0 }
    ],
    expectedAnswer: "m = 0 or m = 3"
  },
  {
    id: 28,
    marks: 3,
    subTopic: "Factorization Method",
    difficulty: "Medium",
    isHot: false,
    question: "Solve for x: x² + 5x - (a² + a - 6) = 0.",
    modelSolution: [
      { step: 1, description: "Factorize constant term: a² + a - 6 = (a + 3)(a - 2).", marks: 1.0 },
      { step: 2, description: "Split middle term of equation: x² + [(a + 3) - (a - 2)]x - (a + 3)(a - 2) = 0 => x² + (a + 3)x - (a - 2)x - (a + 3)(a - 2) = 0.", marks: 1.0 },
      { step: 3, description: "Factorize: (x + a + 3)(x - (a - 2)) = 0. Therefore, roots are x = -(a + 3) and x = a - 2.", marks: 1.0 }
    ],
    expectedAnswer: "x = -(a + 3), a - 2"
  },
  {
    id: 29,
    marks: 3,
    subTopic: "Quadratic Formula",
    difficulty: "Hard",
    isHot: true,
    question: "Solve the equation: 1/(x + 4) - 1/(x - 7) = 11/30, (x ≠ -4, 7).",
    modelSolution: [
      { step: 1, description: "Combine LHS: [(x - 7) - (x + 4)] / [(x + 4)(x - 7)] = -11 / [x² - 3x - 28] = 11/30.", marks: 1.0 },
      { step: 2, description: "Divide both sides by 11: -1 / [x² - 3x - 28] = 1/30 => x² - 3x - 28 = -30 => x² - 3x + 2 = 0.", marks: 1.0 },
      { step: 3, description: "Solve: (x - 1)(x - 2) = 0. Roots: x = 1, 2.", marks: 1.0 }
    ],
    expectedAnswer: "x = 1, 2"
  },
  {
    id: 30,
    marks: 3,
    subTopic: "Word Problems",
    difficulty: "Medium",
    isHot: false,
    question: "A pole has to be erected at a point on the boundary of a circular park of diameter 13 metres in such a way that the differences of its distances from two diametrically opposite fixed gates A and B on the boundary is 7 metres. Is it possible to do so? If yes, at what distances from the two gates should the pole be erected?",
    modelSolution: [
      { step: 1, description: "Let the distance from gate B be x metres. Distance from gate A = x + 7 metres. Angle in semicircle is 90°, so AP² + BP² = AB².", marks: 1.0 },
      { step: 2, description: "Equation: x² + (x + 7)² = 13² => 2x² + 14x + 49 = 169 => 2x² + 14x - 120 = 0 => x² + 7x - 60 = 0.", marks: 1.0 },
      { step: 3, description: "Factorize: (x + 12)(x - 5) = 0. Reject x = -12. Distance from gate B = 5 m, from gate A = 12 m. Yes, it is possible.", marks: 1.0 }
    ],
    expectedAnswer: "Yes; Distances: 5 m and 12 m"
  },

  // ================= 4-MARK QUESTIONS (31 to 40) =================
  {
    id: 31,
    marks: 4,
    subTopic: "Word Problems",
    difficulty: "Hard",
    isHot: true,
    question: "An express train takes 1 hour less than a passenger train to travel 132 km between Mysore and Bangalore (without taking into consideration the time they stop at intermediate stations). If the average speed of the express train is 11 km/h more than that of the passenger train, find the average speed of the two trains.",
    modelSolution: [
      { step: 1, description: "Let average speed of passenger train be x km/h. Speed of express train = (x + 11) km/h.", marks: 1.0 },
      { step: 2, description: "Set up the time equation: 132/x - 132/(x + 11) = 1.", marks: 1.0 },
      { step: 3, description: "Simplify equation: 132(x + 11 - x) = x(x + 11) => 1452 = x² + 11x => x² + 11x - 1452 = 0.", marks: 1.0 },
      { step: 4, description: "Factorize: x² + 44x - 33x - 1452 = 0 => (x + 44)(x - 33) = 0. Reject negative speed. Passenger train speed = 33 km/h, Express train speed = 44 km/h.", marks: 1.0 }
    ],
    expectedAnswer: "Passenger Train = 33 km/h, Express Train = 44 km/h"
  },
  {
    id: 32,
    marks: 4,
    subTopic: "Word Problems",
    difficulty: "Hard",
    isHot: true,
    question: "A faster train takes one hour less than a slower train for a journey of 200 km. If the speed of the slower train is 10 km/h less than that of the faster train, find the speeds of two trains.",
    modelSolution: [
      { step: 1, description: "Let speed of faster train be x km/h. Speed of slower train = (x - 10) km/h.", marks: 1.0 },
      { step: 2, description: "Write equation: 200/(x - 10) - 200/x = 1.", marks: 1.0 },
      { step: 3, description: "Simplify: 200(x - x + 10) / [x(x - 10)] = 1 => 2000 = x² - 10x => x² - 10x - 2000 = 0.", marks: 1.0 },
      { step: 4, description: "Factorize: (x - 50)(x + 40) = 0. Reject negative speed. Faster train = 50 km/h, Slower train = 40 km/h.", marks: 1.0 }
    ],
    expectedAnswer: "Faster Train = 50 km/h, Slower Train = 40 km/h"
  },
  {
    id: 33,
    marks: 4,
    subTopic: "Word Problems",
    difficulty: "Hard",
    isHot: false,
    question: "In a class test, the sum of Shefali's marks in Mathematics and English is 30. Had she got 2 marks more in Mathematics and 3 marks less in English, the product of their marks would have been 210. Find her marks in the two subjects.",
    modelSolution: [
      { step: 1, description: "Let marks in Maths be x. Marks in English = (30 - x).", marks: 1.0 },
      { step: 2, description: "New marks: Maths = x + 2, English = (30 - x) - 3 = 27 - x. Product: (x + 2)(27 - x) = 210.", marks: 1.0 },
      { step: 3, description: "Simplify: 27x - x² + 54 - 2x = 210 => x² - 25x + 156 = 0.", marks: 1.0 },
      { step: 4, description: "Factorize: (x - 12)(x - 13) = 0. Case 1: Maths = 12, English = 18. Case 2: Maths = 13, English = 17.", marks: 1.0 }
    ],
    expectedAnswer: "Maths = 12 & English = 18 OR Maths = 13 & English = 17"
  },
  {
    id: 34,
    marks: 4,
    subTopic: "Word Problems",
    difficulty: "Hard",
    isHot: false,
    question: "The diagonal of a rectangular field is 60 metres more than the shorter side. If the longer side is 30 metres more than the shorter side, find the sides of the field.",
    modelSolution: [
      { step: 1, description: "Let shorter side be x metres. Longer side = (x + 30) metres. Diagonal = (x + 60) metres.", marks: 1.0 },
      { step: 2, description: "Using Pythagoras theorem: x² + (x + 30)² = (x + 60)².", marks: 1.0 },
      { step: 3, description: "Expand: x² + x² + 60x + 900 = x² + 120x + 3600 => x² - 60x - 2700 = 0.", marks: 1.0 },
      { step: 4, description: "Factorize: (x - 90)(x + 30) = 0. Reject negative value. Shorter side = 90 m, Longer side = 90 + 30 = 120 m.", marks: 1.0 }
    ],
    expectedAnswer: "Shorter side = 90 m, Longer side = 120 m"
  },
  {
    id: 35,
    marks: 4,
    subTopic: "Word Problems",
    difficulty: "Hard",
    isHot: true,
    question: "The difference of squares of two numbers is 180. The square of the smaller number is 8 times the larger number. Find the two numbers.",
    modelSolution: [
      { step: 1, description: "Let the larger number be x. The square of the smaller number = 8x.", marks: 1.0 },
      { step: 2, description: "Set up the equation: (Larger number)² - (Smaller number)² = 180 => x² - 8x = 180 => x² - 8x - 180 = 0.", marks: 1.0 },
      { step: 3, description: "Factorize: (x - 18)(x + 10) = 0. Reject x = -10 (leads to negative square for smaller number). Larger number x = 18.", marks: 1.0 },
      { step: 4, description: "Find smaller number: y² = 8(18) = 144 => y = ±12. The numbers are (18, 12) or (18, -12).", marks: 1.0 }
    ],
    expectedAnswer: "18 and 12 (or 18 and -12)"
  },
  {
    id: 36,
    marks: 4,
    subTopic: "Word Problems",
    difficulty: "Hard",
    isHot: false,
    question: "A passenger train takes 2 hours less for a journey of 300 km if its speed is increased by 5 km/h from its usual speed. Find its usual speed.",
    modelSolution: [
      { step: 1, description: "Let usual speed be x km/h. Increased speed = (x + 5) km/h.", marks: 1.0 },
      { step: 2, description: "Equation: 300/x - 300/(x + 5) = 2.", marks: 1.0 },
      { step: 3, description: "Simplify: 300(x + 5 - x) = 2x(x + 5) => 1500 = 2x² + 10x => x² + 5x - 750 = 0.", marks: 1.0 },
      { step: 4, description: "Factorize: (x + 30)(x - 25) = 0. Reject x = -30. Usual speed = 25 km/h.", marks: 1.0 }
    ],
    expectedAnswer: "25 km/h"
  },
  {
    id: 37,
    marks: 4,
    subTopic: "Word Problems",
    difficulty: "Hard",
    isHot: true,
    question: "A plane left 30 minutes later than the scheduled time and in order to reach its destination 1500 km away in time, it had to increase its speed by 250 km/h from its usual speed. Find its usual speed.",
    modelSolution: [
      { step: 1, description: "Let usual speed be x km/h. New speed = (x + 250) km/h. Delay = 30 mins = 1/2 hour.", marks: 1.0 },
      { step: 2, description: "Set equation: 1500/x - 1500/(x + 250) = 1/2.", marks: 1.0 },
      { step: 3, description: "Simplify: 1500(250) / [x(x + 250)] = 1/2 => 375,000 = x²/2 + 125x => x² + 250x - 750,000 = 0.", marks: 1.0 },
      { step: 4, description: "Factorize: (x - 750)(x + 1000) = 0. Reject negative speed. Usual speed = 750 km/h.", marks: 1.0 }
    ],
    expectedAnswer: "750 km/h"
  },
  {
    id: 38,
    marks: 4,
    subTopic: "Factorization Method",
    difficulty: "Hard",
    isHot: false,
    question: "Solve the following quadratic equation for x: 4/x - 3 = 5/(2x + 3), (x ≠ 0, -3/2).",
    modelSolution: [
      { step: 1, description: "Combine LHS: (4 - 3x)/x = 5/(2x + 3).", marks: 1.0 },
      { step: 2, description: "Cross multiply: (4 - 3x)(2x + 3) = 5x => 8x + 12 - 6x² - 9x = 5x => -6x² - x + 12 = 5x.", marks: 1.0 },
      { step: 3, description: "Arrange in standard form: 6x² + 6x - 12 = 0 => x² + x - 2 = 0.", marks: 1.0 },
      { step: 4, description: "Solve: (x + 2)(x - 1) = 0 => roots are x = -2, 1.", marks: 1.0 }
    ],
    expectedAnswer: "x = -2, 1"
  },
  {
    id: 39,
    marks: 4,
    subTopic: "Word Problems",
    difficulty: "Hard",
    isHot: true,
    question: "In a flight of 600 km, an aircraft was slowed down due to bad weather. Its average speed for the trip was reduced by 200 km/h and the time of flight increased by 30 minutes. Find the original duration of the flight.",
    modelSolution: [
      { step: 1, description: "Let original speed be x km/h. New speed = (x - 200) km/h. Equation: 600/(x - 200) - 600/x = 1/2.", marks: 1.0 },
      { step: 2, description: "Simplify: 600(x - (x - 200)) / [x(x - 200)] = 1/2 => 120,000 / [x² - 200x] = 1/2 => x² - 200x - 240,000 = 0.", marks: 1.0 },
      { step: 3, description: "Factorize: (x - 600)(x + 400) = 0. Reject x = -400. Original speed = 600 km/h.", marks: 1.0 },
      { step: 4, description: "Find duration: Original time = Distance / Speed = 600 / 600 = 1 hour.", marks: 1.0 }
    ],
    expectedAnswer: "1 hour (Original Speed = 600 km/h)"
  },
  {
    id: 40,
    marks: 4,
    subTopic: "Word Problems",
    difficulty: "Hard",
    isHot: false,
    question: "A dealer sells a toy for ₹24 and gains as much percent as the cost price of the toy. Find the cost price of the toy.",
    modelSolution: [
      { step: 1, description: "Let CP of toy be ₹x. Gain percent = x%. Profit = x% of x = x²/100.", marks: 1.0 },
      { step: 2, description: "Selling Price (SP) = CP + Profit => 24 = x + x²/100.", marks: 1.0 },
      { step: 3, description: "Multiply by 100: 2400 = 100x + x² => x² + 100x - 2400 = 0.", marks: 1.0 },
      { step: 4, description: "Factorize: (x + 120)(x - 20) = 0. Cost price cannot be negative, so CP = ₹20.", marks: 1.0 }
    ],
    expectedAnswer: "₹20"
  }
];
