import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import AboutContributeSection from '../component/about-contribute-section';
import Menu from '../component/menu.jsx';
import LanguageHelper from '../component/language-helper.js';

class Contribute extends Component {

  render() {
      const language = LanguageHelper.getLanguage(this.props.language);
      let pageTitle = 'GR10 trail tracker donation page';
      let title = 'Donate';
      let metaDescription = 'If you like this app and please consider making a donation towards the running costs.';
      switch (LanguageHelper.getLanguage(this.props.language)) {
          case 'fr':
              pageTitle = 'GR10 trail tracker - La page de don';
              title = 'Faire un don';
              metaDescription = 'Si vous aimez cette application et s\'il vous plaît envisager de faire un don pour les frais de fonctionnement.';
              break;
          default:
              break;
      }

    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: language }}>
                <title>{pageTitle}</title>
                <meta name="description" content={metaDescription} />
                <link
                    rel="alternative"
                    href="https://www.gr-trail-tracker.com/en/donate"
                    hreflang="en"
                />
                <link
                    rel="alternative"
                    href="https://www.gr-trail-tracker.com/fr/donate"
                    hreflang="fr"
                />
                <link
                    rel="alternative"
                    href="https://www.gr-trail-tracker.com/en/donate"
                    hreflang="x-default"
                />
        </Helmet>

        <header className="App-header">
          <Menu language={language} origin={this.props.origin} />
          <h1 className="App-title">{title}</h1>
        </header>

        <div className="App-content">
          <AboutContributeSection language={language} />
        </div>
      </React.Fragment>
    );
  }
}

export default Contribute;
