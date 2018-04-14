import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ArrowUp from '../icons/arrow-top.svg';
import ArrowBottom from '../icons/arrow-bottom.svg';
import PointOfInterestFacilities from '../component/point-of-interest-facilities.jsx';

class PointOfInterest extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.state = { showDetail: false };
  }

  onClick(name) {
    this.setState(prevState => ({ showDetail: !prevState.showDetail }));
    if (this.props.onClick !== undefined) {
      this.props.onClick(this.props.pointOfInterest);
    }
  }

  accommodationList(accommodations) {
    if ((accommodations || []).length > 0) {
      const accommodationList = this.props.pointOfInterest.accommodations.map(
        accommodation => {
          const tel = accommodation.tel || '';
          const telLink =
            tel.length > 0 ? (
              <React.Fragment>
                {' - '} <a href={'tel:' + tel}>{tel}</a>{' '}
              </React.Fragment>
            ) : (
              ''
            );
          const url = accommodation.url || '';
          const item =
            url.length > 0 ? (
              <a href={accommodation.url}>{accommodation.name}</a>
            ) : (
              accommodation.name
            );

          return (
            <li key={accommodation.name}>
              {item}
              {telLink}
            </li>
          );
        }
      );

      return <ul>{accommodationList}</ul>;
    }
  }

  accommodationSearch(props) {
    if (props.pointOfInterest.accommodationSearchUrl) {
      return (
        <p>
          <a
            href={props.pointOfInterest.accommodationSearchUrl}
            target="_blank"
          >
            Search for accommodation
          </a>
        </p>
      );
    }
  }

  getLanguageSpecificDescription(props) {
    if (props.pointOfInterest.description === undefined) {
      return '';
    }

    switch (props.language) {
      case 'fr':
        return <p>{props.pointOfInterest.description.fr}</p>;
      case 'en':
      default:
        return <p>{props.pointOfInterest.description.en}</p>;
    }
  }

  render() {
    //console.log(this.props);

    let ascent = 0;
    let descent = 0;
    if (this.props.pathMetre <= this.props.pointOfInterest.nearestMetreOfPath) {
      //point is west
      ascent =
        this.props.pointOfInterest.cumulativeAscent -
        (this.props.pathCumulativeAscent || 0);
      descent =
        this.props.pointOfInterest.cumulativeDescent -
        (this.props.pathCumulativeDescent || 0);
    } else {
      //point is east
      ascent =
        (this.props.pathCumulativeDescent || 0) -
        this.props.pointOfInterest.cumulativeDescent;
      descent =
        (this.props.pathCumulativeAscent || 0) -
        this.props.pointOfInterest.cumulativeAscent;
    }

    return (
      <div
        key={this.props.pointOfInterest.nearestMetreOfPath}
        className="pointOfInterest"
      >
        <div onClick={this.onClick}>
          <div>
            {this.props.pathMetre >
            this.props.pointOfInterest.nearestMetreOfPath
              ? 'W'
              : 'E'}{' '}
            {(
              Math.abs(
                this.props.pathMetre -
                  this.props.pointOfInterest.nearestMetreOfPath
              ) * 0.001
            ).toFixed(2)}{' '}
            kms, <img src={ArrowUp} alt="Up" height="12px" />
            {ascent}m, <img src={ArrowBottom} alt="Up" height="12px" />
            {descent}m
          </div>
          <div>
            Km{' '}
            {(this.props.pointOfInterest.nearestMetreOfPath * 0.001).toFixed(2)},{' '}
            {this.props.name}
          </div>

          <div>Altitude: {this.props.pointOfInterest.elevation} m</div>
        </div>
        {this.state.showDetail &&
          (this.props.pointOfInterest.description ||
            this.props.pointOfInterest.accommodations) && (
            <React.Fragment>
              {this.getLanguageSpecificDescription(this.props)}{' '}
              {this.accommodationList(
                this.props.pointOfInterest.accommodations
              )}
              {this.accommodationSearch(this.props)}
            </React.Fragment>
          )}

        <div onClick={this.onClick}>
          <PointOfInterestFacilities
            hotel={
              this.props.pointOfInterest.accommodations ||
              this.props.pointOfInterest.accommodationSearchUrl
            }
            foodshop={this.props.pointOfInterest.foodshop}
            camping={this.props.pointOfInterest.camping}
          />
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
