import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ArrowUp from '../icons/arrow-top.svg';
import ArrowBottom from '../icons/arrow-bottom.svg';

class PointOfInterest extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  onClick(name) {
    if (this.props.onClick !== undefined) {
      this.props.onClick(this.props.pointOfInterest);
    }
  }

  render() {
    let ascent = 0;
    let descent = 0;
    if (this.props.pathMetre <= this.props.nearestMetreOfPath) {
      //point is west
      ascent =
        this.props.cumulativeAscentAtNearestMetreOfPath -
        (this.props.pathCumulativeAscent || 0);
      descent =
        this.props.cumulativeDescentAtNearestMetreOfPath -
        (this.props.pathCumulativeDescent || 0);
    } else {
      //point is east
      ascent =
        (this.props.pathCumulativeDescent || 0) -
        this.props.cumulativeDescentAtNearestMetreOfPath;
      descent =
        (this.props.pathCumulativeAscent || 0) -
        this.props.cumulativeAscentAtNearestMetreOfPath;
    }

    return (
      <div
        key={this.props.nearestMetreOfPath}
        className="pointOfInterest"
        onClick={this.onClick}
      >
        <div>
          {this.props.pathMetre > this.props.nearestMetreOfPath ? 'W' : 'E'}{' '}
          {(
            Math.abs(this.props.pathMetre - this.props.nearestMetreOfPath) *
            0.001
          ).toFixed(2)}{' '}
          kms, <img src={ArrowUp} alt="Up" height="12px" />
          {ascent}m, <img src={ArrowBottom} alt="Up" height="12px" />
          {descent}m
        </div>
        <div>
          Km {(this.props.nearestMetreOfPath * 0.001).toFixed(2)},{' '}
          {this.props.name}
        </div>
        <div>Altitude: {this.props.elevationAtNearestMetreOfPath} m</div>
      </div>
    );
  }
}

PointOfInterest.propTypes = {
  name: PropTypes.string,
  nearestMetreOfPath: PropTypes.number
};

export default PointOfInterest;
