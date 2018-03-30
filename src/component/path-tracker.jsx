import React, { Component } from 'react';
import MapHelper from '../maps/map-helper.js';
import PointOfInterest from '../component/point-of-interest.jsx';
import PointCurrent from '../component/point-current.jsx';
import ReactDOM from 'react-dom';

class PathTracker extends Component {
  constructor(props) {
    super(props);

    this.handleLatChange = this.handleLatChange.bind(this);
    this.handleLngChange = this.handleLngChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      lat: 42.965442,
      lng: -0.779819,
      pointsOfInterest: [],
      nearestMetreOfPath: 0,
      elevationAtNearestMetreOfPath: 0
    };
    this.pointsWithDistance = [];
    this.pois = [];
    this.pointCurrent = undefined;
    this.scrollToAfterComponentDidUpdate = false;
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
      var element = ReactDOM.findDOMNode(this);
      var pointCurrentElement = ReactDOM.findDOMNode(this.pointCurrent);
      console.log(
        `pointCurrentElement.parentNode.scrollTop ${
          pointCurrentElement.parentNode.scrollTop
        }`
      );
      console.log(
        `pointCurrentElement.offsetTop ${pointCurrentElement.offsetTop}`
      );
      pointCurrentElement.parentNode.scrollTop =
        pointCurrentElement.offsetTop - 100;
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
        pointsOfInterest: this.pois
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
    const currentLocation = { lat: this.state.lat, lng: this.state.lng };

    const nearestPointToCurrentLocation = MapHelper.findNearestPoint(
      this.pointsWithDistance,
      currentLocation
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
    this.scrollToAfterComponentDidUpdate = true;
  }

  render() {
    const rows = [];
    const pointCurrent = (
      <PointCurrent
        key="CurrentPoint"
        ref={section => {
          this.pointCurrent = section;
        }}
        pathMetre={this.state.nearestMetreOfPath}
        pathElevation={this.state.elevationAtNearestMetreOfPath}
      />
    );

    this.state.pointsOfInterest.forEach((x, index) => {
      const pointOfInterest = (
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
          pathCumulativeDescent={
            this.state.cumulativeDescentAtNearestMetreOfPath
          }
        />
      );

      if (index == this.state.pointsOfInterest.length - 1) {
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
        nextPointOfInterest.nearestMetreOfPath >= this.state.nearestMetreOfPath
      ) {
        rows.push(pointCurrent);
      } else {
        rows.push(pointOfInterest);
      }
    });

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
        <div className="pointsOfInterest">{rows}</div>
      </div>
    );
  }
}

export default PathTracker;
