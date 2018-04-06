import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AboutIntroductionParagraph from '../component/about-introduction-section.jsx';
import AboutInstallationSection from '../component/about-installation-section.jsx';
import AboutGr10Section from '../component/about-gr10-section.jsx';
import AboutContributeSection from '../component/about-contribute-section.jsx';
import Menu from '../component/menu.jsx';

class About extends Component {
  constructor(props) {
    super(props);

    this.language = this.props.language || 'en';

    this.title = 'About';
    switch (this.language.toLowerCase()) {
      case 'fr':
        this.title = 'Informations';
        break;
      case 'en':
      default:
        this.language = 'en';
      //default to english
    }
  }

  render() {
    return (
      <React.Fragment>
        <Helmet htmlAttributes={{ lang: this.language }}>
          <title>{this.title}</title>
        </Helmet>
        <Menu language={this.props.language} />
        <header className="App-header">
          <h1 className="App-title">{this.title}</h1>
        </header>
        <div className="App-content">
          <AboutIntroductionParagraph language={this.language} />
          <AboutInstallationSection language={this.language} />

          <AboutGr10Section language={this.language} />
          <AboutContributeSection language={this.language} />
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
            wiht ReactJs and progressive web apps. The source code can be found
            on GitHub.{' '}
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
      </React.Fragment>
    );
  }
}

export default About;
