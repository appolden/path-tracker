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
    let traitrackerLinkText = 'GR10 Trail Tracker';
    let text = (
      <React.Fragment>
        <p>
          The aim of the website is to help hikers on the GR10 determine where
          they are on the path. When the current position has been located the
          distances to point of interests (mountain passes, summits, towns,
          water, bridges etc.) can then be calculated.
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
        traitrackerLinkText = 'Traqueur de sentier GR10';
        text = (
          <React.Fragment>
            <p>
              Le but du site est d'aider les randonneurs sur le GR10 à
              déterminer où ils se trouvent sur le chemin. Lorsque la position
              actuelle a été localisée, les distances au point d'intérêt (cols
              de montagne, sommets, villes, eaux, ponts, etc.) peuvent alors
              être calculées.
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

        <p>
          <Link
            to={'/' + language + '/' + this.trailName + '/trail-tracker'}
            title={traitrackerLinkText}
          >
            {traitrackerLinkText}
          </Link>
        </p>

        <p>
          <Link
            to={'/' + language + '/' + this.trailName + '/map'}
            title="GR10 Map"
          >
            GR10 Map
          </Link>
        </p>
      </React.Fragment>
    );
  }
}

export default AboutIntroductionParagraph;
