export default function(element) {
  if (typeof element.type !== "string") {
    throw new Error(
      "Expected children to be simple React Elements but got a React Component. " +
        "Try wrapping your components e.g. <li key={id}><MyComponent /></li>"
    );
  }
}
