import React, { Component } from 'react';
import LanguageHelper from '../component/language-helper.js';

class AboutInstallationSection extends Component {
  render() {
    let text = (
      <React.Fragment>
        <h2>Installation</h2>
        <h3>Chrome Android</h3>
        <p>
          To install the website as an app for Android follow these
          instructions. Touch the overflow button (three vertical dots) and
          select 'Add to Home Screen'.
        </p>
        <h3>IPhone</h3>
        <p>
          The Safari browser installed on Iphones has limited support for
          offline usages and doesn't consistently work offline or when its been
          added to the homescreen. Refer to the technical section (via the menu)
          for an explanation. Bookmark the website and it should be accessible
          offline.
        </p>
      </React.Fragment>
    );

    switch (LanguageHelper.getLanguage(this.props.language)) {
      case 'fr':
        text = (
          <React.Fragment>
            <h2>Installation</h2>
            <h3>Chrome Android</h3>
            <p>
              Pour installer le site Web en tant qu'application pour Android,
              suivez ces instructions. Touchez le bouton de débordement (trois
              points verticaux) et sélectionnez "Ajouter à l'écran d'accueil".
            </p>
            <h3>IPhone</h3>
            <p>
              Bookmark le site Web et il devrait être accessible hors ligne.
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
