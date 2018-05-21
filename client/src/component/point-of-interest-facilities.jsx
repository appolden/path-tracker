import React, { Component } from 'react';
import HotelImage from '../images/hotel.svg';
import GiteImage from '../images/gite2.svg';
import CampingImage from '../images/camping2.svg';
import CabaneImage from '../images/cabane.svg';
import ShoppingBagImage from '../images/shopping-basket.svg';
import RestaurantImage from '../images/restaurant2.svg';

class PointOfInterestFacilities extends Component {
  render() {
    if (
      this.props.hotel ||
      this.props.gite ||
      this.props.camping ||
      this.props.cabane ||
      this.props.foodshop ||
      this.props.restaurant
    ) {
      return (
        <div className="facilityImgContainer">
          {this.props.hotel ? (
            <img
              className="facilityImg"
              src={HotelImage}
              alt="hotel"
              title="hotel"
              style={{ paddingRight: '3px' }}
            />
          ) : (
            ''
          )}

          {this.props.gite ? (
            <img
              className="facilityImg"
              src={GiteImage}
              alt="gite"
              title="gite"
              style={{ paddingRight: '3px' }}
            />
          ) : (
            ''
          )}

          {this.props.cabane ? (
            <img
              className="facilityImg"
              src={CabaneImage}
              alt="cabane"
              title="cabane"
              style={{ paddingRight: '3px' }}
            />
          ) : (
            ''
          )}

          {this.props.camping ? (
            <img
              className="facilityImg"
              src={CampingImage}
              alt="camping"
              title="camping"
            />
          ) : (
            ''
          )}

          {this.props.restaurant ? (
            <img
              className="facilityImg"
              src={RestaurantImage}
              alt="restaurant"
              title="restaurant"
              style={{ paddingRight: '5px' }}
            />
          ) : (
            ''
          )}

          {this.props.foodshop ? (
            <img
              className="facilityImg"
              src={ShoppingBagImage}
              alt="foodshop"
              title="foodshop"
            />
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
