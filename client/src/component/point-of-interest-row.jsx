import React, { Component } from 'react';
import PointOfInterest from '../component/point-of-interest.jsx';
import PointCurrent from '../component/point-current.jsx';

class PointOfInterestRow extends Component {
  render() {
    if (this.props.pointOfInterest.currentLocation) {
      return (
        <PointCurrent
          language={this.props.language}
          key="CurrentPoint"
          ref={section => {
            this.pointCurrent = section;
          }}
          pathMetre={this.props.pathMetre}
          pathElevation={this.props.pathElevation}
          distanceFromPath={this.props.distanceFromPath}
          scrollTo={this.props.scrollTo}
        />
      );
    } else {
      return (
        <PointOfInterest
          language={this.props.language}
          name={this.props.pointOfInterest.name}
          pathMetre={this.props.pathMetre}
          pathElevation={this.props.pathElevation}
          pathCumulativeAscent={this.props.pathCumulativeAscent}
          pathCumulativeDescent={this.props.pathCumulativeDescent}
          pointOfInterest={this.props.pointOfInterest}
        />
      );
    }
  }
}

export default PointOfInterestRow;
