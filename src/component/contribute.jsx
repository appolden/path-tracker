import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AboutContributeSection from '../component/about-contribute-section';

class Contribute extends Component {
  constructor(props) {
    super(props);

    this.language = this.props.language || 'en';
  }
  render() {
    const traitrackerLinkText = 'Return to the GR10 Trail Tracker';
    return (
      <div className="App-content">
            <AboutContributeSection language={this.props.language} />
            <p>
        {'<<'}{' '}
        <Link
          to={'/' + this.language + '/trail-tracker'}
          title={traitrackerLinkText}
        >
          {traitrackerLinkText}
                </Link>
                </p>
      </div>
    );
  }
}

export default Contribute;
