import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AboutContributeSection from '../component/about-contribute-section';
import Menu from '../component/menu.jsx';

class Contribute extends Component {
  constructor(props) {
    super(props);

    this.language = this.props.language || 'en';
    this.title = 'Donate';
    switch (this.language.toLowerCase()) {
      case 'fr':
        this.title = 'Faire un don';
        break;
      case 'en':
      default:
        this.language = 'en';
    }
  }
  render() {
    const traitrackerLinkText = 'Return to the GR10 Trail Tracker';
    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: this.language }}>
          <title>{this.title}</title>
        </Helmet>
        <Menu language={this.props.language} />
        <header className="App-header">
          <h1 className="App-title">{this.title}</h1>
        </header>

        <div className="App-content">
          <AboutContributeSection language={this.props.language} />
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
