import React, { Component } from 'react';
import HotelImage from '../images/hotel.svg';
import ShoppingBagImage from '../images/shopping-basket.svg';
import CampingImage from '../images/camping2.svg';

class PointOfInterestFacilities extends Component {
  render() {
    if (this.props.hotel || this.props.foodshop || this.props.camping) {
      return (
        <div className="facilityImgContainer">
          {this.props.hotel ? (
            <img className="facilityImg" src={HotelImage} />
          ) : (
            ''
          )}

          {this.props.camping ? (
            <img className="facilityImg" src={CampingImage} />
          ) : (
            ''
          )}
          {this.props.foodshop ? (
            <img className="facilityImg" src={ShoppingBagImage} />
          ) : (
            ''
          )}
        </div>
      );
    } else {
      return null;
    }
  }
}

export default PointOfInterestFacilities;
