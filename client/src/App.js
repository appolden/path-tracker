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
import Legal from './component/legal.jsx';
import TechnicalPage from './component/technical-page';
import ReactGA from 'react-ga';
import AccommodationList from './component/accommodation-list.jsx';
import { Helmet } from 'react-helmet';
ReactGA.initialize('UA-76203188-2');

class App extends Component {
  onRouterUpdate() {
    const isLocalhost = Boolean(
      window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.1/8 is considered localhost for IPv4.
        window.location.hostname.match(
          /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        )
    );

    if (!isLocalhost) {
      ReactGA.pageview(window.location.pathname);
    }
  }

  render() {
    return (
      <div className="App">
        <Helmet>
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.gr-trail-tracker.com/" />
          <meta property="og:title" content="GR10 Trail tracker" />
          <meta property="og:site_name" content="GR10 Trail tracker" />
          <meta
            property="og:image"
            content="https://www.gr-trail-tracker.com/assets/icons/hiker512x512.png"
          />
        </Helmet>
        <Router>
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
                    language="fr"
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
                      <TrailMapFrench
                        origin="/gr10/map"
                        trailName="gr10"
                        poisUrl="/data/gr10-points-of-interest.json"
                      />
                    );
                  case 'en':
                  default:
                    return (
                      <TrailMapEnglish
                        origin="/gr10/map"
                        trailName="gr10"
                        poisUrl="/data/gr10-points-of-interest.json"
                      />
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

            <Route
              exact
              path="/:language/legal"
              component={props => {
                this.onRouterUpdate();

                return (
                  <Legal
                    language={props.match.params.language}
                    origin="/legal"
                  />
                );
              }}
            />
            <Route
              exact
              path="/:language/technical"
              component={TechnicalPage}
            />

            <Route
              exact
              path="/:language/gr10/town-guide"
              component={props => {
                this.onRouterUpdate();

                return (
                  <AccommodationList
                    language={props.match.params.language}
                    origin="/gr10/town-guide"
                  />
                );
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
