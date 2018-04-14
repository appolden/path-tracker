import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import ReactDOM from 'react-dom';
import MapHelper from '../maps/map-helper.js';
import LocationOverride from '../component/location-override.jsx';
import LocationWatcher from '../component/location-watcher.jsx';
import Menu from '../component/menu.jsx';
import LanguageHelper from '../component/language-helper.js';
import PointOfInterestRow from '../component/point-of-interest-row.jsx';
import PointOfInterestList from '../component/points-interest-virtulaized-list.jsx';

class PathTracker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pointsOfInterest: [],
      locationKnown: false,
      nearestMetreOfPath: 0,
      elevationAtNearestMetreOfPath: 0,
      distanceFromPath: 0,
      selectedPointOfInterest: undefined
    };
    this.pointsWithDistance = [];
    this.pois = [];
    this.pointCurrent = undefined;
    this.scrollToAfterComponentDidUpdate = false;
    this.pointsOfInterest = undefined;

    this.onLocationChanged = this.onLocationChanged.bind(this);
    this.onPointOfInterestClick = this.onPointOfInterestClick.bind(this);
    this.onPointOfInterestModalClose = this.onPointOfInterestModalClose.bind(
      this
    );
    this.onStartPositionWatch = this.onStartPositionWatch.bind(this);
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
        window.scrollTo(0, pointCurrentElement.offsetTop - 150);
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

    if (
      nearestPointToCurrentLocation.metreOfPath ===
        this.state.nearestMetreOfPath &&
      this.state.locationKnown
    ) {
      return;
    }

    const distanceFromPath = MapHelper.computeDistanceBetween(
      currentLocation,
      findNearestPointResult.latLng
    );

    this.setState(prevState => {
      const indexOf = prevState.pointsOfInterest.findIndex(
        x => x.currentLocation
      );
      if (indexOf > -1) {
        const pointCurrent = prevState.pointsOfInterest[indexOf];
        pointCurrent.nearestMetreOfPath =
          nearestPointToCurrentLocation.metreOfPath;
        pointCurrent.elevation = nearestPointToCurrentLocation.elevation;
        pointCurrent.cumulativeAscent =
          nearestPointToCurrentLocation.cumulativeAscent;
        pointCurrent.cumulativeDescent =
          nearestPointToCurrentLocation.cumulativeDescent;
      } else {
        const pointCurrent = {
          name: 'Current Location',
          nearestMetreOfPath: nearestPointToCurrentLocation.metreOfPath,
          elevation: nearestPointToCurrentLocation.elevation,
          cumulativeAscent: nearestPointToCurrentLocation.cumulativeAscent,
          cumulativeDescent: nearestPointToCurrentLocation.cumulativeDescent,
          currentLocation: true
        };
        prevState.pointsOfInterest.push(pointCurrent);
      }

      const newPois = prevState.pointsOfInterest.sort(function compare(a, b) {
        if (a.nearestMetreOfPath < b.nearestMetreOfPath) return -1;
        if (a.nearestMetreOfPath > b.nearestMetreOfPath) return 1;
        return 0;
      });

      return {
        locationKnown: true,
        nearestMetreOfPath: nearestPointToCurrentLocation.metreOfPath,
        elevationAtNearestMetreOfPath: nearestPointToCurrentLocation.elevation,
        cumulativeAscentAtNearestMetreOfPath:
          nearestPointToCurrentLocation.cumulativeAscent,
        cumulativeDescentAtNearestMetreOfPath:
          nearestPointToCurrentLocation.cumulativeDescent,
        distanceFromPath: distanceFromPath,
        pointsOfInterest: newPois,
        pointOfInterestScrollToIndex: 1
      };
    });

    //
    // console.log(indexOf);
    //update current location

    //let pointCurrentIndex = 0;
    //const newPois = [];

    //this.state.pointsOfInterest.forEach((x, index) => {
    //  if (x.currentLocation !== undefined && x.currentLocation) {
    //    return;
    //  }
    //  if (index === this.state.pointsOfInterest.length - 1) {
    //    //reached the end
    //    newPois.push(x);
    //    if (x.nearestMetreOfPath < nearestPointToCurrentLocation.metreOfPath) {
    //      newPois.push(pointCurrent);
    //      pointCurrentIndex = index;
    //    }
    //    return;
    //  }
    //  const nextPointOfInterest = this.state.pointsOfInterest[index + 1];
    //  if (
    //    x.nearestMetreOfPath <= nearestPointToCurrentLocation.metreOfPath &&
    //    nextPointOfInterest.nearestMetreOfPath >
    //      nearestPointToCurrentLocation.metreOfPath
    //  ) {
    //    newPois.push(x);
    //    newPois.push(pointCurrent);
    //    pointCurrentIndex = index;
    //  } else {
    //    newPois.push(x);
    //  }
    //});

    //this.setState({
    //  locationKnown: true,
    //  nearestMetreOfPath: nearestPointToCurrentLocation.metreOfPath,
    //  elevationAtNearestMetreOfPath: nearestPointToCurrentLocation.elevation,
    //  cumulativeAscentAtNearestMetreOfPath:
    //    nearestPointToCurrentLocation.cumulativeAscent,
    //  cumulativeDescentAtNearestMetreOfPath:
    //    nearestPointToCurrentLocation.cumulativeDescent,
    //  distanceFromPath: distanceFromPath,
    //  pointsOfInterest: newPois,
    //  pointOfInterestScrollToIndex: 1
    //});
  }

  onLocationChanged(lat, lng) {
    if (this.state.locationKnown === false) {
      this.scrollToAfterComponentDidUpdate = true;
    }

    this.findNearestPointToLocationAndUpdate(lat, lng);
  }

  onStartPositionWatch() {
    this.setState({ locationKnown: false });
    //this.scrollToAfterComponentDidUpdate = true;
  }

  onPointOfInterestModalClose(name) {
    this.setState({ selectedPointOfInterest: undefined });
  }

  onPointOfInterestClick(pointOfInterest) {
    this.setState({ selectedPointOfInterest: pointOfInterest });
  }

  render() {
    this.language = LanguageHelper.getLanguage(this.props.language);

    this.pageTitle = 'GR10 trail tracker';
    this.title = 'GR10 trail tracker';
    this.aboutLinkText = 'About';
    switch (this.language) {
      case 'fr':
        this.title = 'Sentier GR10';
        this.aboutLinkText = 'Informations';
        break;
      case 'en':
      default:
        break;
    }

    const rows = this.state.pointsOfInterest.map((x, index) => {
      const key = `${x.nearestMetreOfPath}${x.currentLocation ? x.name : ''}`;

      return (
        <PointOfInterestRow
          language={this.language}
          key={key}
          name={x.name}
          elevationAtNearestMetreOfPath={x.elevation}
          pathMetre={this.state.nearestMetreOfPath}
          pathElevation={this.state.elevationAtNearestMetreOfPath}
          pathCumulativeAscent={this.state.cumulativeAscentAtNearestMetreOfPath}
          pathCumulativeDescent={
            this.state.cumulativeDescentAtNearestMetreOfPath
          }
          onClick={this.onPointOfInterestClick}
          pointOfInterest={x}
        />
      );
    });

    const locationComponent = this.props.testMode ? (
      <LocationOverride
        onLocationChanged={this.onLocationChanged}
        language={this.language}
      />
    ) : (
      <LocationWatcher
        onLocationChanged={this.onLocationChanged}
        onStartPositionWatch={this.onStartPositionWatch}
        language={this.language}
      />
    );

    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: this.language }}>
          <title>{this.pageTitle}</title>
          <link rel="alternative" href="en/gr10/trail-tracker" hreflang="en" />
          <link rel="alternative" href="fr/gr10/trail-tracker" hreflang="fr" />
        </Helmet>

        <div className="pathTrackerHeader">
          <header className="App-header">
            <Menu language={this.props.language} origin={this.props.origin} />
            <h1 className="App-title">{this.title}</h1>
          </header>
          {locationComponent}
        </div>

        <div className="App-content pathTrackerContent">
          <div>
            <div className="pointsOfInterest">
              {this.state.pointsOfInterest.length === 0 && (
                <div className="loader" />
              )}
              {rows}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PathTracker;
//<PointOfInterestList
//    pointsOfInterest={this.state.pointsOfInterest} />
