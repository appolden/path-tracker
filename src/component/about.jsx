import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class About extends Component {
  render() {
    //const offset = 110;
    //const style = { height: window.outerHeight - offset };

    return (
      <div className="App-content">
        <h1 style={{ textAlign: 'center' }}>About GR10 trail tracker</h1>
        <h2>Introduction</h2>
        <p>
          The aim of the website is to help hikers on the GR10 determine where
          they are on the path. When the current position has been located the
          distances to point of interests (mountain saddles, summits, towns,
          water, bridges etc.) can then be calculated.
        </p>
        <p>
          <Link to="/trail-tracker" title="GR10 Trail Tracker">
            GR10 Trail Tracker
          </Link>
        </p>

        <h2>Installation </h2>
        <p>
          You can use the{' '}
          <Link to="/trail-tracker" title="GR10 Trail Tracker">
            GR10 Trail Tracker
          </Link>{' '}
          as you would with any other website but I recommend that you add it to
          your homescreen which will enable it to work off-line.
        </p>
        <p>
          To install the website as an app for Android follow these
          instructions. For Touch the overflow button (three vertical dots) and
          select 'Add to Home Screen'.
        </p>
        <h2>The GR10 trail</h2>
        <p>
          The GR10 is a hiking trail in the South of France that traverses the
          the Pyrenees from West to East. The trail covers a distances of 866
          kilometres (538 mi), with 48,000 metres (157,000 ft) of ascent. More
          information about the trail can be found on wikipedia{' '}
          <a href="https://en.wikipedia.org/wiki/GR_10" title="GR10">
            GR10
          </a>
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
            www.gr-infos.com/
          </a>.
        </p>

        <h2>About me</h2>
        <p>
          When I overcome my shyness, I'll write something about myslef here.
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
      </div>
    );
  }
}

export default About;
