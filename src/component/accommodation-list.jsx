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
          (x.accommodations || x.accommodationSearchUrl) &&
          (x.hotel || x.gite) &&
          x.accommodationDescription
      )
      .sort(function compare(a, b) {
        if (a.nearestMetreOfPath < b.nearestMetreOfPath) return -1;
        if (a.nearestMetreOfPath > b.nearestMetreOfPath) return 1;
        return 0;
      });

    this.setState({ pointsOfInterest: pointsOfInterest });
  }

  accommodationList(accommodations) {
    if ((accommodations || []).length > 0) {
      const accommodationList = accommodations.map(accommodation => {
        const tel = accommodation.tel || '';
        const telLink =
          tel.length > 0 ? (
            <React.Fragment>
              {' - '}{' '}
              <a href={'tel:' + tel} rel="nofollow">
                {tel}
              </a>{' '}
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
              rel="noopener noreferrer nofollow"
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

    let searchText = `Search for accommodation in ${pointOfInterest.name}`;
    switch (LanguageHelper.getLanguage(this.props.language)) {
      case 'fr':
        searchText = `Rechercher un logement à ${pointOfInterest.name}`;
        break;
      case 'en':
      default:
    }

    return (
      <p>
        <a
          href={pointOfInterest.accommodationSearchUrl}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
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
            {LanguageHelper.getLanguage(this.props.language) === 'en' &&
            x.accommodationDescription &&
            x.accommodationDescription.en
              ? x.accommodationDescription.en
              : ''}
            {LanguageHelper.getLanguage(this.props.language) === 'fr' &&
            x.accommodationDescription &&
            x.accommodationDescription.fr
              ? x.accommodationDescription.fr
              : ''}
          </p>
          {this.accommodationList(x.accommodations)}
          {this.accommodationSearch(x)}
        </React.Fragment>
      );
    });

    let pageTitle = 'GR10 accommodation and town guide';
    let title = 'Accommodation & town guide';
    let shortTitle = 'Town guide';
    let metaDescription =
      'A town guide for the stages of the GR10 trail. Including details of accommodation, supermarkets and public transport.';

    switch (LanguageHelper.getLanguage(this.props.language)) {
      case 'fr':
        pageTitle = 'GR10 Guide de la ville';
        title = 'Guide de la ville';
        shortTitle = 'Guide de la ville';
        metaDescription =
          "Un guide de la ville pour les étapes du sentier du GR10. Y compris les détails de l'hébergement, les supermarchés et les transports publics.";
        break;
      case 'en':
      default:
    }

    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: this.props.language }}>
          <title>{pageTitle}</title>
          <meta name="description" content={metaDescription} />
          <link
            rel="alternative"
            href="https://www.gr-trail-tracker.com/en/gr10/town-guide"
            hreflang="en"
          />
          <link
            rel="alternative"
            href="https://www.gr-trail-tracker.com/fr/gr10/town-guide"
            hreflang="fr"
          />
          <link
            rel="alternative"
            href="https://www.gr-trail-tracker.com/en/gr10/town-guide"
            hreflang="x-default"
          />
        </Helmet>

        <header className="App-header">
          <Menu
            language={this.props.language}
            origin={this.props.origin}
            onLanguageChange={this.onLanguageChange}
          />
          <h1 className="App-title">{shortTitle}</h1>
        </header>
        <div className="App-content">
          <h2>{title}</h2>
          {LanguageHelper.getLanguage(this.props.language) === 'fr' ? (
            <React.Fragment>
              <p>
                Un guide de la ville pour les étapes du sentier du GR10. Y
                compris les détails de l'hébergement, les supermarchés et les
                transports publics.
              </p>
              <p>
                Les villes sont énumérées dans une direction d'ouest en est.
              </p>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <p>
                A town guide for the GR10 trail. The guide includes details of
                accommodation (hotels, bed & breakfast, gites), supermarkets and
                public transport.
              </p>

              <p>
                The information in this guide has been collated from guide
                books, internet research and google maps. I will be walking the
                GR10 in the June - August 2018. On completion and my return to
                real life, I will update this guide with my personal
                experiences.
              </p>
              <p>
                Disclaimer: contained in this guide there are affilated links to
                booking.com, but you are in no way obligated to use these links.
              </p>
              <p>The towns are listed in a west to east direction.</p>
            </React.Fragment>
          )}
          {rows}
        </div>
        <footer className="App-content">Last updated 15/05/2018</footer>
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
