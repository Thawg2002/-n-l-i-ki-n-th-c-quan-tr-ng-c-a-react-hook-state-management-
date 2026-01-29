import React, { useReducer } from "react";

function counterReducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      return state;
  }
}

const UseReducerDemo = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div style={{ border: '1px solid #ff9800', padding: 16, marginBottom: 16 }}>
      <h3>useReducer Demo</h3>
      <div>Count: {state.count}</div>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "increment" })} style={{ marginLeft: 8 }}>+</button>
    </div>
  );
};

export default UseReducerDemo;
