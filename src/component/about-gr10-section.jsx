import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
          the Pyrenees from West to East. The trail covers a distances of 866
          kilometres (538 mi), with 48,000 metres (157,000 ft) of ascent. More
          information about the trail can be found on wikipedia{' '}
          <a href="https://en.wikipedia.org/wiki/GR_10_(France)" title="GR10">
            GR 10 (France)
          </a>
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
              le sentier peuvent être trouvées sur wikipedi
              <a
                href="https://fr.wikipedia.org/wiki/Sentier_de_grande_randonn%C3%A9e_10"
                title="Sentier de grande randonnée 10"
              >
                Sentier de grande randonnée 10
              </a>
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
