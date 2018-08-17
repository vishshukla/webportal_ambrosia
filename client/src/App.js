import React, { Component } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Route,
  // Link,
  Switch,
  // Redirect
} from 'react-router-dom';
// import jwt_decode from 'jwt-decode';
// import setAuthToken from './utils/setAuthToken';
// import { setCurrentUser, logoutUser } from './actions/authActions';

import { Provider } from "react-redux";
import store from './store';

// import PrivateRoute from './components/common/PrivateRoute';
// import EditProfile from './components/edit-profile/EditProfile';

import Landing from './components/layout/Landing';
import Readings from './components/readings/Readings';
import Spinner from './components/common/Spinner';
// import { clearCurrentProfile } from './actions/readingsActions';
import Navbar from './components/layout/Navbar';
// import History from './components/history/History';

// Check for token


// const NoMatch = ({ location }) => {
//   return (
//     <div>
//       <h3>ERROR 404: <code>{location.pathname}</code></h3>
//     </div>
//   )
// }
class App extends Component {
  state = {
    isLoading: true
  };
  componentDidMount() {
    this.setState({ isLoading: false })
  }
  renderHTML = (
    <div className="container">
      <Navbar />
      <Switch>
        <Route exact path="/" component={Landing} />
        {/* <Route exact path="/register" component={Register} /> */}
        {/* <Route exact path="/login" component={Login} /> */}
        <Route exact path="/readings" component={Readings} />
        {/* <Route exact path="/edit-profile" component={EditProfile} /> */}
        {/* <Route exact path="/history" component={History} /> */}
        <Route exact path="*" component={Landing} />
        {/* <Route exact path='/notes' component={Notes}> */}
      </Switch>
    </div>
  )
  render() {

    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            {this.state.isLoading ? <Spinner /> : this.renderHTML}
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
