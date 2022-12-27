import {FilterType} from '../consts.js';

const checkWaypointStatus = (waypointStart, waypointEnd)=>{
  const now = new Date();
  if(waypointStart > now){
    return 'future';
  }else if(waypointStart <= now && waypointEnd >= now){
    return 'present';
  }else{
    return 'past';
  }
};

const filter = {
  [FilterType.EVERYTHING]: (waypoints)=>waypoints,
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => checkWaypointStatus(waypoint.dateFrom, waypoint.dateTo) === 'future'),
  [FilterType.PRESENT]: (waypoints) => waypoints.filter((waypoint) => checkWaypointStatus(waypoint.dateFrom, waypoint.dateTo) === 'present'),
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => checkWaypointStatus(waypoint.dateFrom, waypoint.dateTo) === 'past'),
};

export {filter};
