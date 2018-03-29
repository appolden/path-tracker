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

    if ('serviceWorker' in navigator) {
      this.setState({ serviceWorkerEnabled: true });
      caches
        .open(cacheKey)
        .then(cache => cache.keys())
        .then(keys => {
          keys.forEach(key => cacheItems.push(key));
          //  console.log(keys);
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
    if ('serviceWorker' in navigator) {
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
      <React.Fragment>
        <h2>Cache viewer</h2>
        <p>
          {this.state.serviceWorkerEnabled}
          This is one of the first apps/websites I have created that utilises
          HTML5 caching. This page provides information about what is cached and
          the option to remove the cached data so that a fresh copy is retrieved
          from the server.
        </p>
        <p>
          For caching to work and the app/website to work offline a service
          worker needs to be available.
        </p>
        <p>
          Is service working available ={' '}
          {this.state.serviceWorkerEnabled.toString()}.
        </p>
        {rows}
      </React.Fragment>
    );
  }
}

export default CacheViewer;
