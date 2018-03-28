import React, { Component } from 'react';
import MapHelper from '../maps/map-helper.js';
import PointOfInterest from '../component/point-of-interest.jsx';
//const cache = na

class PathTracker extends Component {
  constructor(props) {
    super(props);

    this.handleLatChange = this.handleLatChange.bind(this);
    this.handleLngChange = this.handleLngChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      lat: 42.965442,
      lng: -0.779819,
      distances: [],
      nearestMetreOfPath: 0,
      elevationAtNearestMetreOfPath: 0
    };
    this.pointsWithDistance = [];
    this.currentLocation = undefined;
    this.pois = [];
  }

  componentDidMount() {
    this.loadPoints();
    this.loadPointsOfInterest();
  }

  pointsLoaded(data) {
    this.pointsWithDistance = data;
  }

  pointsLoaded(data) {
    this.pointsWithDistance = data;
    if (this.pointsWithDistance.length > 0 && this.pois.length > 0) {
      this.setState({
        distances: this.pois
      });
    }
  }

  loadPoints() {
    const url = '/data/gr10-points-elevation.json';

    if ('serviceWorker' in navigator) {
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
        distances: this.pois
      });
    }
  }

  loadPointsOfInterest() {
    const url = '/data/gr10-points-of-interest.json';

    if ('serviceWorker' in navigator) {
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

  findNearestPointToCurrentLocationAndUpdate() {
    this.currentLocation = { lat: this.state.lat, lng: this.state.lng };

    const nearestPointToCurrentLocation = MapHelper.findNearestPoint(
      this.pointsWithDistance,
      this.currentLocation
    );

    this.setState({
      nearestMetreOfPath: nearestPointToCurrentLocation.metreOfPath,
      elevationAtNearestMetreOfPath: nearestPointToCurrentLocation.elevation,
      cumulativeAscentAtNearestMetreOfPath:
        nearestPointToCurrentLocation.cumulativeAscent,
      cumulativeDescentAtNearestMetreOfPath:
        nearestPointToCurrentLocation.cumulativeDescent
    });
  }

  handleLatChange(event) {
    this.setState({ lat: event.target.value });
  }

  handleLngChange(event) {
    this.setState({ lng: event.target.value });
  }

  handleClick(event) {
    this.findNearestPointToCurrentLocationAndUpdate();
  }

  render() {
    const pointOfInterestRows = this.state.distances.map(x => (
      <PointOfInterest
        key={x.name}
        name={x.name}
        nearestMetreOfPath={x.nearestMetreOfPath}
        elevationAtNearestMetreOfPath={x.elevation}
        cumulativeAscentAtNearestMetreOfPath={x.cumulativeAscent}
        cumulativeDescentAtNearestMetreOfPath={x.cumulativeDescent}
        pathMetre={this.state.nearestMetreOfPath}
        pathElevation={this.state.elevationAtNearestMetreOfPath}
        pathCumulativeAscent={this.state.cumulativeAscentAtNearestMetreOfPath}
        pathCumulativeDescent={this.state.cumulativeDescentAtNearestMetreOfPath}
      />
    ));

    return (
      <div>
        <p>
          Lat:{' '}
          <input
            type="text"
            value={this.state.lat}
            onChange={this.handleLatChange}
            style={{ width: '80px' }}
          />
          Lng:{' '}
          <input
            type="text"
            value={this.state.lng}
            onChange={this.handleLngChange}
            style={{ width: '80px' }}
          />
          <input type="button" value="Update" onClick={this.handleClick} />
        </p>
        <p>You are at {(this.state.nearestMetreOfPath * 0.001).toFixed(2)}</p>

        <div className="pointsOfInterest">{pointOfInterestRows}</div>
      </div>
    );
  }
}

export default PathTracker;
