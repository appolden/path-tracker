import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

    this.hotels = [];

    switch (this.props.trailName) {
      case 'gr10':
      default:
        this.longTrailName = 'GR10 Hendaye - Banyuls-sur-Mer';
        this.polylineUrl = '/data/gr10-route.json';
        this.campingUrl = '/data/gr10-points-of-interest-to-locate.json';
        this.poisUrl = '/data/gr10-points-of-interest.json';
        this.initialCenter = { lat: 42.823647, lng: 0.795077 };
        this.initialZoom = 6;
        break;
      case 'gr20':
        this.longTrailName = 'GR20';
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

        trail.addListener('click', event => {
          const distance = mapProps.google.maps.geometry.spherical.computeLength(
            decodedPath
          );
          this.openTrailInfoWindow(this.longTrailName, distance, event.latLng);
        });

        trail.setMap(map);

        if (data.alternates) {
          data.alternates.forEach((alternate, index) => {
            const decodedAlternatePath = mapProps.google.maps.geometry.encoding.decodePath(
              alternate.polyline
            );
            const alternatePolyline = new mapProps.google.maps.Polyline({
              path: decodedAlternatePath,
              strokeColor: '#4b1a7e',
              strokeOpacity: 0.9,
              strokeWeight: 3
            });

            alternatePolyline.setMap(map);

            alternatePolyline.addListener('click', event => {
              const distance = mapProps.google.maps.geometry.spherical.computeLength(
                decodedAlternatePath
              );
              this.openTrailInfoWindow(alternate.name, distance, event.latLng);
            });
          });

          //TO COMBINE POLYLINES
          //let combined = [];
          //data.alternates.forEach((alternate, index) => {
          //    if (alternate.name === 'Bonac') {
          //        const decodedAlternatePath = mapProps.google.maps.geometry.encoding.decodePath(
          //            alternate.polyline
          //        );
          //        combined = combined.concat(
          //            decodedAlternatePath
          //        );
          //    }
          //});
          //console.log(mapProps.google.maps.geometry.encoding.encodePath(combined));
        }
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

    this.hotels.forEach(x => {
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
        icon:
          hotel.name.toLowerCase().indexOf('camping') > -1
            ? '/images/tent.png'
            : '/images/bed.png'
      });

      marker.addListener('click', () => {
        this.onHotelClick(marker, hotel);
      });

      marker.addListener('dblclick', () => {
        this.onHotelDoubleClick(marker);
      });
    }
  }

  openTrailInfoWindow(name, distanceMetres, position) {
    const distanceKms = (distanceMetres * 0.001).toFixed(1);
    const distanceMiles = (distanceMetres * 0.000621371).toFixed(1);

    const content = `<h3>${name}</h3><div><p>${distanceKms} kms, ${distanceMiles} miles</p></div>`;

    this.infoWindow.setContent(content);
    this.infoWindow.setPosition(position);
    this.infoWindow.open(this.map);
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
    const zoomLevel = 16;
    this.map.setCenter(marker.getPosition());

    if (this.map.getZoom() < zoomLevel) {
      this.map.setZoom(zoomLevel);
    }
  }

  content(props) {
    const language = LanguageHelper.getLanguage(this.props.language);
    if (language === 'fr') {
      return <p>Carte du GR10 (Les Pyrénées) et des hébergements</p>;
    }

    return (
      <React.Fragment>
        <p>
          Map of the GR10 trail (The pyrenees) with hotels, gites and camping
          locations. This is not an exhaustive list but gives you a general idea
          of where the accommodation is in relation to the GR10 path.
        </p>
        <p>
          Double click on an icon to zoom in. Single click on an icon to view
          more information.
        </p>
        <p>
          For a list of the towns and a short description refer to the{' '}
          <Link
            to={'/' + language + '/' + this.props.trailName + '/town-guide'}
            title={this.props.trailName + ' town guide'}
          >
            town guide
          </Link>. This guide will be updated in summer 2018.
        </p>
        <h2>Coming soon</h2>
        <ul>
          <li>Campgrounds</li>
          <li>Wild camping spots (aire de bivouac)</li>
          <li>Transport links</li>
          <li>Alternative routes</li>
          <li>Costs</li>
        </ul>
      </React.Fragment>
    );
  }

  render() {
    let title = 'GR10 Map';
    let metaDescription =
      'GR10 trail map (The pyrenees) with hotels, gites and camping locations.';
    let locale = '';
    let localeAlternate = '';

    const language = LanguageHelper.getLanguage(this.props.language);

    switch (this.props.trailName) {
      case 'gr10':
      default:
        switch (LanguageHelper.getLanguage(this.props.language)) {
          case 'fr':
            title = 'GR10 Carte';
            metaDescription =
              'Carte du GR10 (Les Pyrénées) avec des hôtels, des gîtes et des campings';
            locale = 'fr_FR';
            localeAlternate = 'en_GB';
            break;
          case 'en':
          default:
            title = 'GR10 Map';
            metaDescription =
              'GR10 trail map (The pyrenees) with hotels, gites and camping locations.';
            locale = 'en_GB';
            localeAlternate = 'fr_FR';
        }
        break;
      case 'gr20':
        switch (LanguageHelper.getLanguage(this.props.language)) {
          case 'fr':
            title = 'GR20 Carte';
            metaDescription = 'Carte du GR20';
            break;
          case 'en':
          default:
            title = 'GR20 Map';
            metaDescription = 'GR20 map Corsica';
        }
        break;
    }

    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: language }}>
          <title>{title}</title>
          <meta name="description" content={metaDescription} />
          <link
            rel="alternative"
            href={
              'https://www.gr-trail-tracker.com/en/' +
              this.props.trailName +
              '/map'
            }
            hreflang="en"
          />
          <link
            rel="alternative"
            href={
              'https://www.gr-trail-tracker.com/fr/' +
              this.props.trailName +
              '/map'
            }
            hreflang="fr"
          />
          <link
            rel="alternative"
            href={
              'https://www.gr-trail-tracker.com/en/' +
              this.props.trailName +
              '/map'
            }
            hreflang="x-default"
          />

          <meta property="og:title" content={title} />
          <meta property="og:description" content={metaDescription} />
          <meta property="og:locale" content={locale} />
          <meta property="og:locale:alternate" content={localeAlternate} />
          <meta
            property="og:url"
            content={
              'https://www.gr-trail-tracker.com' + window.location.pathname
            }
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
          {this.content(this.props)}

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
        <footer className="App-content">Last updated 15/05/2018</footer>
      </React.Fragment>
    );
  }
}
export default TrailMap;
