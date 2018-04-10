import React, { Component } from 'react';
import HotelImage from '../images/hotel.svg';
import ShoppingBagImage from '../images/groceries-bag.svg';
import CampingImage from '../images/camping.svg';

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
          {this.props.foodshop ? (
            <img className="facilityImg" src={ShoppingBagImage} />
          ) : (
            ''
          )}
          {this.props.camping ? (
            <img className="facilityImg" src={CampingImage} />
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
