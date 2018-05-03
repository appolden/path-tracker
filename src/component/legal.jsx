import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Menu from '../component/menu.jsx';
import LanguageHelper from '../component/language-helper.js';

class Legal extends Component {
  constructor(props) {
    super(props);
    this.state = { language: LanguageHelper.getLanguage(this.props.language) };
    this.onLanguageChange = this.onLanguageChange.bind(this);
  }

  onLanguageChange(newLanguage) {
    this.setState({ language: newLanguage });
  }

  render() {
    const pageTitle =
      this.state.language === 'en' ? 'Legal Notice' : 'Mention légale';
    const title =
      this.state.language === 'en' ? 'Legal Notice' : 'Mention légale';

    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: this.state.language }}>
          <title>{pageTitle}</title>
        </Helmet>

        <header className="App-header">
          <Menu
            language={this.state.language}
            origin="/legal"
            onLanguageChange={this.onLanguageChange}
          />
          <h1 className="App-title">{title}</h1>
        </header>
        <div className="App-content">
          {this.state.language === 'en' && (
            <React.Fragment>
              <p>
                This application and its supporting data are distributed in the
                hope that they will be useful, but are conveyed WITHOUT ANY
                WARRANTY and without implied warranty of FITNESS FOR A
                PARTICULAR PURPOSE.
              </p>
              <p>Do not rely on this application for navigation.</p>
              <p>
                The <strong>GR&reg;</strong> and <strong>GRP&reg;</strong>{' '}
                acronyms are registered trademarks of the French Hiking
                Federation. They may not be reproduced without their consent.
              </p>
            </React.Fragment>
          )}

          {this.state.language === 'fr' && (
            <React.Fragment>
              <p>
                Cette application et ses données de support sont distribuées
                dans l'espoir qu'elles seront utiles, mais sont transmises SANS
                AUCUNE GARANTIE et sans garantie implicite d'ADÉQUATION À UN
                USAGE PARTICULIER.
              </p>
              <p>Ne comptez pas sur cette application pour la navigation.</p>
              <p>
                Les sigles <strong>GR&reg;</strong> et <strong>GRP&reg;</strong>sont
                des marques déposées par la Fédération Française de la Randonnée
                Pédestre. Elles ne peuvent être reproduites sans son
                consentement.
              </p>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default Legal;
