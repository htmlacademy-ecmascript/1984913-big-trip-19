import { WAYPOINTS_AMOUNT } from '../consts';
import { getRandomWayPoint } from '../mocks/waypoint';

export default class WaypointsListModel {
  waypoints = Array.from({length:WAYPOINTS_AMOUNT}, getRandomWayPoint);

  getWaypoints(){
    return this.waypoints;
  }

}
