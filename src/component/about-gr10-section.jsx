import React, { Component } from 'react';

class AboutGr10Section extends Component {
  constructor(props) {
    super(props);

    this.language = this.props.language || 'en';
  }

  render() {
    let text = (
      <React.Fragment>
        <h2>The GR10 trail</h2>
        <p>
          The GR10 is a hiking trail in the South of France that traverses the
          the Pyrenees. The trail covers a distances of 866 kilometres (538 mi),
          with 48,000 metres (157,000 ft) of ascent. Traditional the trail is
          walked west to east, starting in Hendaye on the Atlantic coast. The
          trail ends at Banyuls-sur-Mer on the Mediterranean coast. More
          information about the trail can be found on wikipedia.{' '}
          <a
            href="https://en.wikipedia.org/wiki/GR_10_(France)"
            title="GR 10 on Wikipedia"
          >
            GR 10
          </a>
        </p>
        <p>
          I'm grateful to{' '}
          <a href="http://www.gr10.fr/" title="gr 10" alt="gr 10">
            www.gr10.fr
          </a>{' '}
          for providing the information about camping sites. The gpx data that I
          used for the trail coordinates was downloaded from{' '}
          <a href="http://www.gr-infos.com/" title="gpx source">
            www.gr-infos.com
          </a>. I have made admendments to the gpx to follow the variant options
          that are more appealing to me.
        </p>
      </React.Fragment>
    );

    switch (this.language.toLowerCase()) {
      case 'fr':
        text = (
          <React.Fragment>
            <h2>Le sentier de grande randonnée 10</h2>
            <p>
              Le sentier de grande randonnée 10 ou GR 10 est un sentier de
              grande randonnée français qui traverse la chaîne des Pyrénées,
              reliant la mer Méditerranée à l'océan Atlantique.
            </p>
            <p>
              Le sentier couvre une distance de 866 kilomètres (538 mi), avec 48
              000 mètres (157 000 pieds) d'ascension. Plus des informations sur
              le sentier peuvent être trouvées sur Wikipédia.{' '}
              <a
                href="https://fr.wikipedia.org/wiki/Sentier_de_grande_randonn%C3%A9e_10"
                title="Sentier de grande randonnée 10"
              >
                Sentier de grande randonnée 10
              </a>
            </p>
            <p>
              Je suis reconnaissant à{' '}
              <a href="http://www.gr10.fr/" title="gr 10" alt="gr 10">
                www.gr10.fr
              </a>{' '}
              pour avoir fourni des informations sur les campings. Les données
              gpx que j'ai utilisées pour les coordonnées du sentier ont été
              téléchargées sur
              <a href="http://www.gr-infos.com/" title="gpx source">
                www.gr-infos.com
              </a>. J'ai fait des aveux à la gpx pour suivre les variantes qui
              me plaisent.
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

export default AboutGr10Section;
