import React, { Component } from 'react';

class CacheItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serviceWorkerEnabled: false,
      cacheItems: []
    };

    this.cacheKey = 'data';
    this.onDeleteButtonClick = this.onDeleteButtonClick.bind(this);
  }

  onDeleteButtonClick(event) {
    if (this.props.onDelete !== undefined) {
      this.props.onDelete(this.props.request);
    }
  }

  render() {
    return (
      <div key={this.props.request.url} style={{ padding: '4px' }}>
        <input
          type="button"
          value="Delete"
          onClick={this.onDeleteButtonClick}
        />{' '}
        {this.props.request.url}
      </div>
    );
  }
}

export default CacheItem;
