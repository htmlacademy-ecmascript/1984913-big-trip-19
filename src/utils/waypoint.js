import dayjs from 'dayjs';

const sortWaypontByTime = (waypointA, waypointB)=>{
  const durationA = dayjs(waypointA.dateTo).diff(dayjs(waypointA.dateFrom));
  const durationB = dayjs(waypointB.dateTo).diff(dayjs(waypointB.dateFrom));

  return durationB - durationA;
};

const sortWaypointByPrice = (waypointA, waypointB)=> waypointB.basePrice - waypointA.basePrice;

const sortWaypointByDay = (waypointA, waypointB)=>dayjs(waypointA.dateFrom).diff(dayjs(waypointB.dateFrom));

const isDatesEqual = (dateA, dateB)=>dayjs(dateA).isSame(dateB);

const getDestination = (id, destinations)=> destinations.find((destination)=>destination.id === id);

const getOffersByType = (type, offers)=> offers?.find((offer) => type === offer.type);

const getCheckedOffers = (type, pointOffers, offers) => {
  const offersByType = getOffersByType(type, offers);
  if (!offersByType || !offersByType.offers) {
    return;
  }
  const checkedOffers = offersByType.offers.filter((offer) =>
    pointOffers
      .some((offerId) => offerId === offer.id));
  return checkedOffers;
};

const isOfferChecked = (pointOffers, offer)=> !!pointOffers.find((item)=> offer.id === item);

export{ sortWaypontByTime, sortWaypointByPrice, sortWaypointByDay, isDatesEqual, getDestination, getOffersByType,getCheckedOffers, isOfferChecked };
