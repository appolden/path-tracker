import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import MapHelper from '../maps/map-helper.js';
import PointOfInterest from '../component/point-of-interest.jsx';
import PointCurrent from '../component/point-current.jsx';
import Location from '../component/location.jsx';
import LocationOverride from '../component/location-override.jsx';
import LocationWatcher from '../component/location-watcher.jsx';
import Menu from '../component/menu.jsx';
import LanguageHelper from '../component/language-helper.js';

class PathTracker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pointsOfInterest: [],
      nearestMetreOfPath: 0,
      elevationAtNearestMetreOfPath: 0,
      distanceFromPath: 0
    };
    this.pointsWithDistance = [];
    this.pois = [];
    this.pointCurrent = undefined;
    this.scrollToAfterComponentDidUpdate = false;
    this.pointsOfInterest = undefined;

    this.onLocationChanged = this.onLocationChanged.bind(this);
  }

  componentDidMount() {
    this.loadPoints();
    this.loadPointsOfInterest();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.pointCurrent !== undefined &&
      this.scrollToAfterComponentDidUpdate
    ) {
      var pointCurrentElement = ReactDOM.findDOMNode(this.pointCurrent);

      if (pointCurrentElement !== undefined && pointCurrentElement !== null) {
        pointCurrentElement.parentNode.scrollTop =
          pointCurrentElement.offsetTop - 150;
      }

      this.scrollToAfterComponentDidUpdate = false;
    }
  }

  pointsLoaded(data) {
    this.pointsWithDistance = data;
    if (this.pointsWithDistance.length > 0 && this.pois.length > 0) {
      this.setState({
        pointsOfInterest: this.pois
      });
    }
  }

  loadPoints() {
    const url = this.props.pointsUrl;

    if ('caches' in window) {
      caches
        .open('data')
        .then(cache => {
          return cache.match(url).then(cacheResponse => {
            if (cacheResponse === undefined) {
              fetch(url).then(fetchResponse => {
                const cloned = fetchResponse.clone();
                cache.put(url, fetchResponse);
                cloned.json().then(data => this.pointsLoaded(data));
              });
            } else {
              cacheResponse.json().then(data => this.pointsLoaded(data));

              //now check for new data and update the cache
              fetch(url).then(fetchResponse => {
                const cloned = fetchResponse.clone();
                fetchResponse.json().then(data => {
                  cache.put(url, cloned);
                });
              });
            }
          });
        })
        .catch(() => {
          fetch(url)
            .then(response => response.json())
            .then(data => this.pointsLoaded(data));
        });
    } else {
      fetch(url)
        .then(response => response.json())
        .then(data => this.pointsLoaded(data));
    }
  }

  pointsOfInterestLoaded(data) {
    this.pois = data;
    if (this.pointsWithDistance.length > 0 && this.pois.length > 0) {
      this.setState({
        pointsOfInterest: this.pois
      });
    }
  }

  loadPointsOfInterest() {
    const url = this.props.poisUrl;

    if ('caches' in window) {
      caches
        .open('data')
        .then(cache => {
          return cache.match(url).then(cacheResponse => {
            if (cacheResponse === undefined) {
              fetch(url).then(response => {
                const cloned = response.clone();
                cache.put(url, response);
                cloned.json().then(data => this.pointsOfInterestLoaded(data));
              });
            } else {
              cacheResponse
                .json()
                .then(data => this.pointsOfInterestLoaded(data));

              //now check for new data and update the cache
              fetch(url).then(fetchResponse => {
                const cloned = fetchResponse.clone();
                fetchResponse.json().then(data => {
                  if (
                    JSON.stringify(this.state.pointsOfInterest) !==
                    JSON.stringify(data)
                  ) {
                    console.log('new data');
                    cache.put(url, cloned);
                    this.pointsOfInterestLoaded(data);
                  }
                });
              });
            }
          });
        })
        .catch(error => {
          console.error(`Error using cache. ${error}`);
          fetch(url)
            .then(response => response.json())
            .then(data => this.pointsOfInterestLoaded(data));
        });
    } else {
      fetch(url)
        .then(response => response.json())
        .then(data => this.pointsOfInterestLoaded(data));
    }
  }

  findNearestPointToLocationAndUpdate(lat, lng) {
    const currentLocation = { lat: lat, lng: lng };

    const findNearestPointResult = MapHelper.findNearestPoint(
      this.pointsWithDistance,
      currentLocation
    );

    const nearestPointToCurrentLocation = findNearestPointResult.routePoint;
    const distanceFromPath = MapHelper.computeDistanceBetween(
      currentLocation,
      findNearestPointResult.latLng
    );

    this.setState({
      nearestMetreOfPath: nearestPointToCurrentLocation.metreOfPath,
      elevationAtNearestMetreOfPath: nearestPointToCurrentLocation.elevation,
      cumulativeAscentAtNearestMetreOfPath:
        nearestPointToCurrentLocation.cumulativeAscent,
      cumulativeDescentAtNearestMetreOfPath:
        nearestPointToCurrentLocation.cumulativeDescent,
      distanceFromPath: distanceFromPath
    });
  }

  onLocationChanged(lat, lng) {
    this.findNearestPointToLocationAndUpdate(lat, lng);
    this.scrollToAfterComponentDidUpdate = true;
  }

  render() {
    this.language = LanguageHelper.getLanguage(this.props.language);

    this.pageTitle = 'GR10 trail tracker';
    this.title = 'GR10 trail tracker';
    this.aboutLinkText = 'About';
    switch (this.language) {
      case 'fr':
        this.pageTitle = 'Traqueur de sentier GR10';
        this.title = 'Sentier GR10';
        this.aboutLinkText = 'Informations';
        break;
      case 'en':
      default:
        this.language = 'en';
      //default to english
    }

    const rows = [];
    const pointCurrent = (
      <PointCurrent
        language={this.language}
        key="CurrentPoint"
        ref={section => {
          this.pointCurrent = section;
        }}
        pathMetre={this.state.nearestMetreOfPath}
        pathElevation={this.state.elevationAtNearestMetreOfPath}
        distanceFromPath={this.state.distanceFromPath}
      />
    );

    this.state.pointsOfInterest.forEach((x, index) => {
      const pointOfInterest = (
        <PointOfInterest
          language={this.language}
          key={x.nearestMetreOfPath}
          name={x.name}
          nearestMetreOfPath={x.nearestMetreOfPath}
          elevationAtNearestMetreOfPath={x.elevation}
          cumulativeAscentAtNearestMetreOfPath={x.cumulativeAscent}
          cumulativeDescentAtNearestMetreOfPath={x.cumulativeDescent}
          pathMetre={this.state.nearestMetreOfPath}
          pathElevation={this.state.elevationAtNearestMetreOfPath}
          pathCumulativeAscent={this.state.cumulativeAscentAtNearestMetreOfPath}
          pathCumulativeDescent={
            this.state.cumulativeDescentAtNearestMetreOfPath
          }
        />
      );

      if (index === this.state.pointsOfInterest.length - 1) {
        //reached the end
        rows.push(pointOfInterest);
        if (x.nearestMetreOfPath < this.state.nearestMetreOfPath) {
          rows.push(pointCurrent);
        }
        return;
      }

      const nextPointOfInterest = this.state.pointsOfInterest[index + 1];
      if (
        x.nearestMetreOfPath <= this.state.nearestMetreOfPath &&
        nextPointOfInterest.nearestMetreOfPath > this.state.nearestMetreOfPath
      ) {
        rows.push(pointOfInterest);
        rows.push(pointCurrent);
      } else {
        rows.push(pointOfInterest);
      }
    });

    const locationComponent = this.props.testMode ? (
      <LocationOverride
        onLocationChanged={this.onLocationChanged}
        language={this.language}
      />
    ) : (
      <LocationWatcher
        onLocationChanged={this.onLocationChanged}
        language={this.language}
      />
    );
    //console.log(window.outerHeight);
    const offset = 130;
    const style = { height: window.outerHeight - offset };

    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: this.language }}>
          <title>{this.title}</title>
        </Helmet>

        <header className="App-header">
          <Menu language={this.props.language} origin={this.props.origin} />
          <h1 className="App-title">{this.title}</h1>
        </header>
        <div className="App-content">
          <div>
            {locationComponent}

            <div style={style} className="pointsOfInterest">
              {rows}
            </div>
          </div>
          <footer className="App-footer">
            <Link to={'/' + this.language + '/about'}>
              {this.aboutLinkText}
            </Link>

            <Link to={'/' + this.language + '/donate'}>Donate</Link>
          </footer>
        </div>
      </React.Fragment>
    );
  }
}

export default PathTracker;
