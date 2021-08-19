import React from "react";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import LandingPage from "./components/views/LandingPage/LandingPage";
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Auth from './hoc/auth';

function App() {  
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          {/* SpecificComponent, option, adminRoute = null */}
          <Route exact path="/" component={Auth(LandingPage, null, null)} />
          <Route exact path="/login" component={Auth(LoginPage, false, null)} />
          <Route exact path="/register" component={Auth(RegisterPage, false, null)} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;