import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AboutContributeSection from '../component/about-contribute-section';


class Contribute extends Component {
    render() {
        return (
            <div className="App-content">
                <AboutContributeSection language={this.props.language}/>
            </div>
        );
    }
}

export default Contribute;