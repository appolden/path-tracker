import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Map } from 'google-maps-react';
import Menu from '../component/menu.jsx';

export class TrailMap extends Component {
  constructor(props) {
    super(props);

    this.google = undefined;
    this.map = undefined;
    this.infoWindow = undefined;
  }

  onMapReady = (mapProps, map) => {
    this.map = map;
    this.google = mapProps.google;

    fetch('/data/gr10-route.json')
      .then(response => response.json())
      .then(data => {
        const decodedPath = mapProps.google.maps.geometry.encoding.decodePath(
          data.polyline
        );
        const trail = new mapProps.google.maps.Polyline({
          path: decodedPath,
          strokeColor: '#FF0000',
          strokeOpacity: 1.0,
          strokeWeight: 4
        });

        trail.setMap(map);
      });

    fetch('/data/gr10-camping.json')
      .then(response => response.json())
      .then(campingLocations => {
        campingLocations.forEach(x => {
          this.addCampingLocation(mapProps.google, map, x);
        });
      });
  };

  addCampingLocation(google, map, campingLocation) {
    if (this.infoWindow === undefined) {
      this.infoWindow = new google.maps.InfoWindow({
        content: ''
      });
    }

    const marker = new google.maps.Marker({
      map: map,
      position: {
        lat: campingLocation.point.lat,
        lng: campingLocation.point.lng
      },
      title: campingLocation.name,
      icon: '/images/tent.png'
    });

    marker.addListener('click', () => {
      this.onMarkerClick(marker, campingLocation);
    });
  }

  onMarkerClick(marker, campingLocation) {
    let description =
      campingLocation.description.en || campingLocation.description.fr;

    switch (this.getLanguage) {
      case 'fr':
        description = campingLocation.description.fr;
        break;
      case 'en':
      default:
    }

    const content = `<h3>${
      campingLocation.name
    }</h3><div><p>${description}</p></div>`;
    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, marker);
  }

  getLanguage() {
    const language = (this.props.language || 'en').toLowerCase();
    switch (language) {
      case 'fr':
        return language;
        break;
      case 'en': // in case a user enters a language code that is not supported
      default:
        return 'en';
    }
  }

  render() {
    let title = 'GR10 Map';

    const language = this.getLanguage();

    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: language }}>
          <title>{title}</title>
        </Helmet>
        <Menu
          language={language}
          origin={this.props.origin}
          useBrowserLinks={true}
        />
        <header className="App-header">
          <h1 className="App-title">{title}</h1>
        </header>
        <div className="App-content">
          <div className="mapContainer">
            <Map
              google={this.props.google}
              zoom={7}
              onReady={this.onMapReady}
              initialCenter={{ lat: 42.956607, lng: -0.328833 }}
              clickableIcons={true}
              className="map"
            />
          </div>

          <p>
            Icons made by{' '}
            <a
              href="http://www.freepik.com"
              title="Freepik"
              rel="noopener noreferrer"
            >
              Freepik
            </a>{' '}
            from{' '}
            <a
              href="https://www.flaticon.com/"
              title="Flaticon"
              rel="noopener noreferrer"
            >
              www.flaticon.com
            </a>{' '}
            is licensed by{' '}
            <a
              href="http://creativecommons.org/licenses/by/3.0/"
              title="Creative Commons BY 3.0"
              target="_blank"
              rel="noopener noreferrer"
            >
              CC 3.0 BY
            </a>
          </p>
        </div>
      </React.Fragment>
    );
  }
}
export default TrailMap;
