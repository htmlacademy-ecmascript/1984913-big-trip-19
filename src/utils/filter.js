import {FilterType} from '../consts.js';

const checkWaypointStatus = (waypointStart, waypointEnd)=>{
  const now = new Date();
  if(waypointStart > now){
    return FilterType.FUTURE;
  }else if(waypointStart <= now && waypointEnd >= now){
    return FilterType.PRESENT;
  }else{
    return FilterType.PAST;
  }
};

const filter = {
  [FilterType.EVERYTHING]: (waypoints)=>waypoints,
  [FilterType.FUTURE]: (waypoints) => waypoints.filter((waypoint) => checkWaypointStatus(waypoint.dateFrom, waypoint.dateTo) === FilterType.FUTURE),
  [FilterType.PRESENT]: (waypoints) => waypoints.filter((waypoint) => checkWaypointStatus(waypoint.dateFrom, waypoint.dateTo) === FilterType.PRESENT),
  [FilterType.PAST]: (waypoints) => waypoints.filter((waypoint) => checkWaypointStatus(waypoint.dateFrom, waypoint.dateTo) === FilterType.PAST),
};

export {filter};
