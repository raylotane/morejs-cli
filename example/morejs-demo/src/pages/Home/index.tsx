import React from "react";
import Header from "./Header/Header";
import "./index.css"; // Import the CSS file for this page

export default function index() {
  const [count, setCount] = React.useState(0);

  return (
    <div className="container">
      <Header />
      Home 123 123
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
