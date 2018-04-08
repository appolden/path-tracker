import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import { TrailMap } from '../component/trail-map.jsx';

export class TrailMapFrench extends Component {
  render() {
    const title = 'G10 Map';
    return (
      <React.Fragment>
        <TrailMap
          google={this.props.google}
          language="fr"
          origin={this.props.origin}
          trailName={this.props.trailName}
        />
      </React.Fragment>
    );
  }
}

//export default TrailMapFrench

export default GoogleApiWrapper({
  apiKey: 'AIzaSyCbTwcCRBzA9Qc5dT_aPYebyiprFlV1WVE',
  libraries: ['geometry'],
  language: 'fr'
})(TrailMapFrench);
