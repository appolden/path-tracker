import React, { Component } from 'react';
import LanguageHelper from '../component/language-helper.js';
import Screenshot1 from '../images/screenshots/screenshot-1.png';
import Screenshot2 from '../images/screenshots/screenshot-2.png';
import Screenshot3 from '../images/screenshots/screenshot-3.png';
import Screenshot4 from '../images/screenshots/screenshot-4.png';

class SlideshowGallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slideIndex: 0,
      slidesLength: 4
    };
    this.onPrevClick = this.onPrevClick.bind(this);
    this.onNextClick = this.onNextClick.bind(this);
    this.onSlideDotClick = this.onSlideDotClick.bind(this);
  }

  onPrevClick() {
    this.showSlide(this.state.slideIndex - 1);
  }

  onNextClick() {
    this.showSlide(this.state.slideIndex + 1);
  }

  showSlide(index) {
    if (index >= this.state.slidesLength) {
      this.setState({ slideIndex: 0 });
      return;
    }

    if (index < 0) {
      this.setState(prevState => ({
        slideIndex: prevState.slidesLength - 1
      }));
      return;
    }

    this.setState({ slideIndex: index });
  }

  onSlideDotClick(event) {
    const slideIndex = parseInt(event.target.attributes['value'].value);

    this.showSlide(slideIndex);
  }

  slideShowImage(index, src, isActive) {
    const style = { display: isActive ? 'block' : 'none' };
    const imageStyle = { width: '256px' };
    return (
      <div className="mySlides fade" style={style}>
        <img src={src} style={imageStyle} alt="screenshot" />
      </div>
    );
  }

  slideShowDot(index, isActive) {
    const className = isActive ? 'dot active' : 'dot';
    return (
      <span
        className={className}
        value={index}
        onClick={this.onSlideDotClick}
      />
    );
  }

  render() {
    return (
      <div className="slideShowContainer">
        {this.slideShowImage(0, Screenshot1, this.state.slideIndex === 0)}
        {this.slideShowImage(1, Screenshot2, this.state.slideIndex === 1)}
        {this.slideShowImage(0, Screenshot1, this.state.slideIndex === 2)}
        {this.slideShowImage(1, Screenshot2, this.state.slideIndex === 3)}

        <a className="prev" onClick={this.onPrevClick}>
          &#10094; prev
        </a>
        <a className="next" onClick={this.onNextClick}>
          &#10095; next
        </a>

        <div className="caption-container">
          <p id="caption" />
        </div>

        <div style={{ textAlign: 'center' }}>
          {this.slideShowDot(0, this.state.slideIndex === 0)}
          {this.slideShowDot(1, this.state.slideIndex === 1)}
          {this.slideShowDot(0, this.state.slideIndex === 2)}
          {this.slideShowDot(1, this.state.slideIndex === 3)}
        </div>
      </div>
    );
  }
}

export default SlideshowGallery;
