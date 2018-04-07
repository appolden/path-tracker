import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import MapHelper from '../maps/map-helper.js';
import PointOfInterest from '../component/point-of-interest.jsx';
import PointCurrent from '../component/point-current.jsx';
import Location from '../component/location.jsx';
import LocationOverride from '../component/location-override.jsx';
import Menu from '../component/menu.jsx';

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

    if ('caches' in navigator) {
      caches.open('data').then(cache => {
        return cache.match(url).then(response => {
          if (response === undefined) {
            console.log('adding points to the cache');
            fetch(url).then(response => {
              const cloned = response.clone();
              cache.put(url, response);
              cloned.json().then(data => this.pointsLoaded(data));
            });
          } else {
            console.log('retrieved points from cache');
            response.json().then(data => this.pointsLoaded(data));
          }
        });
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

    if ('caches' in navigator) {
      caches.open('data').then(cache => {
        return cache.match(url).then(response => {
          if (response === undefined) {
            console.log('adding pois to the cache');
            fetch(url).then(response => {
              const cloned = response.clone();
              cache.put(url, response);
              cloned.json().then(data => this.pointsOfInterestLoaded(data));
            });
          } else {
            console.log('retrieved pois from cache');
            response.json().then(data => this.pointsOfInterestLoaded(data));
          }
        });
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
    this.language = this.props.language || 'en';

    this.title = 'GR10 trail tracker';
    this.aboutLinkText = 'About';
    switch (this.language.toLowerCase()) {
      case 'fr':
        this.title = 'Traqueur de sentier GR10';
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
      <Location
        onLocationChanged={this.onLocationChanged}
        language={this.language}
      />
    );
    //console.log(window.outerHeight);
    const offset = 140;
    const style = { height: window.outerHeight - offset };

    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: this.language }}>
          <title>{this.title}</title>
        </Helmet>
        <Menu language={this.props.language} origin={this.props.origin} />
        <header className="App-header">
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
