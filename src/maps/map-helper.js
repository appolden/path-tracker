class MapHelper {
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
        nearest.cumulativeAscent = pathPoint.cumulativeAscent;
        nearest.cumulativeDescent = pathPoint.cumulativeDescent;
      }
    });

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

    if (nearest.index < pathPoints.length - 1) {
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

    interpolatedPoints.forEach(function(pathPoint, index) {
      const dist = MapHelper.computeDistanceBetween(latlng, pathPoint);
      if (dist < nearest.minDistance) {
        nearest.minDistance = dist;
        nearest.latLng = pathPoint;

        nearest.routePoint = {
          lat: pathPoint.lat,
          lng: pathPoint.lng,
          metreOfPath: pathPoint.distance + metreOfPath,
          elevation: nearest.elevation,
          cumulativeAscent: nearest.cumulativeAscent,
          cumulativeDescent: nearest.cumulativeDescent
        };
      }
    });

    return nearest;
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
