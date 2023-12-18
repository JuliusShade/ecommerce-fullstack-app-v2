import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// Import your ItemList component
import Home from "./ecommerce/components/ProductList/Item";

// Define your main App component
const App = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
