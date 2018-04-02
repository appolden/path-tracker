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

  static findNearestPoint(pathPoints, latlng) {
    const nearest = {
      minDistance: 9999999999,
      index: -1,
      latLng: undefined,
      distance: 0,
      routePoint: undefined
    };

    pathPoints.forEach(function(pathPoint, index) {
      const pointB = { lat: pathPoint.lat, lng: pathPoint.lng };
      const dist = MapHelper.computeDistanceBetween(latlng, pointB);
      if (dist < nearest.minDistance) {
        nearest.minDistance = dist;
        nearest.routePoint = pathPoint;
        nearest.index = index;
        nearest.latLng = { lat: pathPoint.lat, lng: pathPoint.lng };
        nearest.elevation = pathPoint.elevation;
      }
    }
    );

      let metreOfPath = 0;
      let interpolatedPoints = [];

      if (nearest.index > 0) {
          //Not first point. Therefore, there is a previous point
          //Create points between closest known path point and previous point
          const previousPointInPath = pathPoints[nearest.index - 1];
          const previousPointInPathLatLng = {
              lat: previousPointInPath.lat,
              lng: previousPointInPath.lng
          };

          metreOfPath = previousPointInPath.metreOfPath;

          interpolatedPoints = interpolatedPoints.concat(
              this.interpolateBetweenPoints(previousPointInPathLatLng, nearest.latLng)
          );
      }

      if (nearest.index < pathPoints.length-1) {
          //not last point. Therefore, there is a next point
          //Create points between closest known path point and next point
          const nextPointInPath = pathPoints[nearest.index + 1];
          const nextPointInPathLatLng = {
              lat: nextPointInPath.lat,
              lng: nextPointInPath.lng
          };
          interpolatedPoints = interpolatedPoints.concat(
              this.interpolateBetweenPoints(nearest.latLng, nextPointInPathLatLng)
          );
      }

      this.addCumulativeDistance(interpolatedPoints);

      interpolatedPoints.forEach(function (pathPoint, index) {
          const dist = MapHelper.computeDistanceBetween(latlng, pathPoint);
          if (dist < nearest.minDistance) {
              nearest.minDistance = dist;
              nearest.latLng = pathPoint;

              nearest.routePoint = {
                  lat: pathPoint.lat,
                  lng: pathPoint.lng,
                  metreOfPath: pathPoint.distance + metreOfPath,
                  elevation: nearest.elevation,
                  cumulativeAscent: 0,
                  cumulativeDescent: 0
              };
          }
      });


    //if (nearest.index !== 0) {
    //  //now create a a series ofpoints between the previous and next know points
    //  //Then find closest point
    //  let interpolatedPoints = [];



   

    //  ////console.log(interpolatedPoints);

    //  //this.addCumulativeDistance(interpolatedPoints);

    //  //interpolatedPoints.forEach(function(pathPoint, index) {
    //  //  const dist = MapHelper.computeDistanceBetween(latlng, pathPoint);
    //  //  if (dist < nearest.minDistance) {
    //  //    nearest.minDistance = dist;
    //  //    nearest.latLng = pathPoint;

    //  //    nearest.routePoint = {
    //  //      lat: pathPoint.lat,
    //  //      lng: pathPoint.lng,
    //  //      metreOfPath: pathPoint.distance + previousPointInPath.metreOfPath,
    //  //      elevation: nearest.elevation,
    //  //      cumulativeAscent: 0,
    //  //      cumulativeDescent: 0
    //  //    };
    //  //  }
    //  //  });







    //}

    return nearest;
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
      const request = requests.find(x => x.id === requestId);
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
              pathPoint.lat().toFixed(6) === x.location.lat().toFixed(6) &&
              pathPoint.lng().toFixed(6) === x.location.lng().toFixed(6)
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
        if (status === 'OVER_QUERY_LIMIT') {
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
      if (index === 0) {
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

  //this version does not use google objects
  //pathPoint is {lat: ...., lng: ....}
  static addCumulativeDistance(pathPoints) {
    let pathDistance = 0;

    pathPoints.forEach(function(pathPoint, index) {
      pathPoint.distance = pathDistance;

      if (index > 0) {
        const previousPoint = pathPoints[index - 1];
        const distanceFromPreviousPoint = MapHelper.computeDistanceBetween(
          previousPoint,
          pathPoint
        );

        pathPoint.distance = pathDistance + distanceFromPreviousPoint;
        pathDistance = pathDistance + distanceFromPreviousPoint;
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

  static intermediatePointTo(pointA, pointB, fraction) {
    const lat1 = pointA.lat;
    const lat2 = pointB.lat;

    const lon1 = pointA.lng;
    const lon2 = pointB.lng;

    const φ1 = lat1.toRadians();
    const λ1 = lon1.toRadians();
    const φ2 = lat2.toRadians();
    const λ2 = lon2.toRadians();
    const sinφ1 = Math.sin(φ1);
    const cosφ1 = Math.cos(φ1);
    const sinλ1 = Math.sin(λ1);
    const cosλ1 = Math.cos(λ1);
    const sinφ2 = Math.sin(φ2);
    const cosφ2 = Math.cos(φ2);
    const sinλ2 = Math.sin(λ2);
    const cosλ2 = Math.cos(λ2);

    // distance between points
    var Δφ = φ2 - φ1;
    var Δλ = λ2 - λ1;
    var a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var δ = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var A = Math.sin((1 - fraction) * δ) / Math.sin(δ);
    var B = Math.sin(fraction * δ) / Math.sin(δ);

    var x = A * cosφ1 * cosλ1 + B * cosφ2 * cosλ2;
    var y = A * cosφ1 * sinλ1 + B * cosφ2 * sinλ2;
    var z = A * sinφ1 + B * sinφ2;

    var φ3 = Math.atan2(z, Math.sqrt(x * x + y * y));
    var λ3 = Math.atan2(y, x);

    //return new LatLon(φ3.toDegrees(), (λ3.toDegrees() + 540) % 360 - 180); // normalise lon to −180..+180°
    return { lat: φ3.toDegrees(), lng: (λ3.toDegrees() + 540) % 360 - 180 };
  }

  static interpolateBetweenPoints(pointA, pointB) {
    const distanceBetweenPoints = this.computeDistanceBetween(pointA, pointB);
    const maximumDistanceBetweenPoints = 10; //metres
    const numberOfPoints = distanceBetweenPoints / maximumDistanceBetweenPoints;
    const fraction = 1 / numberOfPoints;
    const result = [];

    console.log(
      `distanceBetweenPoints: ${distanceBetweenPoints}, numberOfPoints: ${numberOfPoints}, fraction: ${fraction} `
    );

    result.push({ lat: pointA.lat, lng: pointA.lng });

    for (var i = 1; i < numberOfPoints; i++) {
      const point = this.intermediatePointTo(pointA, pointB, fraction * i);
      result.push(point);
    }

    result.push({ lat: pointB.lat, lng: pointB.lng });

    return result;
  }
}

/** Extend Number object with method to convert numeric degrees to radians */
if (Number.prototype.toRadians === undefined) {
  Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
  };
}

/** Extend Number object with method to convert radians to numeric (signed) degrees */
if (Number.prototype.toDegrees === undefined) {
  Number.prototype.toDegrees = function() {
    return this * 180 / Math.PI;
  };
}

export default MapHelper;
