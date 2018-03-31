import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import PathTracker from './component/path-tracker.jsx';
import PathEncoder from './component/path-encoder.jsx';
import PointOfInterestEncoder from './component/point-of-interest-encoder.jsx';
import CacheViewer from './component/cache-viewer.jsx';
import About from './component/about.jsx';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <React.Fragment>
            <Route exact path="/" component={About} />
            <Route exact path="/about" component={About} />
                    <Route exact path="/trail-tracker" component={PathTracker} />
                    <Route exact path="/trail-tracker-test" component={() => (<PathTracker testMode="true" />)} />
            <Route exact path="/path-encoder" component={PathEncoder} />
            <Route
              exact
              path="/poi-encoder"
              component={PointOfInterestEncoder}
            />
            <Route exact path="/cache-viewer" component={CacheViewer} />
          </React.Fragment>
        </Router>
      </div>
    );
  }
}

export default App;
