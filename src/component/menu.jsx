import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FrenchFlag from '../images/flags/france.svg';
import UkFlag from '../images/flags/united-kingdom.svg';

class Menu extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onCloseSideNavBarClick = this.onCloseSideNavBarClick.bind(this);
    this.onLanguageSelect = this.onLanguageSelect.bind(this);

    this.language = this.props.language || 'en';
    this.language = this.language.toLowerCase();
    switch (this.language) {
      case 'fr':
        break;
      case 'en':
      default:
        this.language = 'en';
      //default to english
    }

    this.state = {
      menuActive: false,
      language: this.language
    };
  }

  onClick() {
    this.setState(prevState => ({
      menuActive: !prevState.menuActive
    }));
  }

  onCloseSideNavBarClick() {
    this.setState(prevState => ({
      menuActive: !prevState.menuActive
    }));
  }

  onLanguageSelect(event) {
    this.setState({ language: event.target.value });
    if (this.props.onLanguageChange !== undefined) {
      this.props.onLanguageChange(this.state.language);
    }
  }

  render() {
    //onclick="myFunction(this)"
    const className =
      'menuButtonContainer' +
      (this.state.menuActive ? ' menuButtonActive' : '');
    const sideNavClassName =
      'sidenav' + (this.state.menuActive ? ' sidenavActive' : '');
    return (
      <React.Fragment>
        <div className={className} onClick={this.onClick}>
          <div />
          <div />
          <div />
        </div>
        <div className={sideNavClassName}>
          <a className="closebtn" onClick={this.onCloseSideNavBarClick}>
            &times;
          </a>
          <div className="languageSelectContainer">
            <input
              type="image"
              src={FrenchFlag}
              value="fr"
              onClick={this.onLanguageSelect}
              className={this.state.language === 'fr' ? 'languageActive' : ''}
              alt="D�finir la langue en fran�ais"
            />
            <input
              type="image"
              src={UkFlag}
              value="en"
              onClick={this.onLanguageSelect}
              className={this.state.language === 'en' ? 'languageActive' : ''}
              alt="Set language to English"
            />
          </div>
          <Link to={'/' + this.language + '/about'}>About</Link>
          <Link to={'/' + this.language + '/gr10/trail-tracker'}>Tracker</Link>
          <Link to={'/' + this.language + '/gr10/map'}>GR10 Map</Link>
          <Link to={'/' + this.language + '/donate'}>Donate</Link>
        </div>
      </React.Fragment>
    );
  }
}

export default Menu;
