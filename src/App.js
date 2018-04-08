import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import PathTracker from './component/path-tracker.jsx';
import PathEncoder from './component/path-encoder.jsx';
import PointOfInterestEncoder from './component/point-of-interest-encoder.jsx';
import CacheViewer from './component/cache-viewer.jsx';
import About from './component/about.jsx';
import Contribute from './component/contribute';
import TrailMapFrench from './component/trail-map-fr.jsx';
import TrailMapEnglish from './component/trail-map-en.jsx';
import ReactGA from 'react-ga';
ReactGA.initialize('UA-76203188-2'); //Unique Google Analytics tracking number

class App extends Component {
  onRouterUpdate() {
    ReactGA.pageview(window.location.pathname); //<Route exact path="/" component={About} />    <Route exact path="/about" component={About} />
  }

  render() {
    return (
      <div className="App">
        <Router onUpdate={this.onRouterUpdate}>
          <React.Fragment>
            <Route
              exact
              path="/"
              component={props => {
                this.onRouterUpdate();

                return <About language="en" origin="/about" />;
              }}
            />

            <Route
              exact
              path="/:language/about"
              component={props => {
                this.onRouterUpdate();

                return (
                  <About
                    language={props.match.params.language}
                    origin="/about"
                  />
                );
              }}
            />
            <Route
              exact
              path="/trail-tracker"
              component={props => {
                this.onRouterUpdate();

                return (
                  <PathTracker
                    pointsUrl="/data/gr10-points-elevation.json"
                    poisUrl="/data/gr10-points-of-interest.json"
                    language="en"
                    origin="/trail-tracker"
                  />
                );
              }}
            />
            <Route
              exact
              path="/:language/gr10/trail-tracker"
              component={props => {
                this.onRouterUpdate();

                return (
                  <PathTracker
                    trailName="gr10"
                    pointsUrl="/data/gr10-points-elevation.json"
                    poisUrl="/data/gr10-points-of-interest.json"
                    language={props.match.params.language}
                    origin="/gr10/trail-tracker"
                  />
                );
              }}
            />

            <Route
              exact
              path="/trail-tracker-test"
              component={() => {
                this.onRouterUpdate();

                return (
                  <PathTracker
                    pointsUrl="/data/gr10-points-elevation.json"
                    poisUrl="/data/gr10-points-of-interest.json"
                    testMode="true"
                  />
                );
              }}
            />
            <Route
              exact
              path="/trail-tracker-chorlton"
              component={() => {
                this.onRouterUpdate();
                return (
                  <PathTracker
                    pointsUrl="/data/home-chorlton/points.json"
                    poisUrl="/data/home-chorlton/points-of-interest.json"
                  />
                );
              }}
            />
            <Route exact path="/path-encoder" component={PathEncoder} />
            <Route
              exact
              path="/poi-encoder"
              component={PointOfInterestEncoder}
            />
            <Route exact path="/cache-viewer" component={CacheViewer} />
            <Route
              exaxt
              path="/:language/donate"
              component={props => {
                this.onRouterUpdate();

                return (
                  <Contribute
                    language={props.match.params.language}
                    origin="/donate"
                  />
                );
              }}
            />

            <Route
              exaxt
              path="/:language/gr10/map"
              component={props => {
                this.onRouterUpdate();

                switch (props.match.params.language) {
                  case 'fr':
                    return (
                      <TrailMapFrench origin="/gr10/map" trailName="gr10" />
                    );
                  case 'en':
                  default:
                    return (
                      <TrailMapEnglish origin="/gr10/map" trailName="gr10" />
                    );
                }
              }}
            />

            <Route
              exaxt
              path="/:language/gr20/map"
              component={props => {
                this.onRouterUpdate();

                switch (props.match.params.language) {
                  case 'fr':
                    return (
                      <TrailMapFrench origin="/gr20/map" trailName="gr20" />
                    );
                  case 'en':
                  default:
                    return (
                      <TrailMapEnglish origin="/gr20/map" trailName="gr20" />
                    );
                }
              }}
            />
          </React.Fragment>
        </Router>
        <div id="snackbar" />
      </div>
    );
  }
}

export default App;
