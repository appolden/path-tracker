import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AboutIntroductionParagraph from '../component/about-introduction-section.jsx';
import AboutInstallationSection from '../component/about-installation-section.jsx';
import AboutGr10Section from '../component/about-gr10-section.jsx';
import AboutContributeSection from '../component/about-contribute-section.jsx';
import Menu from '../component/menu.jsx';
import LanguageHelper from '../component/language-helper.js';

class About extends Component {
  constructor(props) {
    super(props);

    this.onLanguageChange = this.onLanguageChange.bind(this);

    this.pageTitle = 'GR10 trail tracker';
    this.title = 'About';
    switch (LanguageHelper.getLanguage(this.props.language)) {
      case 'fr':
        this.title = 'Informations';
        this.pageTitle = 'Le tracker de GR10';
        break;
      case 'en':
      default:
    }

    this.state = { language: LanguageHelper.getLanguage(this.props.language) };
  }

  onLanguageChange(newLanguage) {
    this.setState({ language: newLanguage });
  }

  render() {
    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: this.state.language }}>
          <title>{this.pageTitle}</title>
        </Helmet>

        <header className="App-header">
          <Menu
            language={this.state.language}
            origin={this.props.origin}
            onLanguageChange={this.onLanguageChange}
          />
          <h1 className="App-title">{this.title}</h1>
        </header>
        <div className="App-content">
          <AboutIntroductionParagraph language={this.state.language} />
          <AboutInstallationSection language={this.state.language} />

          <AboutGr10Section language={this.state.language} />
          <AboutContributeSection language={this.state.language} />
          <h2>About me</h2>
          <p>
            When I overcome my shyness, I'll write something about myself here.{' '}
            <a href="https://hiking-al.herokuapp.com/">Hiking Al</a>.<br />
            Follow me on{' '}
            <a href="https://www.instagram.com/alpolden/">Instagram</a>
          </p>
          <h2>Technical information</h2>
          <p>
            One of the goals of this website was for me to become more familiar
            wiht ReactJs and progressive web apps.
          </p>
          <p>
            To refresh the cached data goto the{' '}
            <Link to="/cache-viewer" title="cache viewer">
              cache viewer
            </Link>
          </p>
          <p>
            For testing this is a walk to the pub.{' '}
            <Link to="/trail-tracker-chorlton" title="trail tracker chorlton">
              Home to Chorlton
            </Link>
          </p>
        </div>
      </React.Fragment>
    );
  }
}

export default About;
