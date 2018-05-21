import React, { Component } from 'react';
import CacheItem from '../component/cache-item.jsx';

class CacheViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      serviceWorkerEnabled: false,
      cacheItems: []
    };

    this.cacheKey = 'data';
    this.onDeleteCacheItem = this.onDeleteCacheItem.bind(this);
  }
  componentDidMount() {
    this.loadCache(this.cacheKey);
  }

  loadCache(cacheKey) {
    const cacheItems = [];

    if ('caches' in window) {
      this.setState({ serviceWorkerEnabled: true });
      caches
        .open(cacheKey)
        .then(cache => cache.keys())
        .then(keys => {
          keys.forEach(key => cacheItems.push(key));

          this.setState({
            serviceWorkerEnabled: true,
            cacheItems: cacheItems
          });
        });
    } else {
      this.setState({ serviceWorkerEnabled: false });
    }
  }

  onDeleteCacheItem(request) {
    console.log(request);
    if ('caches' in window) {
      caches.open(this.cacheKey).then(cache => {
        cache.delete(request);
        this.loadCache(this.cacheKey);
      });
    }
  }

  render() {
    const rows = this.state.cacheItems.map(x => (
      <CacheItem key={x.url} request={x} onDelete={this.onDeleteCacheItem} />
    ));

    return (
      <div>
        <p>
          Is service working available ={' '}
          {this.state.serviceWorkerEnabled.toString()}.
        </p>
        {rows}
      </div>
    );
  }
}

export default CacheViewer;
