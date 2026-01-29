import React from "react";

// Memoized child to observe re-renders
const Child = React.memo(({ onInc }) => {
  console.log("Child render");
  return <button onClick={onInc}>Tăng (child)</button>;
});

export default Child;
