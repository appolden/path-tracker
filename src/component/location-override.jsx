import React, { Component } from 'react';

class LocationOverride extends Component {
  constructor(props) {
    super(props);

    this.testLocations = [
      { lat: 43.300447, lng: -1.473541 },
      { lat: 43.196166, lng: -1.374664 },
      { lat: 43.151348, lng: -1.268578 },
      { lat: 43.028243, lng: -1.058121 },
      { lat: 42.977525, lng: -0.806122 },
      { lat: 42.88653, lng: -0.578156 },
      { lat: 42.92928, lng: -0.251312 },
      { lat: 42.865899, lng: 0.097504 },
      { lat: 42.807492, lng: 0.291138 },
      { lat: 42.83771, lng: 0.822601 },
      { lat: 42.808247, lng: 1.151848 },
      { lat: 42.793669, lng: 1.169057 },
      { lat: 42.787716, lng: 1.268749 },
      { lat: 42.699595, lng: 1.486244 },
      { lat: 42.727848, lng: 1.613274 },
      { lat: 42.631938, lng: 1.777725 },
      { lat: 42.470577, lng: 2.331848 },
      { lat: 42.470577, lng: 2.331848 },
      { lat: 2.470577, lng: 2.331848 },
      { lat: 42.474629, lng: 3.12252 }
    ];

    this.state = {
      lat: 42.865442,
      lng: -0.879819
    };

    this.handleLatChange = this.handleLatChange.bind(this);
    this.handleLngChange = this.handleLngChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
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

    if (this.props.onLocationChanged !== undefined) {
      this.props.onLocationChanged(this.state.lat, this.state.lng);
    }
  }

  render() {
    return (
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
        <input type="button" value="Update" onClick={this.handleClick} />{' '}
        <input
          type="button"
          value="Random location"
          onClick={this.handleRandomLocationClick}
        />
      </p>
    );
  }
}

export default LocationOverride;
