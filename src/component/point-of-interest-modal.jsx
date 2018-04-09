import React, { Component } from 'react';

class PointOfInterestModal extends Component {
  constructor(props) {
    super(props);

    this.onCloseButtonClick = this.onCloseButtonClick.bind(this);
  }

  onCloseButtonClick() {
    if (this.props.onClose !== undefined) {
      this.props.onClose();
    }
  }

  render() {
    let accommodationList = <React.Fragment />;

    if (this.props.pointOfInterest.accommodations !== undefined) {
      const accommodation = this.props.pointOfInterest.accommodations.map(
        accommodation => {
          return <li key={accommodation}>{accommodation}</li>;
        }
      );

      accommodationList = <ul>{accommodation}</ul>;
    }

    let content = (
      <p>
        {this.props.pointOfInterest.name}
        {accommodationList}
      </p>
    );

    if (this.props.pointOfInterest.description !== undefined) {
      content = (
        <p>
          {this.props.pointOfInterest.description.en}
          {accommodationList}
        </p>
      );
    }

    return (
      <React.Fragment>
        {this.props.visible && (
          <div className="w3-modal">
            <div className="w3-modal-content">
              <header className="w3-container w3-teal">
                <h2>{this.props.pointOfInterest.name}</h2>
                <div
                  className="modal-close-button"
                  onClick={this.onCloseButtonClick}
                >
                  <div />
                  <div />
                </div>
              </header>

              <div className="w3-container">{content}</div>
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default PointOfInterestModal;
