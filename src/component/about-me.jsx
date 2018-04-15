import React, { Component } from 'react';

class AboutMeSection extends Component {
  render() {
    if (this.props.language == 'fr') {
      return (
        <React.Fragment>
          <h2>À propos me</h2>
          <p>
            Je serai à pied le GR10 à partir du 11 juin 2018, où je prendrai des
            notes sur des points que j'ai manqués. Les points que j'ai ajoutés
            jusqu'à présent ont été déterminés par l'imagerie satellite sur
            google maps.
          </p>
          <p>
            Si vous voulez suivre mes progrès, suivez le lien vers mon site.
            (S'il vous plaît soyez patient pendant le chargement car il
            fonctionne sur un serveur web gratuit et prend quelques secondes
            pour se réveiller)
          </p>
          <ul>
            <li>
              <a href="https://hiking-al.herokuapp.com/">Hiking Al</a>
            </li>
            <li>
              Suirve <a href="https://www.instagram.com/alpolden/">Instagram</a>
            </li>
          </ul>
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        <h2>About me</h2>
        <p>
          I will be hiking the GR10 from the 11th of June 2018, where I will be
          making notes of points that I have missed. The points that I have
          added so far have been determined by satellite imagery on google maps.
        </p>
        <p>
          If you want to follow my progress then follow the link to my site.
          (Please be patient while it loads because its running on a free web
          server and takes a few seconds to wake-up)
        </p>
        <ul>
          <li>
            <a href="https://hiking-al.herokuapp.com/">Hiking Al</a>
          </li>
          <li>
            Follow me on{' '}
            <a href="https://www.instagram.com/alpolden/">Instagram</a>
          </li>
        </ul>
      </React.Fragment>
    );
  }
}

export default AboutMeSection;
