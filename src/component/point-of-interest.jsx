import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PointOfInterest extends Component {
    render() {

        let ascent = 0;
        let descent = 0
        if (this.props.pathMetre <= this.props.nearestMetreOfPath){
            //point is west
            ascent = this.props.cumulativeAscentAtNearestMetreOfPath - (this.props.pathCumulativeAscent || 0);
            descent = this.props.cumulativeDescentAtNearestMetreOfPath - (this.props.pathCumulativeDescent || 0);
        } else{
            //point is east
            ascent = (this.props.pathCumulativeDescent || 0) - this.props.cumulativeDescentAtNearestMetreOfPath;
            descent = (this.props.pathCumulativeAscent || 0) - this.props.cumulativeAscentAtNearestMetreOfPath;
        }


    return (
      <div key={this.props.name} className="pointOfInterest">
        <div>
      {this.props.pathMetre > this.props.nearestMetreOfPath ? 'W' : 'E'}{' '}
      {(
            Math.abs(this.props.pathMetre - this.props.nearestMetreOfPath) *
          0.001
          ).toFixed(2)}{' '}
          kms, {ascent} metres of ascent, {descent} metres of descent
        </div>
        <div>
          Km {(this.props.nearestMetreOfPath * 0.001).toFixed(2)},{' '}
          {this.props.name}
        </div>
        <div>
              Altitude: {this.props.elevationAtNearestMetreOfPath} metres.
                  </div>
            </div>
    );
          }
}

PointOfInterest.propTypes = {
  name: PropTypes.string,
  nearestMetreOfPath: PropTypes.number
};

export default PointOfInterest;
