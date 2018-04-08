import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import AboutContributeSection from '../component/about-contribute-section';
import Menu from '../component/menu.jsx';
import LanguageHelper from '../component/language-helper.js';

class Contribute extends Component {
  constructor(props) {
    super(props);

    this.title = 'Donate';
    switch (LanguageHelper.getLanguage(this.props.language)) {
      case 'fr':
        this.title = 'Faire un don';
        break;
      default:
        break;
    }
  }

  render() {
    const language = LanguageHelper.getLanguage(this.props.language);

    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: language }}>
          <title>{this.title}</title>
        </Helmet>

        <header className="App-header">
          <Menu language={language} origin={this.props.origin} />
          <h1 className="App-title">{this.title}</h1>
        </header>

        <div className="App-content">
          <AboutContributeSection language={language} />
        </div>
      </React.Fragment>
    );
  }
}

export default Contribute;
