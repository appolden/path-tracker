import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import MapHelper from '../maps/map-helper.js';
import GoogleMapHelper from '../maps/google-map-helper.js';

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

    this.routeUrl = '/data/gr10-route.json'; // this contains the encodeed polyline
    //this.routeUrl = '/data/home-chorlton/route.json';
  }

  componentDidUpdate(prevProps, prevStat) {
    if (prevProps.google !== this.props.google) {
      this.loadPolyline();
    }
  }

  loadPolyline() {
    if (this.props && this.props.google) {
      fetch(this.routeUrl)
        .then(response => response.json())
        .then(data => {
          const pathPoints = this.props.google.maps.geometry.encoding.decodePath(
            data.polyline
          );

            this.pointsWithDistance = GoogleMapHelper.addCumulativeDistance(
            this.props.google,
            pathPoints
          );

            GoogleMapHelper.addElevation(
            this.props.google,
            pathPoints,
            this.onElevationComplete()
          );
        });
    }
  }

  onElevationComplete(pathPoints) {
    return e => {
        GoogleMapHelper.addCumulativeAscentAndDescent(e);

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
              <li>Add elevation and cumulative elevation </li>
            </ol>
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
