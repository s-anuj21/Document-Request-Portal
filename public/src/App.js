import React from "react";
import "./App.css";
import Login from "./login/login";
import Footer from "./footer/footer";
import Student from "./student/student";
import Admin from "./admin/admin.jsx";
import NotFound from "./404/404";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

const PrivateRoutes = () => {
  let token = JSON.parse(localStorage.getItem("bonafideNITT2020user"));
  if (token) {
    if (isNaN(token.user)) {
      if (window.location.pathname === "/student")
        return <Redirect to="/admin" />;
      return <Route component={Admin} path="/admin" exact />;
    } else {
      if (window.location.pathname === "/admin")
        return <Redirect to="/student" />;
      return <Route component={Student} path="/student" exact />;
    }
  }

  return <Redirect to="/" />;
};

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <div className="row justify-content-center">
              <Login />
            </div>
          </Route>
          {window.location.pathname === "/student" ||
          window.location.pathname === "/admin" ? (
            <PrivateRoutes />
          ) : (
            <Route component={NotFound} />
          )}
        </Switch>
      </Router>
      <div className="row">
        <Footer />
      </div>
    </div>
  );
}

export default App;
