import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import MapHelper from '../maps/map-helper.js';

class PathEncoder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 42.965442,
      lng: -0.779819,
      distances: [],
      nearestMetreOfPath: 0
    };
    this.pointsWithDistance = [];
    this.currentLocation = undefined;
    this.pois = [];
  }

  componentDidMount() {
    this.loadPointsOfInterest();
  }

  componentDidUpdate(prevProps, prevStat) {
    if (prevProps.google !== this.props.google) {
      this.loadPolyline();
    }
  }

  loadPointsOfInterest() {
    fetch('/data/gr10-points-of-interest.json')
      .then(response => response.json())
      .then(data => {
        this.pois = data;
      });
  }

  loadPolyline() {
    if (this.props && this.props.google) {
      fetch('/data/gr10-route.json')
        .then(response => response.json())
        .then(data => {
          const pathPoints = this.props.google.maps.geometry.encoding.decodePath(
            data.polyline
          );

          this.pointsWithDistance = MapHelper.addCumulativeDistance(
            this.props.google,
            pathPoints
          );

          MapHelper.addElevation(
            this.props.google,
            pathPoints,
            this.onElevationComplete()
          );
        });
    }
  }

  onElevationComplete(pathPoints) {
    return e => {
      MapHelper.addCumulativeAscentAndDescent(e);

      //extract what we need
      this.pointsWithDistance = e.map(point => {
        return {
          lat: parseFloat(point.lat().toFixed(6), 10),
          lng: parseFloat(point.lng().toFixed(6), 10),
          metreOfPath: parseInt(point.distance, 10),
          elevation: point.elevation,
          cumulativeAscent: point.cumulativeAscent,
          cumulativeDescent: point.cumulativeDescent
        };
      });

      console.log(JSON.stringify(this.pointsWithDistance));

      this.pois.forEach(function(poi, index) {
        const nearestPoint = MapHelper.findNearestPoint(
          this.pointsWithDistance,
          { lat: poi.point.lat, lng: poi.point.lng }
        );
        poi.nearestMetreOfPath = nearestPoint.metreOfPath;
      }, this);

      const formatForJson = this.pois.map(x => {
        return {
          name: x.name,
          point: {
            lat: parseFloat(x.point.lat.toFixed(6), 10),
            lng: parseFloat(x.point.lng.toFixed(6), 10)
          },
          nearestMetreOfPath: parseInt(x.nearestMetreOfPath, 10)
        };
      });

      const sorted = formatForJson.sort(function compare(a, b) {
        if (a.nearestMetreOfPath < b.nearestMetreOfPath) return -1;
        if (a.nearestMetreOfPath > b.nearestMetreOfPath) return 1;
        return 0;
      });
      console.log(JSON.stringify(sorted));
    };
  }

  render() {
    return (
      <div>
        <p>On load this page will do the following:</p>
        <ol>
          <li>Retrieve the encoded google polyline</li>
          <li>
            Decode the polyline and for each point on the polyline
            <ol>
              <li>
                Add cumuldative distance of path to each point (in metres)
              </li>
              <li>TODO: add elevation and cumulative elevation </li>
            </ol>
          </li>
          <li>
            Retireve the points of interest and for each point locate the
            nearest trail metre. The result is then logged in the console
          </li>
        </ol>
        Check the console log
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCbTwcCRBzA9Qc5dT_aPYebyiprFlV1WVE',
  libraries: ['geometry'],
  v: 3.2
})(PathEncoder);
