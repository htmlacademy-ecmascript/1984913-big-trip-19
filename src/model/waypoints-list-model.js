import { WAYPOINTS_AMOUNT } from '../consts';
import { getRandomWaypoint } from '../mocks/waypoint';

export default class WaypointsListModel {
  waypoints = Array.from({length:WAYPOINTS_AMOUNT}, getRandomWaypoint);

  getWaypoints(){
    return this.waypoints;
  }

}
