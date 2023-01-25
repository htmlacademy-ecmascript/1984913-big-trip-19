import dayjs from 'dayjs';

const sortWaypontByTime = (waypointA, waypointB)=>{
  const durationA = dayjs(waypointA.dateTo).diff(dayjs(waypointA.dateFrom));
  const durationB = dayjs(waypointB.dateTo).diff(dayjs(waypointB.dateFrom));

  return durationB - durationA;
};

const sortWaypointByPrice = (waypointA, waypointB)=> waypointB.basePrice - waypointA.basePrice;

const sortWaypointByDay = (waypointA, waypointB)=>dayjs(waypointA.dateFrom).diff(dayjs(waypointB.dateFrom));

const isDatesEqual = (dateA, dateB)=>dayjs(dateA).isSame(dateB);

export{ sortWaypontByTime, sortWaypointByPrice, sortWaypointByDay, isDatesEqual};
