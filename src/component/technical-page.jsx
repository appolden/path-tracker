import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import Menu from '../component/menu.jsx';
import LanguageHelper from '../component/language-helper.js';
import CacheViewer from '../component/cache-viewer.jsx';

class TechnicalPage extends Component {
  constructor(props) {
    super(props);

    this.state = { language: LanguageHelper.getLanguage(this.props.language) };
    this.onLanguageChange = this.onLanguageChange.bind(this);
  }

  onLanguageChange(newLanguage) {
    this.setState({ language: newLanguage });
  }

  render() {
    const pageTitle = 'Technical Information';
    const title = 'Technical';

    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: this.state.language }}>
          <title>{pageTitle}</title>
        </Helmet>

        <header className="App-header">
          <Menu
            language={this.state.language}
            origin="/technical"
            onLanguageChange={this.onLanguageChange}
          />
          <h1 className="App-title">{title}</h1>
        </header>
        <div className="App-content">
          <h2>Progressive web apps (PWA)</h2>
          <p>
            <a href="https://developers.google.com/web/progressive-web-apps/">
              Progressive Web Apps
            </a>
          </p>
          <h3>IPhone limitations</h3>
          <p>I will write something about the Iphone limitations here.</p>
          <h2>ReactJs</h2>
          <p>Built using ReactJs.</p>

          <h2>Cache viewer</h2>
          <p>
            {this.state.serviceWorkerEnabled}
            This is one of the first apps/websites I have created that utilises
            HTML5 caching. This page provides information about what is cached
            and the option to remove the cached data so that a fresh copy is
            retrieved from the server.
          </p>
          <CacheViewer />
        </div>
      </React.Fragment>
    );
  }
}

export default TechnicalPage;
