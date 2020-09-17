import React from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory
} from "react-router-dom";
import './index.css';
import EventsList from './EventsList';
require('dotenv').config()

const Index = () => {
  const history = useHistory();
  return(
    <Router history={history}>
      <Switch>
        <Route
          exact
          path="/"
          render={({history}) => {
            return <EventsList />
          }}
        />
        <Route
          exact
          path="/id"
          render={({history}) => {
            return <div>Hi!</div>
          }}
        />
      </Switch>
    </Router>
  )
}
ReactDOM.render(<Index />, document.getElementById('root'));
