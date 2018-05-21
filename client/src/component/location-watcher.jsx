import React, { Component } from 'react';
import LanguageHelper from '../component/language-helper.js';

class LocationWatcher extends Component {
  constructor(props) {
    super(props);

    this.watchPositionId = undefined;

    this.buttonText = {
      en: 'Enable location detection',
      fr: 'Commencer le suivi'
    };

    this.buttonTextWhenTracking = {
      en: 'Stop locating',
      fr: 'Arrêter le suivi'
    };

    this.state = {
      position: { lat: undefined, lng: undefined },
      error: undefined,
      watchingPosition: false
    };

    this.onStartStopPositionWatchButtonClick = this.onStartStopPositionWatchButtonClick.bind(
      this
    );
  }

  componentWillUnmount() {
    if ('geolocation' in navigator) {
      if (this.watchPositionId !== undefined && this.watchPositionId > 0) {
        navigator.geolocation.clearWatch(this.watchPositionId);
        this.watchPositionId = undefined;
      }
    }
  }

  onStartStopPositionWatchButtonClick(event) {
    if (this.state.watchingPosition) {
      this.stopPositionWatch();
    } else {
      this.startPositionWatch();
    }
  }

  startPositionWatch() {
    if ('geolocation' in navigator) {
      this.setState({ error: '', watchingPosition: true });

      if (this.props.onStartPositionWatch !== undefined) {
        this.props.onStartPositionWatch();
      }

      var geoLocateOptions = {
        enableHighAccuracy: true,
        timeout: 25000,
        maximumAge: 0
      };

      this.watchPositionId = navigator.geolocation.watchPosition(
        position => {
          this.setState(prevState => {
            prevState.position.lat = position.coords.latitude;
            prevState.position.lng = position.coords.longitude;
            prevState.error = '';

            return prevState;
          });

          if (this.props.onLocationChanged !== undefined) {
            this.props.onLocationChanged(
              position.coords.latitude,
              position.coords.longitude
            );
          }
        },
        error => {
          this.setState({
            error: 'Unable to find location. Ensure you have location enabled.'
          });
          console.log(error);

          this.stopPositionWatch();
        },
        geoLocateOptions
      );
    } else {
      this.setState({
        error: 'geolocation not available',
        watchingPosition: false
      });
    }
  }

  stopPositionWatch() {
    if ('geolocation' in navigator) {
      if (this.watchPositionId !== undefined && this.watchPositionId > 0) {
        navigator.geolocation.clearWatch(this.watchPositionId);
        this.watchPositionId = undefined;

        switch (LanguageHelper.getLanguage(this.props.language)) {
          case 'fr':
            this.setState({ watchingPosition: false });
            break;
          case 'en': // in case a user enters a language code that is not supported
          default:
            this.setState({ watchingPosition: false });
        }
      }
    }
  }
  render() {
    let buttonText = '';

    switch (LanguageHelper.getLanguage(this.props.language)) {
      case 'fr':
        buttonText = this.state.watchingPosition
          ? this.buttonTextWhenTracking.fr
          : this.buttonText.fr;
        break;
      case 'en':
      default:
        buttonText = this.state.watchingPosition
          ? this.buttonTextWhenTracking.en
          : this.buttonText.en;
    }

    return (
      <div>
        <input
          className="btn"
          type="button"
          value={buttonText}
          onClick={this.onStartStopPositionWatchButtonClick}
          disabled={this.state.getCurrentPositionInProgress}
        />{' '}
        {this.state.watchingPosition &&
          this.state.position.lat !== undefined && (
            <React.Fragment>
              {this.state.position.lat.toFixed(5)},{' '}
              {this.state.position.lng.toFixed(5)}{' '}
            </React.Fragment>
          )}
        {this.state.error}
      </div>
    );
  }
}

export default LocationWatcher;
