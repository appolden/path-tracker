import React, { Component } from 'react';
import MapHelper from '../maps/map-helper.js';
import PointOfInterest from '../component/point-of-interest.jsx';
import PointCurrent from '../component/point-current.jsx';
import Location from '../component/location.jsx';
import LocationOverride from '../component/location-override.jsx';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

class PathTracker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pointsOfInterest: [],
      nearestMetreOfPath: 0,
      elevationAtNearestMetreOfPath: 0
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

  findNearestPointToLocationAndUpdate(lat, lng) {
    const currentLocation = { lat: lat, lng: lng };

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

  onLocationChanged(lat, lng) {
    this.findNearestPointToLocationAndUpdate(lat, lng);
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
        nextPointOfInterest.nearestMetreOfPath >= this.state.nearestMetreOfPath
      ) {
        rows.push(pointCurrent);
      } else {
        rows.push(pointOfInterest);
      }
    });

      const locationComponent = this.props.testMode ? (<LocationOverride onLocationChanged={this.onLocationChanged} />) : (<Location onLocationChanged={this.onLocationChanged} />);
    //console.log(window.outerHeight);
    const offset = 140;
    const style = { height: window.outerHeight - offset };

    return (
      <React.Fragment>
        <header className="App-header">
          <h1 className="App-title">GR10 trail tracker</h1>
        </header>
        <div className="App-content">
                <div>
                    {locationComponent}
     

            <div style={style} className="pointsOfInterest">
              {rows}
            </div>
          </div>
          <footer className="App-footer">
            <Link to="/about">About</Link>
          </footer>
        </div>
      </React.Fragment>
    );
  }
}

export default PathTracker;