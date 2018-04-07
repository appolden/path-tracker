import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AboutContributeSection from '../component/about-contribute-section';
import Menu from '../component/menu.jsx';

class Contribute extends Component {
  constructor(props) {
    super(props);

    this.title = 'Donate';
    switch (this.getLanguage()) {
      case 'fr':
        this.title = 'Faire un don';
        break;
      case 'en':
      default:
        this.language = 'en';
    }
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
    const traitrackerLinkText = 'Return to the GR10 Trail Tracker';
    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: this.getLanguage() }}>
          <title>{this.title}</title>
        </Helmet>
        <Menu language={this.getLanguage()} origin={this.props.origin} />
        <header className="App-header">
          <h1 className="App-title">{this.title}</h1>
        </header>

        <div className="App-content">
          <AboutContributeSection language={this.getLanguage()} />
          <p>
            {'<<'}{' '}
            <Link
              to={'/' + this.language + '/trail-tracker'}
              title={traitrackerLinkText}
            >
              {traitrackerLinkText}
            </Link>
          </p>
        </div>
      </React.Fragment>
    );
  }
}

export default Contribute;
