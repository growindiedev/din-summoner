import { Routes as Router, Route } from "react-router-dom";

import Home from "./pages/Home";
import Success from "./pages/Success";
import { LayoutContainer } from "./components/LayoutContainer";

export const Routes = () => {
  return (
    <Router>
      <Route path="/" element={<LayoutContainer />}>
        <Route index element={<Home />} />
        <Route path={`success/:daoId`} element={<Success />} />
      </Route>
    </Router>
  );
};
