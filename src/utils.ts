import { useState } from "react";

export function useStateC<T>(v: T, f: (a: T) => void) {
  const [val, setVal] = useState(v);
  const setValC = (v: T) => {
    setVal(v);
    f(v);
  };
  return [val, setValC];
}
