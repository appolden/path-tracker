import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import ArrowUp from '../icons/arrow-thick-top.svg';
import ArrowBottom from '../icons/arrow-thick-bottom.svg';

class PointCurrent extends Component {
  componentDidMount() {
    if (this.props.scrollTo) {
      const elem = ReactDOM.findDOMNode(this);
      window.scrollTo(0, elem.offsetTop - 150);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.scrollTo) {
      const elem = ReactDOM.findDOMNode(this);
      window.scrollTo(0, elem.offsetTop - 150);
    }
  }

  render() {
    return (
      <div key={this.props.name} className="pointCurrent">
        <div style={{ textAlign: 'right' }}>
          <div style={{ float: 'left' }}>Current location</div>
          <img src={ArrowUp} alt="Up" height="15px" /> East
        </div>
        <div style={{ textAlign: 'center', fontSize: '1.5em' }}>
          Km: {(this.props.pathMetre * 0.001).toFixed(2)}, Alt:{' '}
          {this.props.pathElevation} m{' '}
        </div>
        {this.props.distanceFromPath > 50 && (
          <div style={{ textAlign: 'center' }}>
            You are {this.props.distanceFromPath.toFixed(0)} metres away from
            the path.
          </div>
        )}
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
  pathElevation: PropTypes.number,
  scrollTo: PropTypes.bool
};

export default PointCurrent;
