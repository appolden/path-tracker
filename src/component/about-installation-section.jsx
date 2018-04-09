import React, { Component } from 'react';
import LanguageHelper from '../component/language-helper.js';

class AboutInstallationSection extends Component {
  render() {
    let text = (
      <React.Fragment>
        <h2>Installation</h2>
        <p>
          To install the website as an app for Android follow these
          instructions. Touch the overflow button (three vertical dots) and
          select 'Add to Home Screen'.
        </p>
      </React.Fragment>
    );

    switch (LanguageHelper.getLanguage(this.props.language)) {
      case 'fr':
        text = (
          <React.Fragment>
            <h2>Installation</h2>
            <p>
              Pour installer le site Web en tant qu'application pour Android,
              suivez ces instructions. Touchez le bouton de débordement (trois
              points verticaux) et sélectionnez "Ajouter à l'écran d'accueil".
            </p>
          </React.Fragment>
        );
        break;
      case 'en':
      default:
    }

    return <React.Fragment>{text}</React.Fragment>;
  }
}

export default AboutInstallationSection;
