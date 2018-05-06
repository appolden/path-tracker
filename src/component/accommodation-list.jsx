import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Menu from '../component/menu.jsx';
import LanguageHelper from '../component/language-helper.js';
import PropTypes from 'prop-types';

class AccommodationList extends Component {
  constructor(props) {
    super(props);

      this.state = {
          language: LanguageHelper.getLanguage(this.props.language),
          pointsOfInterest: []
      };
  }

  componentDidMount() {
    this.loadPointsOfInterest();
    }

  loadPointsOfInterest() {
    const url = '/data/gr10-points-of-interest.json';

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
                  if (
                    JSON.stringify(this.state.pointsOfInterest) !==
                    JSON.stringify(data)
                  ) {
                    cache.put(url, cloned);
                    this.pointsOfInterestLoaded(data);
                  }
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
    const pointsOfInterest = data
      .filter(
        x =>
          (x.accommodations || x.accommodationSearchUrl) && (x.hotel || x.gite)
      )
      .sort(function compare(a, b) {
        if (a.nearestMetreOfPath < b.nearestMetreOfPath) return -1;
        if (a.nearestMetreOfPath > b.nearestMetreOfPath) return 1;
        return 0;
      });

    this.setState({ pointsOfInterest: pointsOfInterest });
  }

  accommodationList(accommodations) {
    console.log(accommodations);
    if ((accommodations || []).length > 0) {
      const accommodationList = accommodations.map(accommodation => {
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
            <a
              href={accommodation.url}
              title={accommodation.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              {accommodation.name}
            </a>
          ) : (
            accommodation.name
          );

        return (
          <li key={accommodation.name}>
            {item}
            {telLink}
          </li>
        );
      });

      return <ul style={{ paddingLeft: '20px' }}>{accommodationList}</ul>;
    }
  }

  accommodationSearch(pointOfInterest) {
    if (pointOfInterest.accommodationSearchUrl === undefined) {
      return;
      }

      let searchText = 'Search for accommodation';
      switch (LanguageHelper.getLanguage(this.props.language)) {
          case 'fr':
              searchText = 'Rechercher un logement';
          case 'en':
          default:
      }

    return (
      <p>
        <a href={pointOfInterest.accommodationSearchUrl} target="_blank">
                {searchText}
        </a>
      </p>
    );
  }

  render() {
    const rows = this.state.pointsOfInterest.map(x => {
      return (
        <React.Fragment key={x.name}>
          <h3>{x.name}</h3>
          <p>
            Located at approximately {(x.nearestMetreOfPath * 0.001).toFixed(2)}{' '}
            Km of the GR10
          </p>
          <p>
            {x.accommodationDescription && x.accommodationDescription.en
              ? x.accommodationDescription.en
              : ''}
          </p>
          {this.accommodationList(x.accommodations)}
          {this.accommodationSearch(x)}
        </React.Fragment>
      );
    });

    let pageTitle = 'GR10 Accommodation List';
    let title = 'Accommodation';
    let metaDescription =
          'A list of accommodation options on the GR10 trail.';

      switch (LanguageHelper.getLanguage(this.props.language)) {
          case 'fr':
              pageTitle = 'GR10 Liste des hébergements';
              title = 'Hébergements';
              metaDescription = 'Une liste d\'options d\'hébergement sur le sentier GR10.';
              break;
          case 'en':
          default:
      }

    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: this.props.language }}>
          <title>{pageTitle}</title>
          <meta name="description" content={metaDescription} />
          <link rel="alternative" href="/en/gr10/accommodation-list" hreflang="en" />
          <link rel="alternative" href="/fr/gr10/accommodation-list" hreflang="fr" />
        </Helmet>

        <header className="App-header">
          <Menu
            language={this.props.language}
            origin={this.props.origin}
            onLanguageChange={this.onLanguageChange}
          />
          <h1 className="App-title">{title}</h1>
        </header>
        <div className="App-content">
          <h2>{title}</h2>
          <p>A list of accommodation options on the GR10.</p>
          {rows}
        </div>
      </React.Fragment>
    );
  }
}

AccommodationList.propTypes = {
  language: PropTypes.string,
  origin: PropTypes.string
};

AccommodationList.defaultProps = {
  language: 'en',
  origin: ''
};

export default AccommodationList;
