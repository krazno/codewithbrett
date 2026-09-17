const TYPES_PROGRAM = `public class Main {
    public static void main(String[] args) {

        // int stores a whole number.
        // int is one of our main AP CSA data types.
        int students = 18;

        // double stores a decimal number.
        // double is one of our main AP CSA data types.
        double average = 92.5;

        // char stores exactly one character.
        // A char uses single quotation marks.
        char grade = 'A';

        // boolean stores either true or false.
        // boolean is one of our main AP CSA data types.
        boolean passed = true;

        // String stores text, but String is NOT a primitive type.
        // A String uses double quotation marks.
        String studentName = "Maya";

        System.out.println(students);
        System.out.println(average);
        System.out.println(grade);
        System.out.println(passed);
        System.out.println(studentName);
    }
}`;

const CALCULATOR_PROGRAM = `public class Main {
    public static void main(String[] args) {

        // Change these two values to test the calculator.
        double number1 = 12.0;
        double number2 = 5.0;

        // + adds the two values.
        double sum = number1 + number2;

        // - subtracts number2 from number1.
        double difference = number1 - number2;

        // * multiplies the two values.
        double product = number1 * number2;

        // / divides number1 by number2.
        double quotient = number1 / number2;

        // % finds the remainder after division.
        double remainder = number1 % number2;

        System.out.println("First number: " + number1);
        System.out.println("Second number: " + number2);
        System.out.println("Sum: " + sum);
        System.out.println("Difference: " + difference);
        System.out.println("Product: " + product);
        System.out.println("Quotient: " + quotient);
        System.out.println("Remainder: " + remainder);
    }
}`;

const DIVISION_SNIPPET = `int wholeNumberAnswer = 12 / 5;       // Result: 2
double decimalAnswer = 12.0 / 5.0;    // Result: 2.4`;

const CYCLE = [
  "Predict",
  "Run",
  "Investigate",
  "Modify",
  "Make",
] as const;

const TYPE_CARDS = [
  {
    name: "int",
    badge: "AP CSA FOCUS" as const,
    blurb: "Stores whole numbers. Requires no decimal point.",
    example: "int students = 18;",
  },
  {
    name: "double",
    badge: "AP CSA FOCUS" as const,
    blurb: "Stores decimal numbers.",
    example: "double average = 92.5;",
  },
  {
    name: "boolean",
    badge: "AP CSA FOCUS" as const,
    blurb: "Stores either true or false.",
    example: "boolean passed = true;",
  },
  {
    name: "char",
    badge: null,
    blurb: "Stores one character. Uses single quotation marks.",
    example: "char grade = 'A';",
  },
  {
    name: "String",
    badge: "REFERENCE TYPE" as const,
    blurb:
      "Stores text using double quotation marks. String is not a primitive data type.",
    example: 'String studentName = "Maya";',
  },
];

function JavaView({ code, label }: { code: string; label: string }) {
  return (
    <pre
      aria-label={label}
      className="overflow-x-auto rounded-2xl bg-[#14382A] p-4 text-[0.8rem] leading-relaxed text-[#eff5df] select-none sm:text-sm"
    >
      {code.split("\n").map((line, index) => {
        const commentAt = line.indexOf("//");
        const codePart = commentAt >= 0 ? line.slice(0, commentAt) : line;
        const comment = commentAt >= 0 ? line.slice(commentAt) : null;
        return (
          <span key={index} className="block whitespace-pre">
            {codePart}
            {comment ? (
              <span className="text-[#91c83e]">{comment}</span>
            ) : null}
          </span>
        );
      })}
    </pre>
  );
}

function Prompt({ label, children }: { label: string; children: string }) {
  return (
    <p className="text-sm leading-relaxed text-stone-700">
      <span className="font-semibold tracking-wide text-emerald-800 uppercase">
        {label}
      </span>{" "}
      {children}
    </p>
  );
}

export function JavaDataTypesLab() {
  return (
    <section
      className="ua-card ua-shadow-soft p-5 md:col-span-2"
      aria-labelledby="java-lab-heading"
    >
      <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
        AP CSA lab
      </p>
      <h2
        id="java-lab-heading"
        className="mt-1 font-serif text-2xl text-stone-900 sm:text-3xl"
      >
        Java Data Types + Arithmetic Lab
      </h2>

      <div className="mt-4 overflow-hidden rounded-2xl bg-[var(--ua-evergreen)] px-3 py-3 text-center text-white">
        <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs font-semibold tracking-[0.12em] uppercase sm:text-sm">
          {CYCLE.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-2">
              {i > 0 ? (
                <span className="text-[#D6B55B]" aria-hidden>
                  →
                </span>
              ) : null}
              {step}
            </span>
          ))}
        </p>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-stone-700">
        Do not run the code immediately. Read it first, predict what it will
        produce, and then test your thinking. Errors are information.
      </p>

      <h3 className="mt-6 font-serif text-xl text-stone-900">
        Part 1: Primitive data types
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-700">
        A data type tells Java what kind of value a variable can store. Java
        has eight primitive data types. For AP CSA, our main focus will be{" "}
        <span className="font-semibold">int</span>,{" "}
        <span className="font-semibold">double</span>, and{" "}
        <span className="font-semibold">boolean</span>. We will also use{" "}
        <span className="font-semibold">char</span> and{" "}
        <span className="font-semibold">String</span>.
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {TYPE_CARDS.map((card) => (
          <article
            key={card.name}
            className="rounded-2xl bg-emerald-50/80 p-4 ring-1 ring-stone-200/80"
          >
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-mono text-lg font-semibold text-[var(--ua-evergreen)]">
                {card.name}
              </h4>
              {card.badge ? (
                <span className="rounded-full bg-[var(--ua-evergreen)] px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide text-white uppercase">
                  {card.badge}
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-sm text-stone-700">{card.blurb}</p>
            <p className="mt-2 font-mono text-xs text-stone-800 sm:text-sm">
              {card.example}
            </p>
          </article>
        ))}
      </div>

      <aside className="mt-3 rounded-2xl border border-stone-200 bg-white p-4">
        <p className="font-serif text-lg text-stone-900">What about String?</p>
        <p className="mt-1 text-sm leading-relaxed text-stone-700">
          String is not a primitive data type. It is a reference type used to
          store text. A <span className="font-semibold">char</span> stores one
          character using single quotation marks. A{" "}
          <span className="font-semibold">String</span> stores text using
          double quotation marks.
        </p>
      </aside>

      <h3 className="mt-6 font-serif text-xl text-stone-900">
        Part 2: Read, predict, and run
      </h3>
      <div className="mt-2 space-y-1.5">
        <Prompt label="Predict">
          What five values will the program print?
        </Prompt>
        <Prompt label="Run">
          Type the program into CodeHS Cortado and run it. Do not copy and
          paste.
        </Prompt>
        <Prompt label="Investigate">
          Match each line of output to the variable that produced it.
        </Prompt>
      </div>
      <div className="mt-3">
        <JavaView
          code={TYPES_PROGRAM}
          label="Java program that prints five typed values"
        />
      </div>

      <h3 className="mt-6 font-serif text-xl text-stone-900">
        Part 3: Build a basic calculator
      </h3>
      <p className="mt-2 text-sm text-stone-700">
        Before you run it, predict all seven lines of output.
      </p>
      <div className="mt-3">
        <JavaView
          code={CALCULATOR_PROGRAM}
          label="Java calculator program using addition, subtraction, multiplication, division, and remainder"
        />
      </div>
      <article className="mt-3 rounded-2xl bg-emerald-50/80 p-4 ring-1 ring-stone-200/80">
        <p className="text-xs font-semibold tracking-wide text-emerald-800 uppercase">
          Modify it
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-stone-700">
          <li>Change number1 and number2.</li>
          <li>Predict the new results.</li>
          <li>Run the program and check your thinking.</li>
          <li>Add one new calculation of your own.</li>
          <li>Do not set number2 equal to 0 when testing division.</li>
        </ol>
      </article>

      <h3 className="mt-6 font-serif text-xl text-stone-900">
        Part 4: Integer division
      </h3>
      <div className="mt-3">
        <JavaView
          code={DIVISION_SNIPPET}
          label="Integer division compared with decimal division"
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-stone-700">
        When both values are int values, Java removes the decimal portion. When
        at least one value is a double, Java can produce a decimal answer.
      </p>
      <article className="mt-3 rounded-2xl bg-[var(--ua-evergreen)] p-4 text-white">
        <p className="text-xs font-semibold tracking-[0.14em] text-[#D6B55B] uppercase">
          You tell me
        </p>
        <p className="mt-1 font-serif text-xl">
          Why does 12 / 5 produce a different result from 12.0 / 5.0?
        </p>
      </article>
    </section>
  );
}
