import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import AboutIntroductionParagraph from '../component/about-introduction-section.jsx';
import AboutInstallationSection from '../component/about-installation-section.jsx';
import AboutMeSection from '../component/about-me.jsx';
import AboutGr10Section from '../component/about-gr10-section.jsx';
import AboutContributeSection from '../component/about-contribute-section.jsx';
import Menu from '../component/menu.jsx';
import LanguageHelper from '../component/language-helper.js';
import SlideshowGallery from '../component/slideshow-gallery';
import FacilityKey from '../component/facility-key.jsx';

class About extends Component {
  constructor(props) {
    super(props);

    this.onLanguageChange = this.onLanguageChange.bind(this);

    this.pageTitle = 'GR10 trail tracker - About';
    this.title = 'About';
    switch (LanguageHelper.getLanguage(this.props.language)) {
      case 'fr':
        this.title = 'À propos';
        this.pageTitle = 'GR10 trail tracker - À propos';
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
          <link rel="alternative" href="/en/about" hreflang="en" />
          <link rel="alternative" href="/fr/about" hreflang="fr" />
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
          <SlideshowGallery language={this.state.language} />
          <FacilityKey language={this.state.language} />
          <AboutInstallationSection language={this.state.language} />
          <AboutMeSection language={this.state.language} />
          <AboutGr10Section language={this.state.language} />
          <AboutContributeSection language={this.state.language} />
        </div>
      </React.Fragment>
    );
  }
}

export default About;
