import React, { Component } from 'react';
import HotelImage from '../images/hotel.svg';
import GiteImage from '../images/gite2.svg';
import CampingImage from '../images/camping2.svg';
import CabaneImage from '../images/cabane.svg';
import ShoppingBagImage from '../images/shopping-basket.svg';
import RestaurantImage from '../images/restaurant2.svg';

class FacilityKey extends Component {
  render() {
    const imageStyle = { width: '40px', height: '40px' };

    return (
      <React.Fragment>
        <h2>Facility key</h2>
        <p>
          Places that have facilities will be shown using the images below.
          Where possible I have added opening times (obtained from google maps).
          But be aware that there many places will only be open during summer.
        </p>
        <table>
          <tbody>
            <tr>
              <td>
                <img src={HotelImage} style={imageStyle} alt="hotel" />
              </td>
              <td>Hotel</td>
            </tr>
            <tr>
              <td>
                <img src={GiteImage} style={imageStyle} alt="Gîte" />
              </td>
              <td>Gîte d'etape</td>
            </tr>
            <tr>
              <td>
                <img src={CampingImage} style={imageStyle} alt="camping" />
              </td>
              <td>
                Camping - Check the trail notes to discover if this is a
                campground or an aire de bivouac (wild camping)
              </td>
            </tr>
            <tr>
              <td>
                <img src={CabaneImage} style={imageStyle} alt="cabane" />
              </td>
              <td>Cabane/Bivvy</td>
            </tr>
            <tr>
              <td>
                <img src={ShoppingBagImage} style={imageStyle} alt="hotel" />
              </td>
              <td>
                Shopping - Check the trail notes for information about the shops
                available. For example, supermarket or small tourist shops
              </td>
            </tr>
            <tr>
              <td>
                <img src={RestaurantImage} style={imageStyle} alt="hotel" />
              </td>
              <td>Bar-restaurant</td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default FacilityKey;
