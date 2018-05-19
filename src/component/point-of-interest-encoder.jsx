import React, { Component } from 'react';
import MapHelper from '../maps/map-helper.js';

class PointOfInterestEncoder extends Component {
  constructor(props) {
    super(props);

    this.state = { locatedPois: '' };
    this.pathPoints = [];
    this.pois = [];
    //this.pathPointsUrl = '/data/gr10-points-elevation.json';
    //this.poisToLocateUrl = '/data/gr10-points-of-interest-to-locate.json';

    this.pathPointsUrl = '/data/greenfield-glossop/points.json';
    this.poisToLocateUrl = '/data/greenfield-glossop/points-of-interest-to-locate.json';
  }

  componentDidMount() {
    this.loadPathPoints();
    this.loadPointsOfInterest();
  }

  loadPathPoints() {
    fetch(this.pathPointsUrl)
      .then(response => response.json())
      .then(data => {
        this.pathPoints = data;
        this.locatePointOfInterestOnPath();
      });
  }

  loadPointsOfInterest() {
    fetch(this.poisToLocateUrl)
      .then(response => response.json())
      .then(data => {
        this.pois = data;
        this.locatePointOfInterestOnPath();
      });
  }

  locatePointOfInterestOnPath() {
    if (this.pathPoints.length === 0 || this.pois.length === 0) {
      return;
    }

    this.pois.forEach(function(poi, index) {
      const nearestPoint = MapHelper.findNearestPoint(this.pathPoints, {
        lat: poi.point.lat,
        lng: poi.point.lng
      }).routePoint;
      poi.nearestMetreOfPath = nearestPoint.metreOfPath;
      poi.elevation = nearestPoint.elevation;
      poi.cumulativeAscent = nearestPoint.cumulativeAscent;
      poi.cumulativeDescent = nearestPoint.cumulativeDescent;
    }, this);

    const formatForJson = this.pois.map(x => {
      return {
        name: x.name,
        nearestMetreOfPath: parseInt(x.nearestMetreOfPath, 10),
        elevation: x.elevation,
        cumulativeAscent: x.cumulativeAscent,
        cumulativeDescent: x.cumulativeDescent,
        description: x.description,
        accommodations: x.accommodations,
        accommodationDescription: x.accommodationDescription,
        hotel: x.hotel,
        gite: x.gite,
        cabane: x.cabane,
        camping: x.camping,
        foodshop: x.foodshop,
        restaurant: x.restaurant,
        accommodationSearchUrl: x.accommodationSearchUrl
      };
    });

    const sorted = formatForJson.sort(function compare(a, b) {
      if (a.nearestMetreOfPath < b.nearestMetreOfPath) return -1;
      if (a.nearestMetreOfPath > b.nearestMetreOfPath) return 1;
      return 0;
    });

    this.setState({
      locatedPois: JSON.stringify(sorted),
      countOfPois: sorted.length
    });
    console.log(JSON.stringify(sorted));
  }

  render() {
    return (
      <div>
        <p>On load this page will do the following:</p>
        <ol>
          <li>
            Retrieve the points of interest and for each point locate the
            nearest trail metre. The result is then logged in the console
          </li>
        </ol>
        <textarea
          className="form-control"
          rows="25"
          value={this.state.locatedPois}
          style={{ fontSize: '1rem', width: '100%' }}
        />
        Total POIS: {this.state.countOfPois}
      </div>
    );
  }
}

export default PointOfInterestEncoder;
