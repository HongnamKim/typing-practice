import { useContext } from "react";

import { ThemeContext } from "./Context/ThemeContext";

const TestComp = () => {
  const { isDark } = useContext(ThemeContext);
  console.log();
  return <span>{isDark}</span>;
};

export default TestComp;
