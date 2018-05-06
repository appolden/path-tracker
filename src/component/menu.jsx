import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import FrenchFlag from '../images/flags/france.svg';
import UkFlag from '../images/flags/united-kingdom.svg';
import LanguageHelper from '../component/language-helper.js';

class Menu extends Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.onCloseSideNavBarClick = this.onCloseSideNavBarClick.bind(this);
    this.onLanguageSelect = this.onLanguageSelect.bind(this);

    this.state = {
      menuActive: false,
      language: LanguageHelper.getLanguage(this.props.language)
    };

    this.sideNavItems = [
      {
        url: '/about',
        linkText: {
          en: 'About',
          fr: 'À propos'
        }
      },
      {
        url: '/gr10/trail-tracker',
        linkText: {
          en: 'Tracker',
          fr: 'Tracker'
        }
      },
      {
        url: '/gr10/map',
        linkText: {
          en: 'GR10 Map',
          fr: 'GR10 Carte'
        }
        },
        {
            url: '/gr10/accommodation-list',
            linkText: {
                en: 'Accommodation',
                fr: 'Hébergement'
            }
        },
      {
        url: '/donate',
        linkText: {
          en: 'Donate',
          fr: 'Faire un don'
        }
      },
      {
        url: '/legal',
        linkText: {
          en: 'Legal',
          fr: 'Legal'
        }
      },
      {
        url: '/technical',
        linkText: {
          en: 'Technical',
          fr: 'Technical'
        }
      }
    ];
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
      this.props.onLanguageChange(event.target.value);
    }
  }

  render() {
    const language = LanguageHelper.getLanguage(this.props.language);

    const className =
      'menuButtonContainer' +
      (this.state.menuActive ? ' menuButtonActive' : '');
    const sideNavClassName =
      'sidenav' + (this.state.menuActive ? ' sidenavActive' : '');

    const pathWithOutLanguageCode = this.props.origin;

    const sideNavLinks = this.sideNavItems.map(x => {
      if (language === 'fr') {
        return (
          <Link key={x.url} to={'/' + language + x.url}>
            {x.linkText.fr}
          </Link>
        );
      }
      return (
        <Link key={x.url} to={'/' + language + x.url}>
          {x.linkText.en}
        </Link>
      );
    });

    let languageSelection = undefined;

    if (this.props.useBrowserLinks) {
      languageSelection = (
        <React.Fragment>
          <a href={'/fr' + pathWithOutLanguageCode}>
            <input
              type="image"
              src={FrenchFlag}
              value="fr"
              className={this.state.language === 'fr' ? 'languageActive' : ''}
              alt="Définir la langue en français"
            />
          </a>
          <a href={'/en' + pathWithOutLanguageCode}>
            <input
              type="image"
              src={UkFlag}
              value="en"
              className={this.state.language === 'en' ? 'languageActive' : ''}
              alt="Set language to English"
            />
          </a>{' '}
        </React.Fragment>
      );
    } else {
      languageSelection = (
        <React.Fragment>
          <Link to={'/fr' + pathWithOutLanguageCode}>
            <input
              type="image"
              src={FrenchFlag}
              value="fr"
              onClick={this.onLanguageSelect}
              className={this.state.language === 'fr' ? 'languageActive' : ''}
              alt="Définir la langue en français"
            />
          </Link>
          <Link to={'/en' + pathWithOutLanguageCode}>
            <input
              type="image"
              src={UkFlag}
              value="en"
              onClick={this.onLanguageSelect}
              className={this.state.language === 'en' ? 'languageActive' : ''}
              alt="Set language to English"
            />
          </Link>{' '}
        </React.Fragment>
      );
    }

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
          <div className="languageSelectContainer">{languageSelection}</div>
          {sideNavLinks}
        </div>
      </React.Fragment>
    );
  }
}

export default Menu;
