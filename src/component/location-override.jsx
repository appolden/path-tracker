import React, { Component } from 'react';
import LanguageHelper from '../component/language-helper.js';

class LocationOverride extends Component {
  constructor(props) {
    super(props);

    this.testLocations = [
      { lat: 43.309316, lng: -1.59246 },
      { lat: 43.323148, lng: -1.656661 },
      { lat: 43.305069, lng: -1.522808 },
      { lat: 43.272112, lng: -1.418138 },
      { lat: 43.263613, lng: -1.356039 }
    ];

    this.buttonText = {
      en: 'Start tracking',
      fr: 'Commencer le suivi'
    };

    this.buttonTextWhenTracking = {
      en: 'Stop tracking',
      fr: 'Arr�ter le suivi'
    };

    this.state = {
      position: { lat: undefined, lng: undefined },
      error: undefined,
      watchingPosition: false
    };
    this.handleRandomLocationClick = this.handleRandomLocationClick.bind(this);
  }

  handleLatChange(event) {
    this.setState({ lat: event.target.value });
  }

  handleLngChange(event) {
    this.setState({ lng: event.target.value });
  }

  handleClick(event) {
    if (this.props.onLocationChanged !== undefined) {
      this.props.onLocationChanged(this.state.lat, this.state.lng);
    }
  }

  handleRandomLocationClick(event) {
    const randomTestLocation = this.testLocations[
      Math.floor(Math.random() * this.testLocations.length)
    ];

    this.setState({ lat: randomTestLocation.lat, lng: randomTestLocation.lng });

    this.setState(prevState => {
      prevState.position.lat = randomTestLocation.lat;
      prevState.position.lng = randomTestLocation.lng;
      prevState.error = '';
      prevState.watchingPosition = !prevState.watchingPosition;

      return prevState;
    });

    if (this.props.onLocationChanged !== undefined) {
      this.props.onLocationChanged(
        randomTestLocation.lat,
        randomTestLocation.lng
      );
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
        {this.state.position.lat !== undefined && (
          <React.Fragment>
            {this.state.position.lat.toFixed(5)},{' '}
            {this.state.position.lng.toFixed(5)}{' '}
          </React.Fragment>
        )}
        <input
          className="btn"
          type="button"
          value={buttonText}
          onClick={this.handleRandomLocationClick}
          disabled={this.state.getCurrentPositionInProgress}
        />{' '}
        {this.state.error}
      </div>
    );
  }
}

export default LocationOverride;
