import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ArrowUp from '../icons/arrow-thick-top.svg';
import ArrowBottom from '../icons/arrow-thick-bottom.svg';

class PointCurrent extends Component {
  render() {
    return (
      <div key={this.props.name} className="pointCurrent">
        <div style={{ textAlign: 'right' }}>
          {' '}
          <img src={ArrowUp} alt="Up" height="15px" /> East
        </div>
        <div style={{ textAlign: 'center', fontSize: '1.5em' }}>
          Km: {(this.props.pathMetre * 0.001).toFixed(2)}, Alt:{' '}
          {this.props.pathElevation} m{' '}
        </div>
        <div style={{ textAlign: 'left' }}>
          {' '}
          <img src={ArrowBottom} alt="Up" height="15px" />West
        </div>
      </div>
    );
  }
}

PointCurrent.propTypes = {
  pathMetre: PropTypes.number,
  pathElevation: PropTypes.number
};

export default PointCurrent;
