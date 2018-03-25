class MapHelper {
  static findNearestPointUsingGoogle(google, routePoints, latlng) {
    const needle = {
      minDistance: 9999999999,
      index: -1,
      latlng: null,
      distance: 0,
      routePoint: undefined
    };

    routePoints.forEach(function(routePoint, index) {
      var dist = google.maps.geometry.spherical.computeDistanceBetween(
        latlng,
        routePoint.googleLatLng
      );

      if (dist < needle.minDistance) {
        needle.minDistance = dist;
        needle.routePoint = routePoint;
      }
    });

    return needle.routePoint;
  }

  static findNearestPoint(routePoints, latlng) {
    const needle = {
      minDistance: 9999999999,
      index: -1,
      latlng: null,
      distance: 0,
      routePoint: undefined
    };

    routePoints.forEach(function(routePoint, index) {
      const pointB = { lat: routePoint.lat, lng: routePoint.lng };
      const dist = MapHelper.computeDistanceBetween(latlng, pointB);
      if (dist < needle.minDistance) {
        needle.minDistance = dist;
        needle.routePoint = routePoint;
      }
    });

    return needle.routePoint;
  }

  static addCumulativeDistance(google, pathPoints) {
    let pathDistance = 0;

    pathPoints.forEach(function(pathPoint, index) {
      pathPoint.distance = pathDistance;

      if (index > 0) {
        const previousPoint = pathPoints[index - 1];
        const distanceFromPreviousPoint = google.maps.geometry.spherical.computeDistanceBetween(
          previousPoint,
          pathPoint
        );

        pathPoint.distance = pathDistance + distanceFromPreviousPoint;
        pathDistance = pathDistance + distanceFromPreviousPoint;
      }
    });

    return pathPoints;
  }

  static addElevation(google, pathPoints, callBack) {
    const pointsPerRequest = 250;
    const elevator = new google.maps.ElevationService();
    const requests = [];

    const onRequestComplete = function(requestId, results) {
      console.log(`Request ${requestId} complete`);
      const request = requests.find(x => x.id == requestId);
      request.complete = true;
      request.results = results;

      if (requests.every(x => x.complete)) {
        let resultsFlattened = [];
        requests.forEach(x => {
          resultsFlattened = resultsFlattened.concat(x.results);
        });

        resultsFlattened.forEach(x => {
          const pathPointToUpdate = pathPoints.find(function(pathPoint) {
            return (
              pathPoint.lat().toFixed(6) == x.location.lat().toFixed(6) &&
              pathPoint.lng().toFixed(6) == x.location.lng().toFixed(6)
            );
          });

          if (pathPointToUpdate !== undefined) {
            pathPointToUpdate.elevation = parseInt(x.elevation.toFixed(0), 10);
            pathPointToUpdate.cumulativeAscent = 0;
            pathPointToUpdate.cumulativeDescent = 0;
          } else {
            console.log('route point not found');
          }
        });
        //  console.log(pathPoints);

        if (callBack !== undefined) {
          callBack(pathPoints);
        }
      }
    };

    for (var i = 0; i < pathPoints.length / pointsPerRequest; i++) {
      const slicedPoints = pathPoints.slice(
        i * pointsPerRequest,
        (i + 1) * pointsPerRequest
      );

      if (slicedPoints.length === 0) {
        break;
      }

      // Create a LocationElevationRequest object using the array's one value
      const elevationRequest = {
        locations: slicedPoints
      };

      requests.push({ id: i, complete: false });
      MapHelper.doSetTimeout(google, i, elevationRequest, onRequestComplete);
    }
  }
  static doSetTimeout(google, requestId, elevationRequest, onRequestComplete) {
    var millisecondsToWait = 3000;
    console.log(
      `setting timeout of ${millisecondsToWait *
        requestId} for request ${requestId}`
    );
    setTimeout(function() {
      MapHelper.getElevationsForLocations(
        google,
        requestId,
        elevationRequest,
        onRequestComplete
      );
    }, millisecondsToWait * requestId);
  }

  static getElevationsForLocations(
    google,
    requestId,
    elevationRequest,
    onRequestComplete
  ) {
    //console.log('start getElevationsForLocations');
    const elevator = new google.maps.ElevationService();
    elevator.getElevationForLocations(elevationRequest, function(
      results,
      status
    ) {
      if (status !== google.maps.ElevationStatus.OK) {
        console.log(status + ' for request');
        if (status == 'OVER_QUERY_LIMIT') {
        }
        return;
      }

      if (onRequestComplete !== undefined) {
        onRequestComplete(requestId, results);
      }
    });
  }

  static addCumulativeAscentAndDescent(pathPoints) {
    pathPoints.forEach(function(pathPoint, index) {
      if (index == 0) {
        pathPoint.cumulativeAscent = 0;
        pathPoint.cumulativeDescent = 0;
      } else {
        const previousPathPoint = pathPoints[index - 1];

        if (pathPoint.elevation === undefined) {
          pathPoint.elevation = previousPathPoint.elevation;
        }

        const differenceBetweenPreviousPoint =
          pathPoint.elevation - previousPathPoint.elevation;

        if (differenceBetweenPreviousPoint > 0) {
          //ascending
          pathPoint.cumulativeAscent =
            previousPathPoint.cumulativeAscent + differenceBetweenPreviousPoint;
          pathPoint.cumulativeDescent = previousPathPoint.cumulativeDescent;
        } else {
          //descending
          pathPoint.cumulativeAscent = previousPathPoint.cumulativeAscent;
          pathPoint.cumulativeDescent =
            previousPathPoint.cumulativeDescent +
            Math.abs(differenceBetweenPreviousPoint);
        }
      }
    });

    return pathPoints;
  }

  static computeDistanceBetween(pointA, pointB) {
    const lat1 = pointA.lat;
    const lat2 = pointB.lat;

    const lon1 = pointA.lng;
    const lon2 = pointB.lng;

    //https://www.movable-type.co.uk/scripts/latlong.html
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180; //to radians
    const φ2 = lat2 * Math.PI / 180; //to radians
    const Δφ = (lat2 - lat1) * Math.PI / 180; //to radians
    const Δλ = (lon2 - lon1) * Math.PI / 180; //to radians

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;

    return d;
  }
}

export default MapHelper;
