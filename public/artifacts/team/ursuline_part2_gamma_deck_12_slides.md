# Inside AI: The Math, Science, and Code Behind Intelligent Tools
## Student-Facing Gamma Deck Source, 12 Slides

Audience: grades 10 and 11, with AP CSP and AP CSA extension language in speaker notes. Delivery target: 15 to 20 minutes. This is Part 2 of the AI, the Brain, and Serviam lesson package.

Core thesis: The model can produce language. The learner must still question, verify, explain, and decide.

Design rule: keep visible slides low-text and diagram-first. Put technical depth, source notes, and citations in speaker notes.

## Slide 1: Inside AI

### On-slide text
- Language -> Math -> Model -> Response -> Human Review
- AI is powerful because it can generate. Human judgment still decides.

### Visual direction
Elegant left-to-right pathway with five stations. Use a final human review checkpoint in green or gold. Optional girls-only STEM image on one side.

### Student interaction
Opening frame. Ask: What do you think happens between a prompt and a response?

### Speaker notes
Part 1 helped students understand AI literacy and responsible use. Part 2 opens the hood a little more. The goal is not college machine learning. The goal is to make the math, science, and code visible enough that students can question AI intelligently.

### Source notes
Ursuline mission, Ursuline Technology and I.D.E.A. Hub, Google ML Crash Course.

## Slide 2: The Advanced Question

### On-slide text
- How does a model turn words into numbers, use patterns, and generate a response?

### Visual direction
Clean typographic question slide with small icons for words, numbers, pattern, output, and human review.

### Student interaction
Think-pair-share: What step do you think is most surprising: words to numbers, patterns, or response?

### Speaker notes
This keeps the lesson focused. Students should understand the chain: language becomes numbers, numbers move through a trained model, and the output still needs human review.

### Source notes
Part 1 prompt-to-response pathway and Google ML Crash Course.

## Slide 3: AI as a Learned Function

### On-slide text
- Input -> Model -> Output
- f(x) = y
- A model maps one kind of information to another.

### Visual direction
Function machine diagram. Example chips: prompt -> response, image -> label, data -> prediction.

### Student interaction
Students name one input-output pair from daily life, such as photo -> label or question -> answer.

### Speaker notes
A function is a familiar math and CS idea. In a traditional program, a human writes the rules. In machine learning, the system learns the transformation from examples.

### Source notes
AP CSP, AP CSA, Ursuline AP courses.

## Slide 4: Data Is the Lab

### On-slide text
- Data is evidence.
- Training is practice.
- Testing is scientific judgment.

### Visual direction
Three cards: Training Data, Prediction Practice, Testing Data. Add a small lab notebook or data table visual.

### Student interaction
Ask: In science, why do we test on new data instead of only data we already practiced on?

### Speaker notes
This slide makes AI feel scientific. A model should be tested on examples it did not simply memorize. That is how we ask whether it learned a pattern that transfers.

### Source notes
Ursuline science/AP course language, Nobel Prize 2024 Chemistry, model evaluation sources.

## Slide 5: Tokens Become Vectors

### On-slide text
- Text -> Tokens -> Numbers -> Vectors
- Vectors represent learned relationships mathematically.

### Visual direction
Token chips: Explain | photo | synthesis | using | basketball | analogy. Then show token IDs and a simple vector: robot = [0.12, -0.44, 0.81].

### Student interaction
Students split a sentence into possible tokens. Remind them: token examples are simplified and vary by model.

### Speaker notes
A token can be a word, part of a word, punctuation, or space. A vector is a list of numbers. Embeddings help represent relationships learned from data, not human meaning in the full human sense.

### Source notes
Google ML Crash Course LLMs and embeddings.

## Slide 6: Similarity Uses Geometry

### On-slide text
- Close vectors = related patterns.
- Similarity is calculated, not felt.

### Visual direction
Simple 2D map with three clusters: code, algorithm, function; robot, sensor, circuit; service, fairness, dignity.

### Student interaction
Ask: Which pair belongs closer together, code and algorithm or code and cupcake? Why?

### Speaker notes
The model calculates relationships among vectors. This connects to geometry, coordinates, distance, and similarity. Do not overclaim that the model understands the concepts like a person.

### Source notes
Google embeddings, vector similarity background.

## Slide 7: Weights Transform Inputs

### On-slide text
- z = w1x1 + w2x2 + b
- Weights decide which signals matter more.

### Visual direction
Weighted evidence scale or signal mixer. Keep the equation large and simple.

### Student interaction
Ask: If you were deciding whether a source is trustworthy, what signals should get the most weight?

### Speaker notes
Weights are learned values. A simple weighted sum shows the idea: inputs multiplied by weights plus bias. For 10th and 11th graders, the key idea is not solving the equation. It is seeing that AI uses weighted signals.

### Source notes
AP CS, algebra, Google ML gradient descent.

## Slide 8: Learning From Error

### On-slide text
- Predict -> Measure Loss -> Adjust -> Repeat
- Training is feedback at scale.

### Visual direction
Cycle diagram or a gentle loss curve moving downward.

### Student interaction
Students connect it to revision: How is model training like improving a draft after feedback? How is it different?

### Speaker notes
Loss measures error. Training adjusts weights to reduce loss over many examples. This is a good bridge between math, science, and learning science.

### Source notes
Google ML Crash Course on gradient descent, EEF feedback and metacognition.

## Slide 9: Probability Chooses the Next Token

### On-slide text
- Scores become probabilities.
- robot 0.61
- sensor 0.24
- toaster 0.01
- Most likely is not guaranteed true.

### Visual direction
Clean horizontal probability bars. No axis clutter.

### Student interaction
Prediction game: In robotics class, the students programmed the _____. Students choose the most likely word and explain the context.

### Speaker notes
Softmax converts raw scores into probabilities. The model can choose among likely next tokens, which is why answers can vary and why fluent output is not guaranteed truth.

### Source notes
Google ML Crash Course softmax and LLMs.

## Slide 10: Attention Is Weighted Context

### On-slide text
- Which words matter most right now?
- Query -> Key -> Value
- Attention weights relationships in context.

### Visual direction
Sentence: The robot picked up the gear, and it clicked into place. Highlight gear and it. Arrow: it -> gear.

### Student interaction
Ask: What clicked into place? How did you know?

### Speaker notes
Attention is a mathematical weighting process, not human attention. A simple version: the model asks what it is looking for, what could match, and what information should move forward.

### Source notes
Vaswani et al., Attention Is All You Need; Google Transformers.

## Slide 11: Generation Is a Loop

### On-slide text
- repeat:
- predict
- choose
- add
- continue
- Generation is step-by-step, not magic.

### Visual direction
Clean pseudocode box with only 5 to 7 lines. Add loop arrow.

### Student interaction
Students explain the loop in plain English to a partner.

### Speaker notes
Base language generation is a loop. The model predicts a next token, selects one, adds it to the context, and continues until a stop condition. Tool-using agents may add planning, search, code execution, and revision.

### Source notes
Google LLMs, AP CSA loops, AP CSP algorithms.

## Slide 12: Test, Verify, Serve

### On-slide text
- Math explains generation.
- Science tests results.
- Computer science builds systems.
- Serviam asks: Does this serve?

### Visual direction
Four cards: Math, Science, Computer Science, Serviam. Add exit ticket underneath.

### Student interaction
Exit ticket: One math idea. One CS idea. One science idea. One human responsibility.

### Speaker notes
This closes the extension and connects back to Part 1. The point is not that students now know every detail. The point is that they can see enough of the system to question it, test it, and use it with responsibility.

### Source notes
NIST AI RMF, UNESCO AI competency, Ursuline Living the Mission.

## Gamma build prompt
Use the companion file: ursuline_part2_gamma_update_prompt.md.
