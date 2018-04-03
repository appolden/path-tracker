import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AboutIntroductionParagraph from '../component/about-introduction-section.jsx';
import AboutInstallationSection from '../component/about-installation-section.jsx';
import AboutGr10Section from '../component/about-gr10-section.jsx';

class About extends Component {
  constructor(props) {
    super(props);

    this.language = this.props.match.params.language || 'en';

    this.title = 'About GR10 trail tracker';
    switch (this.language.toLowerCase()) {
      case 'fr':
        this.title = 'Informations sur le tracker GR10';
        break;
      case 'en':
      default:
        this.language = 'en';
      //default to english
    }
  }

  render() {
    return (
      <div className="App-content">
        <Helmet htmlAttributes={{ lang: this.language }}>
          <title>{this.title}</title>
        </Helmet>

        <h1 style={{ textAlign: 'center' }}>{this.title}</h1>
        <AboutIntroductionParagraph language={this.language} />
        <AboutInstallationSection language={this.language} />

        <AboutGr10Section language={this.language} />

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

        <h2>About me</h2>
        <p>
          When I overcome my shyness, I'll write something about myself here.
          <a href="https://hiking-al.herokuapp.com/"> Hiking Al</a>.<br />
          Follow me on{' '}
          <a href="https://www.instagram.com/alpolden/">Instagram</a>
        </p>
        <h2>Technical information</h2>
        <p>
          One of the goals of this website was for me to become more familiar
          wiht ReactJs and progressive web apps. The source code can be found on
          GitHub.{' '}
          <a
            href="https://github.com/appolden/path-tracker"
            title="source code"
          >
            Source code
          </a>{' '}
        </p>
        <p>
          To refresh the cached data goto the{' '}
          <Link to="/cache-viewer" title="cache viewer">
            cache viewer
          </Link>
        </p>
        <p>
          For testing this is a walk to the pub.{' '}
          <Link to="/trail-tracker-chorlton" title="trail tracker chorlton">
            Home to Chorlton
          </Link>
        </p>
      </div>
    );
  }
}

export default About;
