import React, { Component } from 'react';
import PointOfInterestRow from '../component/point-of-interest-row.jsx';
import { List, AutoSizer, WindowScroller } from 'react-virtualized';

class PointOfInterestList extends Component {
  constructor(props) {
    super(props);
    this._getRowHeight = this._getRowHeight.bind(this);
    this._rowRenderer = this._rowRenderer.bind(this);
  }

  //     this._getRowHeight = this._getRowHeight.bind(this);
  //this._noRowsRenderer = this._noRowsRenderer.bind(this);
  //this._onRowCountChange = this._onRowCountChange.bind(this);
  //this._onScrollToRowChange = this._onScrollToRowChange.bind(this);

  render() {
    return (
      <div>
        {' '}
        this is the list
        <WindowScroller ref={this._setRef} scrollElement={window}>
          {({
            height,
            isScrolling,
            registerChild,
            onChildScroll,
            scrollTop
          }) => (
            <div>
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    ref="List"
                    height={500}
                    overscanRowCount={15}
                    noRowsRenderer={this._noRowsRenderer}
                    rowCount={this.props.pointsOfInterest.length}
                    rowHeight={this._getRowHeight}
                    rowRenderer={this._rowRenderer}
                    width={width}
                  />
                )}
              </AutoSizer>
            </div>
          )}
        </WindowScroller>
      </div>
    );
  }

  _getRowHeight({ index }) {
    if (this.props.pointsOfInterest === undefined) {
      return 0;
    }

    return 54;
  }

  _rowRenderer({ index, isScrolling, key, style }) {
    if (this.props.pointsOfInterest === undefined) {
      return <div>nothing </div>;
    }

    const pathMetre = 6;
    const pathElevation = 7;
    const pathCumulativeAscent = 234;
    const pathCumulativeDescent = 6227;

    const x = this.props.pointsOfInterest[index];
    const poiKey = `${x.nearestMetreOfPath}${x.currentLocation ? x.name : ''}`;

    return (
      <PointOfInterestRow
        language={this.language}
        key={poiKey}
        name={x.name}
        elevationAtNearestMetreOfPath={x.elevation}
        pathMetre={pathMetre}
        pathElevation={pathElevation}
        pathCumulativeAscent={pathCumulativeAscent}
        pathCumulativeDescent={pathCumulativeDescent}
        onClick={this.onPointOfInterestClick}
        pointOfInterest={x}
      />
    );
  }
}

export default PointOfInterestList;
