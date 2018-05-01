import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import LanguageHelper from '../component/language-helper.js';

class AboutIntroductionParagraph extends Component {
  constructor(props) {
    super(props);

    this.trailName = this.props.trailName || 'gr10';
  }

  render() {
    const language = LanguageHelper.getLanguage(this.props.language);
    let title = 'Introduction';
    let trailTrackerLinkText = 'Click here to access the GR10 Trail Tracker';
    let text = (
      <React.Fragment>
        <p>
          The aim of the app/website is to help hikers on the GR10 determine
          where they are on the path. The phone's GPS is used to determine your
          location and calculates distances to landmarks (mountain passes,
          summits, towns, gîtes, hotels, campgrounds etc.) along the GR10. If
          you are using an up to date phone the app/website will work offline in
          areas without a data connection.
        </p>
        <p>Key features </p>
        <ul>
          <li>Works offline, when a data connection is unavailable</li>
          <li>Calculates distances to all points</li>
          <li>
            Calculates cumulative elevation gains and losses to all points
          </li>
          <li>Hotels/Gites with phone numbers </li>
          <li>Links to hotel websites (requires a data connection)</li>
        </ul>
        <p>
          <Link
            to={'/' + language + '/' + this.trailName + '/trail-tracker'}
            title={trailTrackerLinkText}
          >
            {trailTrackerLinkText}
          </Link>
        </p>
        <p>
          The inspiration for the app/website came from the Halfmile app I used
          when I hiked the Pacific Crest Trail.{' '}
          <a href="https://www.pctmap.net/" title="Halfmile PCT maps">
            Halfmile's PCT Maps
          </a>
        </p>
      </React.Fragment>
    );

    switch (language) {
      case 'fr':
        title = 'Introduction';
        trailTrackerLinkText = 'Cliquez ici pour accéder au GR10 Trail Tracker';
        text = (
          <React.Fragment>
            <p>
              Le but de l'application / site web est d'aider les randonneurs sur
              le GR10 à déterminer où ils se trouvent sur le chemin. Le GPS du
              téléphone est utilisé pour déterminer votre position et calcule
              les distances aux points de repère (cols, sommets, villes, gîtes,
              hôtels, terrains de camping, etc.) le long du GR10. Si vous
              utilisez un téléphone à jour, l'application / site Web
              fonctionnera hors connexion dans les zones sans connexion de
              données.
            </p>
            <p> Principales caractéristiques</p>
            <ul>
              <li>
                Fonctionne hors connexion, lorsqu'une connexion de données est
                indisponible
              </li>
              <li>Calcule les distances à tous les points</li>
              <li>
                Calcule les gains et les pertes d'altitude cumulés pour tous les
                points
              </li>
              <li>Hôtels / Gîtes avec numéros de téléphone</li>
              <li>
                Liens vers des sites Web d'hôtels (nécessite une connexion de
                données)
              </li>
            </ul>
            <p>
              <Link
                to={'/' + language + '/' + this.trailName + '/trail-tracker'}
                title={trailTrackerLinkText}
              >
                {trailTrackerLinkText}
              </Link>
            </p>
            <p>
              L'inspiration pour l'application / site provient de l'application
              Halfmile que j'ai utilisé quand j'ai fait une randonnée sur le
              Pacific Crest Trail.{' '}
              <a href="https://www.pctmap.net/" title="Halfmile PCT maps">
                Halfmile's PCT Maps
              </a>
            </p>
          </React.Fragment>
        );
        break;
      case 'en':
      default:
    }

    return (
      <React.Fragment>
        <h2>{title}</h2>
        {text}
      </React.Fragment>
    );
  }
}

export default AboutIntroductionParagraph;
