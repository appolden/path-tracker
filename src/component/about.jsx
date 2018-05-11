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

    this.state = { language: LanguageHelper.getLanguage(this.props.language) };
  }

  onLanguageChange(newLanguage) {
    this.setState({ language: newLanguage });
  }

  render() {
    let pageTitle = 'GR10 trail tracker - About';
    let title = 'About';
    let metaDescription =
      'A guide for hikers on the GR10 trail. The app will locate you relative to the trail and calculate the distances to the next landmarks. For example mountain passes, summits, towns, restaurants, hotels.';
    switch (LanguageHelper.getLanguage(this.props.language)) {
      case 'fr':
        pageTitle = 'GR10 trail tracker - À propos';
        title = 'À propos';
        metaDescription =
          "Un guide pour les randonneurs sur le sentier du GR10.L'application va vous localiser par rapport à la piste et calculer les distances aux points de repère suivants. Par exemple les cols de montagne, les sommets, les villes, les restaurants, les hôtels.";
        break;
      case 'en':
      default:
    }

    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: this.state.language }}>
          <title>{pageTitle}</title>
          <meta name="description" content={metaDescription} />

          <link
            rel="alternative"
            href="https://www.gr-trail-tracker.com/en/about"
            hreflang="en"
          />
          <link
            rel="alternative"
            href="https://www.gr-trail-tracker.com/fr/about"
            hreflang="fr"
          />
          <link
            rel="alternative"
            href="https://www.gr-trail-tracker.com"
            hreflang="x-default"
          />
        </Helmet>

        <header className="App-header">
          <Menu
            language={this.state.language}
            origin={this.props.origin}
            onLanguageChange={this.onLanguageChange}
          />
          <h1 className="App-title">{title}</h1>
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
