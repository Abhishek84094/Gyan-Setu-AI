import React, { useState } from 'react';
import { HelpCircle, Calculator, BookOpen, Layers } from 'lucide-react';

export default function CheatSheet() {
  // Calculator state
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);

  const calculateRoots = () => {
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      return { err: "Enter valid numbers" };
    }
    if (numA === 0) {
      return { err: "Coeff 'a' cannot be 0 for a quadratic equation." };
    }

    const D = numB * numB - 4 * numA * numC;
    let nature = "";
    let solutionSteps = [];
    let rootsResult = "";

    solutionSteps.push(`1. Identify coefficients: a = ${numA}, b = ${numB}, c = ${numC}`);
    solutionSteps.push(`2. Calculate Discriminant (D) = b² - 4ac`);
    solutionSteps.push(`   D = (${numB})² - 4 × (${numA}) × (${numC})`);
    solutionSteps.push(`   D = ${numB * numB} - ${4 * numA * numC}`);
    solutionSteps.push(`   D = ${D}`);

    if (D > 0) {
      nature = "Real and Distinct Roots";
      const root1 = (-numB + Math.sqrt(D)) / (2 * numA);
      const root2 = (-numB - Math.sqrt(D)) / (2 * numA);
      solutionSteps.push(`3. Since D > 0, roots are real and distinct:`);
      solutionSteps.push(`   x = [-b ± √D] / 2a`);
      solutionSteps.push(`   x = [-(${numB}) ± √${D}] / (2 × ${numA})`);
      solutionSteps.push(`   x = [${-numB} ± ${Math.sqrt(D).toFixed(2)}] / ${2 * numA}`);
      solutionSteps.push(`   x₁ = [${-numB} + ${Math.sqrt(D).toFixed(2)}] / ${2 * numA} = ${root1.toFixed(3)}`);
      solutionSteps.push(`   x₂ = [${-numB} - ${Math.sqrt(D).toFixed(2)}] / ${2 * numA} = ${root2.toFixed(3)}`);
      rootsResult = `Roots are distinct: x = ${root1.toFixed(2)}, x = ${root2.toFixed(2)}`;
    } else if (D === 0) {
      nature = "Real and Equal Roots";
      const root = -numB / (2 * numA);
      solutionSteps.push(`3. Since D = 0, roots are real and equal:`);
      solutionSteps.push(`   x = -b / 2a`);
      solutionSteps.push(`   x = -(${numB}) / (2 × ${numA}) = ${root.toFixed(3)}`);
      rootsResult = `Equal Roots: x = ${root.toFixed(2)} (twice)`;
    } else {
      nature = "No Real Roots (Imaginary)";
      const realPart = -numB / (2 * numA);
      const imagPart = Math.sqrt(-D) / (2 * numA);
      solutionSteps.push(`3. Since D < 0, roots are non-real (complex/imaginary):`);
      solutionSteps.push(`   x = [-b ± i√(-D)] / 2a`);
      solutionSteps.push(`   x = [${-numB} ± i√${-D}] / ${2 * numA}`);
      solutionSteps.push(`   x = ${realPart.toFixed(2)} ± ${imagPart.toFixed(2)}i`);
      rootsResult = `Imaginary roots: x = ${realPart.toFixed(2)} ± ${imagPart.toFixed(2)}i`;
    }

    return { D, nature, steps: solutionSteps, result: rootsResult };
  };

  const calc = calculateRoots();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      
      {/* Formulas & Concepts */}
      <div className="md:col-span-2 space-y-6">
        
        {/* Core Concepts */}
        <div className="bg-gray-900 border border-gray-850 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <BookOpen className="w-24 h-24 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" /> Core Concepts
          </h3>
          <p className="text-sm text-gray-400 mb-4 leading-relaxed">
            A polynomial equation of degree 2 is called a <strong className="text-gray-200">Quadratic Equation</strong>. 
            The general or standard form is:
          </p>
          <div className="bg-gray-950 border border-gray-800 p-4 rounded-xl text-center font-mono text-lg text-indigo-300 font-semibold mb-4">
            ax² + bx + c = 0 <span className="text-gray-500 text-xs ml-2 font-normal">(where a ≠ 0)</span>
          </div>
          <p className="text-xs text-gray-500">
            *Note: If a = 0, the equation reduces to bx + c = 0, which is a linear equation.
          </p>
        </div>

        {/* Root Characteristics */}
        <div className="bg-gray-900 border border-gray-850 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" /> Nature of Roots (Discriminant)
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            The term <strong className="text-gray-200">D = b² - 4ac</strong> determines the nature of roots:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="py-2.5 font-semibold">Discriminant Value (D)</th>
                  <th className="py-2.5 font-semibold">Nature of Roots</th>
                  <th className="py-2.5 font-semibold">Formula for Roots</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-805">
                <tr>
                  <td className="py-3 font-mono font-semibold text-emerald-400">D &gt; 0</td>
                  <td className="py-3 text-gray-300">Two Real and Distinct Roots</td>
                  <td className="py-3 font-mono text-gray-400">x = (-b ± √D) / 2a</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono font-semibold text-indigo-400">D = 0</td>
                  <td className="py-3 text-gray-300">Two Real and Equal Roots</td>
                  <td className="py-3 font-mono text-gray-400">x = -b / 2a</td>
                </tr>
                <tr>
                  <td className="py-3 font-mono font-semibold text-rose-400">D &lt; 0</td>
                  <td className="py-3 text-gray-300">No Real Roots (Imaginary)</td>
                  <td className="py-3 font-mono text-gray-400">x = (-b ± i√-D) / 2a</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sum and Product of Roots */}
        <div className="bg-gray-900 border border-gray-850 p-6 rounded-2xl grid grid-cols-2 gap-4">
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-805">
            <h4 className="text-xs text-gray-500 uppercase font-semibold mb-1">Sum of Roots (α + β)</h4>
            <div className="text-lg font-mono font-semibold text-indigo-300">-b / a</div>
            <p className="text-[11px] text-gray-400 mt-1">Sum equals negative x coefficient divided by x² coefficient.</p>
          </div>
          <div className="bg-gray-950 p-4 rounded-xl border border-gray-805">
            <h4 className="text-xs text-gray-500 uppercase font-semibold mb-1">Product of Roots (α × β)</h4>
            <div className="text-lg font-mono font-semibold text-emerald-300">c / a</div>
            <p className="text-[11px] text-gray-400 mt-1">Product equals constant term divided by x² coefficient.</p>
          </div>
        </div>

      </div>

      {/* Interactive Solver Widget */}
      <div className="bg-gray-900 border border-gray-850 p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" /> Interactive Solver
          </h3>
          <p className="text-xs text-gray-400 mb-5 leading-relaxed">
            Plugs in coefficients into the Quadratic Formula: <code className="bg-gray-950 px-1 py-0.5 rounded text-[11px]">[-b ± √(b² - 4ac)] / 2a</code> to visualize steps.
          </p>

          {/* Coefficients Input */}
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Coefficient a (x²)</label>
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Coefficient b (x)</label>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">Constant c</label>
              <input
                type="number"
                value={c}
                onChange={(e) => setC(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Results Visualizer */}
          <div className="border-t border-gray-800 pt-4 space-y-3">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Step-by-Step Output</h4>
            
            {calc.err ? (
              <div className="bg-rose-950/20 text-rose-400 text-xs border border-rose-900 p-3 rounded-lg">
                {calc.err}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2.5 bg-gray-950 rounded-lg border border-gray-805">
                  <span className="text-xs text-gray-400">Discriminant (D)</span>
                  <span className={`font-mono font-bold text-sm ${calc.D >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{calc.D}</span>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-gray-950 rounded-lg border border-gray-805">
                  <span className="text-xs text-gray-400">Nature of Roots</span>
                  <span className="text-xs font-semibold text-gray-200">{calc.nature}</span>
                </div>

                <div className="bg-gray-950 border border-gray-805 rounded-lg p-3 text-[11px] font-mono text-gray-400 space-y-1.5 max-h-36 overflow-y-auto">
                  {calc.steps.map((step, idx) => (
                    <div key={idx} className="whitespace-pre">{step}</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {!calc.err && (
          <div className="mt-4 p-3 bg-indigo-950/20 border border-indigo-900 rounded-xl text-center">
            <span className="block text-[10px] uppercase font-bold tracking-widest text-indigo-400 mb-0.5">Final Solution</span>
            <span className="text-xs font-bold font-mono text-indigo-200">{calc.result}</span>
          </div>
        )}
      </div>

    </div>
  );
}
