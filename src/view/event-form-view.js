import { BLANK_WAYPOINT, WAYPOINT_TYPES, DEFAULT_POINT_TYPE } from '../consts.js';
import {createElement} from '../render.js';
import { getDestination, isOfferChecked, mockOffers } from '../mocks/waypoint.js';
import { formatEditDatetime } from '../utils.js';


const createFormTypeTemplate = (pointType)=>
  WAYPOINT_TYPES.map((type)=>
    `
         <div class="event__type-item">
            <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${pointType === type ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
          </div>
    `
  ).join('');

const createFormOffersTemplate = (pointOffers)=>mockOffers.map((offer)=> (
  `
  <div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${isOfferChecked(pointOffers, offer) ? 'checked' : ''}>
  <label class="event__offer-label" for="event-offer-luggage-1" >
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>
</div>
    `)
).join('');

const createFormControlsTemplate = (formType)=>{
  const resetButtonText = formType === 'edit' ? 'Delete' : 'Cancel';
  return `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
 <button class="event__reset-btn" type="reset">${resetButtonText}</button>
 ${formType === 'edit' ? `<button class="event__rollup-btn" type="button">
  <span class="visually-hidden">Open event</span>
</button>` : ''}
`;};

const createEventFormTemplate = (waypoint, formType)=>{
  const {basePrice, dateFrom, dateTo, destination, offers, type } = waypoint;
  const pointType = type !== '' ? type : DEFAULT_POINT_TYPE;
  const typeListTemplate = createFormTypeTemplate(pointType);
  const offersTemplate = createFormOffersTemplate(offers);
  const destinationInfo = getDestination(destination);
  const controlsTemplate = createFormControlsTemplate(formType);
  return(`   <li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
  <div class="event__type-wrapper">
  <label class="event__type  event__type-btn" for="event-type-toggle-1">
  <span class="visually-hidden">Choose event type</span>
  <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">
</label>
<input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
<div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>

${typeListTemplate}
</fieldset>
</div>
</div>
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${pointType}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationInfo ? destinationInfo.name : ''}" list="destination-list-1">
      <datalist id="destination-list-1">
        <option value="Amsterdam"></option>
        <option value="Geneva"></option>
        <option value="Chamonix"></option>
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value='${formatEditDatetime(dateFrom)}'>
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value='${formatEditDatetime(dateTo)}'>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
    </div>

${controlsTemplate}
  </header>
  <section class="event__details">
   ${mockOffers ? ` <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
   ${offersTemplate}
      </div>
    </section>` : ''}

   ${destinationInfo ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationInfo.description}</p>
    </section>
  </section>` : ''}
</form>
</li>`);};

export default class EventFormView {
  #element = null;
  #waypoint = BLANK_WAYPOINT;
  #formType = null;
  constructor({waypoint = BLANK_WAYPOINT, formType}){
    this.#waypoint = waypoint;
    this.#formType = formType;
  }

  get template(){
    return createEventFormTemplate(this.#waypoint, this.#formType);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
