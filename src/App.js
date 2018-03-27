import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import PathTracker from './component/path-tracker.jsx';
import PathEncoder from './component/path-encoder.jsx';
import PointOfInterestEncoder from './component/point-of-interest-encoder.jsx';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">GR10 trail tracker</h1>
        </header>
        <div className="App-content">
          <Router>
            <React.Fragment>
              <Route exact path="/" component={PathTracker} />
              <Route exact path="/path-encoder" component={PathEncoder} />
              <Route
                exact
                path="/poi-encoder"
                component={PointOfInterestEncoder}
              />
            </React.Fragment>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
