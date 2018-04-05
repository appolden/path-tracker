import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AboutIntroductionParagraph extends Component {
  constructor(props) {
    super(props);

    this.language = this.props.language || 'en';
    this.trailName = this.props.trailName || 'gr10';
  }

  render() {
    let title = 'Introduction';
    let traitrackerLinkText = 'GR10 Trail Tracker';
    let text = (
      <React.Fragment>
        <p>
          The aim of the website is to help hikers on the GR10 determine where
          they are on the path. When the current position has been located the
          distances to point of interests (mountain saddles, summits, towns,
          water, bridges etc.) can then be calculated.
        </p>
        <p>
          The inspiration for the app/website came from the Halfmile app I used
          when I hiked the Pacific Crest Trail.{' '}
          <a href="https://www.pctmap.net/" title="Halfmile PCT maps">
            Halfmile's PCT Maps
          </a>
        </p>
        <p>
          I'm grateful to{' '}
          <a href="http://www.gr10.fr/" title="GR10">
            www.gr10.fr
          </a>{' '}
          for providing the information about camping sites. The gpx data that I
          used for the trail coordinates was donwloaded from{' '}
          <a href="http://www.gr-infos.com/" title="gpx source">
            www.gr-infos.com
          </a>. I have made admendments to the gpx to follow the variant options
          that are more appealing to me. I plan to add variants, to the list of
          points.
        </p>
      </React.Fragment>
    );

    switch (this.language.toLowerCase()) {
      case 'fr':
        title = 'Introduction';
        traitrackerLinkText = 'Traqueur de sentier GR10';
        text = (
          <React.Fragment>
            <p>
              Le but du site est d'aider les randonneurs sur le GR10 à
              déterminer où ils se trouvent sur le chemin. Lorsque la position
              actuelle a été localisée, les distances au point d'intérêt (selles
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
            <p>
              Je suis reconnaissant à{' '}
              <a href="http://www.gr10.fr/" title="GR10">
                www.gr10.fr
              </a>{' '}
              pour avoir fourni des informations sur les campings. Les données
              gpx que j'ai utilisées pour les coordonnées de la piste ont été
              téléchargées sur{' '}
              <a href="http://www.gr-infos.com/" title="gpx source">
                www.gr-infos.com
              </a>. J'ai fait des aveux à la gpx pour suivre les variantes qui
              me plaisent. Je prévois d'ajouter des variantes, à la liste des
              points.
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
            to={'/' + this.language + '/' + this.trailName + '/trail-tracker'}
            title={traitrackerLinkText}
          >
            {traitrackerLinkText}
          </Link>
        </p>

        <p>
          <Link
            to={'/' + this.language + '/' + this.trailName + '/map'}
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
