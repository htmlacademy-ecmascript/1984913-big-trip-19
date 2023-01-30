import { TRIP_INFO_DESTINATIONS_MAX } from '../consts.js';
import AbstractStatefulView from '../framework/view/abstract-view.js';
import { formatDate } from '../utils/format-dates.js';
import { getCheckedOffers, getDestination } from '../utils/waypoint.js';

const createTripInfoTemplate = (getTripDestinations, getTripDates, getTripPrice)=>`
<section class="trip-main__trip-info  trip-info">
  <div class="trip-info__main">
    <h1 class="trip-info__title">${getTripDestinations()}</h1>

    <p class="trip-info__dates">${getTripDates()}</p>
  </div>

  <p class="trip-info__cost">
    Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTripPrice()}</span>
  </p>
</section>
`;

export default class TripInfoView extends AbstractStatefulView{
  #waypoints = [];
  #destinations = [];
  #offers = [];

  constructor(waypoints, destinations, offers ) {
    super();
    this.#waypoints = waypoints;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template(){
    return createTripInfoTemplate(this.#getDestinations, this.#getTripDates, this.#getTripPrice);
  }

  #getDestinations = () => {
    if (!this.#waypoints || !this.#waypoints.length) {
      return '';
    }

    const selectedDestinations = this.#destinations
      .filter((destination) => this.#waypoints
        .find((point) => point.destination === destination.id))
      .map((destination) => destination.name);

    if (selectedDestinations.length > TRIP_INFO_DESTINATIONS_MAX) {
      const firstDestination = getDestination(this.#waypoints[0].destination, this.#destinations).name;
      const lastDestination = getDestination(this.#waypoints.at(-1).destination, this.#destinations).name;

      return [firstDestination, lastDestination].join(' &mdash; ... &mdash; ');
    }

    return selectedDestinations.join(' &mdash; ');
  };

  #getTripPrice = () => {
    if (!this.#waypoints || !this.#waypoints.length) {
      return '';
    }

    return this.#waypoints.reduce((total, point) => {
      const checkedOffers = getCheckedOffers(point.type,point.offers, this.#offers);
      const offersSum = checkedOffers.reduce((acc, offer)=>{ acc += offer.price; return acc;},0);

      total += point.basePrice + offersSum;
      return total;
    }, 0);
  };

  #getTripDates = () => {
    if (!this.#waypoints || !this.#waypoints.length) {
      return '';
    }

    const dateFrom = formatDate(this.#waypoints[0].dateFrom, true);
    const dateTo = formatDate(this.#waypoints.at(-1).dateTo, true);

    return [dateFrom, dateTo].join(' - ');
  };

}
