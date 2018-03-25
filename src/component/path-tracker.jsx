import React, { Component } from 'react';
import MapHelper from '../maps/map-helper.js';
import PointOfInterest from '../component/point-of-interest.jsx';

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

  loadPoints() {
    fetch('/data/gr10-points-elevation.json')
      .then(response => response.json())
      .then(data => {
        this.pointsWithDistance = data;
      });
  }

  loadPointsOfInterest() {
    fetch('/data/gr10-points-of-interest.json')
      .then(response => response.json())
      .then(data => {
        this.pois = data;
        this.setState({
          distances: this.pois
        });
      });
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
          />
          Lng:{' '}
          <input
            type="text"
            value={this.state.lng}
            onChange={this.handleLngChange}
          />
          <input type="button" value="Submit" onClick={this.handleClick} />
        </p>
        <p>You are at {(this.state.nearestMetreOfPath * 0.001).toFixed(2)}</p>

        <div className="pointsOfInterest">{pointOfInterestRows}</div>
      </div>
    );
  }
}

export default PathTracker;
