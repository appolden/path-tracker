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

    switch (this.props.trailName) {
      case 'gr10':
        this.polylineUrl = '/data/gr10-route.json';
        this.campingUrl = '/data/gr10-camping.json';
        this.initialCenter = { lat: 42.823647, lng: 0.795077 }; //{ lat: 42.956607, lng: -0.328833 };
        this.initialZoom = 6;
        break;
      case 'gr20':
        this.polylineUrl = '/data//gr20/gr20-route.json';
        this.campingUrl = '/data/gr10-camping.json';
        this.initialCenter = { lat: 42.121206, lng: 9.124647 };
        this.initialZoom = 8;
    }
  }

  onMapReady = (mapProps, map) => {
    this.map = map;
    this.google = mapProps.google;

    fetch(this.polylineUrl)
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

    fetch(this.campingUrl)
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

    switch (this.getLanguage()) {
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
    let title = 'GR10 Mapss';

    const language = this.getLanguage();

    switch (this.props.trailName) {
      case 'gr10':
      default:
        switch (this.getLanguage()) {
          case 'fr':
            title = 'GR10 Carte';
            break;
          case 'en':
          default:
            title = 'GR10 Map';
        }
        break;
      case 'gr20':
        switch (this.getLanguage()) {
          case 'fr':
            title = 'GR20 Carte';
            break;
          case 'en':
          default:
            title = 'GR20 Map';
        }
        break;
    }

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
              zoom={this.initialZoom}
              onReady={this.onMapReady}
              initialCenter={this.initialCenter}
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
