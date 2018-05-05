import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Map } from 'google-maps-react';
import Menu from '../component/menu.jsx';
import LanguageHelper from '../component/language-helper.js';

export class TrailMap extends Component {
  constructor(props) {
    super(props);

    this.google = undefined;
    this.map = undefined;
    this.infoWindow = undefined;

    this.hotels = [
      {
        name: 'Appts maison Onbor Zilo',
        tel: '',
        url:
          'http://www.booking.com/hotel/fr/appts-maison-onbor-zilo.html?aid=1522736&no_rooms=1&group_adults=1',
        point: {
          lat: 43.33409,
          lng: -1.744643
        }
      },
      {
        name: 'Les Jardins de Bakea',
        tel: '',
        url:
          'http://www.booking.com/hotel/fr/les-jardins-de-bakea.html?aid=1522736&no_rooms=1&group_adults=1',
        point: {
          lat: 43.33345,
          lng: -1.744482
        }
      },
      {
        name: 'Xagardixar',
        tel: '',
        url:
          'http://www.booking.com/hotel/fr/xagardixar.html?aid=1522736&no_rooms=1&group_adults=1'
      },
      {
        name: 'Istokita Berri',
        tel: '',
        url:
          'http://www.booking.com/hotel/fr/istokita-berri.html?aid=1522736&no_rooms=1&group_adults=1'
      },
      {
        name: "Chambre d'h�tes Maison Kabia",
        tel: '+33 5 59 26 03 16',
        url:
          'http://resa.terreetcotebasques.com/fr/hebergements/a358610/chambre-dh%C3%B4te-maison-kabia/details'
      },
      {
        name: 'Auberge Hiribarren',
        tel: '+33 5 59 20 61 83',
        url: 'http://www.auberge-hiribarren.com/'
      }
    ];

    switch (this.props.trailName) {
      case 'gr10':
      default:
        this.polylineUrl = '/data/gr10-route.json';
        this.campingUrl = '/data/gr10-points-of-interest-to-locate.json'; //C:\Code\path-tracker\public\data\gr10-points-of-interest-to-locate.json
        this.poisUrl = '/data/gr10-points-of-interest.json';
        this.initialCenter = { lat: 42.823647, lng: 0.795077 };
        this.initialZoom = 6;
        break;
      case 'gr20':
        this.polylineUrl = '/data/gr20/gr20-route.json';
        this.poisUrl = undefined;
        this.campingUrl = undefined;
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

    this.loadPointsOfInterest();
  };

  loadPointsOfInterest() {
    const url = this.poisUrl;

    if (url === undefined) {
      return;
    }

    if ('caches' in window) {
      caches
        .open('data')
        .then(cache => {
          return cache.match(url).then(cacheResponse => {
            if (cacheResponse === undefined) {
              fetch(url).then(response => {
                const cloned = response.clone();
                cache.put(url, response);
                cloned.json().then(data => this.pointsOfInterestLoaded(data));
              });
            } else {
              cacheResponse
                .json()
                .then(data => this.pointsOfInterestLoaded(data));

              //now check for new data and update the cache
              fetch(url).then(fetchResponse => {
                const cloned = fetchResponse.clone();
                fetchResponse.json().then(data => {
                  cache.put(url, cloned);
                  //this.pointsOfInterestLoaded(data);
                });
              });
            }
          });
        })
        .catch(error => {
          console.error(`Error using cache. ${error}`);
          fetch(url)
            .then(response => response.json())
            .then(data => this.pointsOfInterestLoaded(data));
        });
    } else {
      fetch(url)
        .then(response => response.json())
        .then(data => this.pointsOfInterestLoaded(data));
    }
  }

  pointsOfInterestLoaded(data) {
    const accommodationLists = data
      .filter(x => x.accommodations)
      .map(x => x.accommodations);

    this.hotels = accommodationLists.reduceRight(
      (previousValue, currentValue) => previousValue.concat(currentValue)
    );

    //console.log(placesWithHotels);
    this.hotels.forEach(x => {
      console.log(x);
      this.addHotel(this.google, this.map, x);
    });
  }

  addHotel(google, map, hotel) {
    if (this.infoWindow === undefined) {
      this.infoWindow = new google.maps.InfoWindow({
        content: ''
      });
    }

    if (hotel.point) {
      const marker = new google.maps.Marker({
        map: map,
        position: {
          lat: hotel.point.lat,
          lng: hotel.point.lng
        },
        title: hotel.name,
        icon: '/images/bed.png'
      });

      marker.addListener('click', () => {
        this.onHotelClick(marker, hotel);
      });

      marker.addListener('dblclick', () => {
        this.onHotelDoubleClick(marker);
      });
    }
  }

  onHotelClick(marker, hotel) {
    let description = hotel.description !== undefined ? hotel.description : '';
    let bookingUrl = `<a href=${hotel.url} title=${hotel.name} target="_blank"
              rel="noopener noreferrer">${hotel.name}</a>`;

    const content = `<h3>${
      hotel.name
    }</h3><div><p>${description}</p><p>${bookingUrl}</p></div>`;

    this.infoWindow.setContent(content);
    this.infoWindow.open(this.map, marker);
  }
  onHotelDoubleClick(marker) {
    const zoomLevel = 17;
    this.map.setCenter(marker.getPosition());

    if (this.map.getZoom() < zoomLevel) {
      this.map.setZoom(zoomLevel);
    }
  }

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
      title: campingLocation.name
    });

    marker.addListener('click', () => {
      this.onMarkerClick(marker, campingLocation);
    });
  }

  onMarkerClick(marker, campingLocation) {
    let description =
      campingLocation.description !== undefined
        ? campingLocation.description.en || campingLocation.description.fr
        : '';

    switch (LanguageHelper.getLanguage(this.props.language)) {
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

  render() {
    let title = 'GR10 Mapss';

    const language = LanguageHelper.getLanguage(this.props.language);

    switch (this.props.trailName) {
      case 'gr10':
      default:
        switch (LanguageHelper.getLanguage(this.props.language)) {
          case 'fr':
            title = 'GR10 Carte';
            break;
          case 'en':
          default:
            title = 'GR10 Map';
        }
        break;
      case 'gr20':
        switch (LanguageHelper.getLanguage(this.props.language)) {
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
          <link
            rel="alternative"
            href={'en/' + this.props.trailName + '/map'}
            hreflang="en"
          />

          <link
            rel="alternative"
            href={'fr/' + this.props.trailName + '/map'}
            hreflang="fr"
          />
        </Helmet>

        <header className="App-header">
          <Menu
            language={language}
            origin={this.props.origin}
            useBrowserLinks={true}
          />
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
