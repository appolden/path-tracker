import React, { Component } from 'react';
import PropTypes from 'prop-types';

class PointCurrent extends Component {
  render() {
    return (
      <div key={this.props.name} className="pointCurrent">
        <div style={{ textAlign: 'right' }}>East</div>
        <div style={{ textAlign: 'center', fontSize: '1.5em' }}>
          Km: {(this.props.pathMetre * 0.001).toFixed(2)}, Alt:{' '}
          {this.props.pathElevation} metres{' '}
        </div>
        <div style={{ textAlign: 'left' }}>West</div>
      </div>
    );
  }
}

PointCurrent.propTypes = {
  pathMetre: PropTypes.number,
  pathElevation: PropTypes.number
};

export default PointCurrent;
