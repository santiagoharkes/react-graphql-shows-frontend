import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import AuthPage from "./pages/Auth";
import EventsPage from "./pages/Events";
import BookingPage from "./pages/Booking";
import MainNavigation from "./components/Navigation/MainNavigation";
import AuthContext from "./context/auth-context";

import "./App.css";

function App() {
  const [authData, setAuthData] = useState({
    token: null,
    userId: null,
  });

  const login = (token, userId, tokenExpiration) => {
    setAuthData({
      token: token,
      userId: userId,
    });
  };

  const logout = () => {
    setAuthData({
      token: null,
      userId: null,
    });
  };

  return (
    <BrowserRouter>
      <>
        <AuthContext.Provider
          value={{
            token: authData.token,
            userId: authData.userId,
            login: login,
            logout: logout,
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {authData.token && <Redirect from="/" to="/events" exact />}
              {authData.token && <Redirect from="/auth" to="/events" exact />}
              {!authData.token && (
                <Route exact path="/auth" component={AuthPage} />
              )}
              <Route exact path="/events" component={EventsPage} />
              {authData.token && (
                <Route exact path="/bookings" component={BookingPage} />
              )}
              {!authData.token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </>
    </BrowserRouter>
  );
}

export default App;
