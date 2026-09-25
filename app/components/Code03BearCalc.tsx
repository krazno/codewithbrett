"use client";

const BEARCALC = `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {

        Scanner input = new Scanner(System.in);

        System.out.print("Enter the first whole number: ");
        int firstNumber = input.nextInt();

        System.out.print("Enter the second whole number: ");
        int secondNumber = input.nextInt();

        // Calculator information
        String calculatorName = "BearCalc";
        boolean isReady = true;
        int calculationCount = 0;

        // Calculations
        int sum = firstNumber + secondNumber;
        calculationCount += 1;

        int difference = firstNumber - secondNumber;
        calculationCount += 1;

        int product = firstNumber * secondNumber;
        calculationCount += 1;

        double quotient = (double) firstNumber / secondNumber;
        calculationCount += 1;

        int remainder = firstNumber % secondNumber;
        calculationCount += 1;

        // Output
        System.out.println();
        System.out.println("Calculator: " + calculatorName);
        System.out.println(firstNumber + " + " + secondNumber + " = " + sum);
        System.out.println(firstNumber + " - " + secondNumber + " = " + difference);
        System.out.println(firstNumber + " * " + secondNumber + " = " + product);
        System.out.println(firstNumber + " / " + secondNumber + " = " + quotient);
        System.out.println(firstNumber + " % " + secondNumber + " = " + remainder);

        System.out.println();
        System.out.println("Calculations completed: " + calculationCount);
        System.out.println("Ready: " + isReady);

        input.close();
    }
}`;

function blockCopy(event: { preventDefault: () => void }) {
  event.preventDefault();
}

export function Code03BearCalc() {
  return (
    <section
      className="ua-card ua-shadow-soft p-5 md:col-span-2"
      aria-labelledby="code-03-heading"
    >
      <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
        Code 03
      </p>
      <h2
        id="code-03-heading"
        className="mt-1 font-serif text-2xl text-stone-900 sm:text-3xl"
      >
        BearCalc
      </h2>
      <p className="mt-2 text-sm text-stone-700">
        View this program, then type it into CodeHS yourself. Copying is turned
        off.
      </p>
      <pre
        aria-label="BearCalc Java program for Code 03. View only."
        className="mt-4 overflow-x-auto rounded-2xl bg-[#14382A] p-4 text-[0.8rem] leading-relaxed text-[#eff5df] select-none [-webkit-touch-callout:none] sm:text-sm"
        onCopy={blockCopy}
        onCut={blockCopy}
        onPaste={blockCopy}
        onContextMenu={blockCopy}
        onDragStart={blockCopy}
        onKeyDown={(event) => {
          const key = event.key.toLowerCase();
          if ((event.metaKey || event.ctrlKey) && (key === "c" || key === "x" || key === "a")) {
            event.preventDefault();
          }
        }}
      >
        {BEARCALC.split("\n").map((line, index) => {
          const commentAt = line.indexOf("//");
          const codePart = commentAt >= 0 ? line.slice(0, commentAt) : line;
          const comment = commentAt >= 0 ? line.slice(commentAt) : null;
          return (
            <span key={index} className="block whitespace-pre select-none">
              {codePart}
              {comment ? (
                <span className="text-[#91c83e]">{comment}</span>
              ) : null}
            </span>
          );
        })}
      </pre>
    </section>
  );
}
