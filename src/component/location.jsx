import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Location extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lat: 0,
      lng: 0,
        error: undefined,
        getCurrentPositionInProgress: false,
        buttonText: 'Update location'
    };

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
      if ('geolocation' in navigator) {

          this.setState({ buttonText: 'locating', getCurrentPositionInProgress: true })
      navigator.geolocation.getCurrentPosition(
        position => {
          this.setState({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            error: ''
          });

          if (this.props.onLocationChanged !== undefined) {
            this.props.onLocationChanged(this.state.lat, this.state.lng);
          }
        },
        error => {
          this.setState({
              error: 'Unable to find location. Ensure you have location enabled.', buttonText: 'Update location', getCurrentPositionInProgress: false
          });
        },
        { timeout: 15000 }
      );
      } else {
          this.setState({ buttonText: 'Update location', getCurrentPositionInProgress: false })
      alert('Geo-location is not avaiable!!');
    }
  }

  render() {
    return (
      <p>
        {this.state.lat.toFixed(5)}, {this.state.lng.toFixed(6)}{' '}
        <input
                type="button"
                value={this.state.buttonText}
                onClick={this.handleClick} disabled={this.state.getCurrentPositionInProgress}
        />{' '}
        {this.state.error}
      </p>
    );
  }
}

export default Location;
