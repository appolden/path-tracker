import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import { TrailMap } from '../component/trail-map.jsx';

export class TrailMapEnglish extends Component {
  render() {
    return (
      <React.Fragment>
        <TrailMap
          google={this.props.google}
          language="en"
          origin={this.props.origin}
          trailName={this.props.trailName}
          poisUrl={this.props.poisUrl}
        />
      </React.Fragment>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCbTwcCRBzA9Qc5dT_aPYebyiprFlV1WVE',
  libraries: ['geometry'],
  language: 'en'
})(TrailMapEnglish);
