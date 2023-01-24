import AbstractView from '../framework/view/abstract-view.js';
import { countDuration, getDurationInfo} from '../utils/common.js';
import { getDestination, getCheckedOffers} from '../utils/waypoint.js';
import { formatDate, formatTime, formatDatetimeEvent } from '../utils/format-dates.js';

const createOffersTemplate = (offers)=> offers.map((offer)=> `<li class="event__offer">
<span class="event__offer-title">${offer.title}</span>
&plus;&euro;&nbsp;
<span class="event__offer-price">${offer.price}</span>
</li>`).join('');


const createWaypointTemplate = (waypoint, destinations, offersData)=>{
  const {basePrice, dateFrom, dateTo, destination, isFavorite, offers, type } = waypoint;
  const date = formatDate(dateFrom);
  const startTime = formatTime(dateFrom);
  const endTime = formatTime(dateTo);
  const duration = getDurationInfo(countDuration(dateFrom,dateTo));
  const favoriteClassName = isFavorite ? 'event__favorite-btn--active' : '';
  const destinationInfo = getDestination(destination, destinations);
  const checkedOffers = getCheckedOffers(type, offers, offersData);
  return(` <li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime=${formatDatetimeEvent(dateFrom,0,10)}>${date}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${type} ${destinationInfo.name}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime=${formatDatetimeEvent(dateFrom,0,16)}>${startTime}</time>
      &mdash;
      <time class="event__end-time" datetime=${formatDatetimeEvent(dateTo,0,16)}>${endTime}</time>
    </p>
    <p class="event__duration">${duration}</p>
  </div>
  <p class="event__price">
    &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
  </p>
  ${checkedOffers ?
      `<h4 class="visually-hidden">Offers:</h4>
   <ul class="event__selected-offers">
  ${createOffersTemplate(checkedOffers)}
    </ul>` : ''
    }
  <button class="event__favorite-btn ${favoriteClassName}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
    </svg>
  </button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>
</li>`);
};

export default class WaypointView extends AbstractView{
  #waypoint = null;
  #destinations = null;
  #offers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({waypoint,destinations, offers, onEditClick, onFavoriteClick}){
    super();
    this.#waypoint = waypoint;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click',this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click',this.#favoriteClickHandler);
  }

  get template(){
    return createWaypointTemplate(this.#waypoint,this.#destinations, this.#offers);
  }

  #editClickHandler = (evt)=>{
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt)=>{
    evt.preventDefault();
    this.#handleFavoriteClick();
  };

}
