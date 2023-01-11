import { BLANK_WAYPOINT, WAYPOINT_TYPES, DEFAULT_POINT_TYPE } from '../consts.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {getOffersByType, getDestination, isOfferChecked } from '../mocks/waypoint.js';
import { formatEditDatetime } from '../utils/format-dates.js';


const createFormTypeTemplate = (pointType, id)=>
  WAYPOINT_TYPES.map((type)=>
    `
         <div class="event__type-item">
            <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${pointType === type ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}">${type}</label>
          </div>
    `
  ).join('');

const createFormOffersTemplate = (offers, pointOffers, id)=>{
  const getOfferName = (title)=>{
    const titleParts = title.split(' ');
    return titleParts[titleParts.length - 1];
  };
  return offers.map((offer)=> (
    `
<div class="event__offer-selector">
<input class="event__offer-checkbox  visually-hidden" id="event-offer-${getOfferName(offer.title)}-${id}" type="checkbox" name="event-offer-${getOfferName(offer.title)}" ${isOfferChecked(pointOffers, offer) ? 'checked' : ''}>
<label class="event__offer-label" for="event-offer-${getOfferName(offer.title)}-${id}" >
  <span class="event__offer-title">${offer.title}</span>
  &plus;&euro;&nbsp;
  <span class="event__offer-price">${offer.price}</span>
</label>
</div>
  `)
  ).join('');
};

const createFormOffersListTemplate = (pointType, pointOffers, id)=>{
  const offersByType = getOffersByType(pointType);
  if(!offersByType || !offersByType.offers || offersByType.offers.length === 0){
    return '';
  }

  return ` <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
   ${createFormOffersTemplate (offersByType.offers, pointOffers, id)}
      </div>
    </section>`;

};

const createFormPhotosGallery = (pictures) =>{
  if(!pictures || pictures.length === 0){
    return '';
  }
  return`<div class="event__photos-container">
    <div class="event__photos-tape">
      ${pictures.map((picture)=> `<img class="event__photo" src=${picture.src} alt=${picture.alt}>`)}
  </div>`;
};

const createFormControlsTemplate = (formType)=>{
  const resetButtonText = formType === 'edit' ? 'Delete' : 'Cancel';
  return `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
 <button class="event__reset-btn" type="reset">${resetButtonText}</button>
 ${formType === 'edit' ? `<button class="event__rollup-btn" type="button">
  <span class="visually-hidden">Open event</span>
</button>` : ''}
`;};

const createEventFormTemplate = (waypoint, formType)=>{
  const {basePrice, dateFrom, dateTo, destination, offers, type, id } = waypoint;
  const pointType = type !== '' ? type : DEFAULT_POINT_TYPE;
  const typeListTemplate = createFormTypeTemplate(pointType,id);
  const offersTemplate = createFormOffersListTemplate(type, offers,id);
  const destinationInfo = getDestination(destination);
  const controlsTemplate = createFormControlsTemplate(formType);
  return(`   <li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
  <div class="event__type-wrapper">
  <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
  <span class="visually-hidden">Choose event type</span>
  <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">
</label>
<input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
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
        <option value="Mont Blanc"></option>
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
   ${offersTemplate}
   ${destinationInfo ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destinationInfo.description}</p>
      ${createFormPhotosGallery(destinationInfo.pictures)}
    </section>
  </section>` : ''}
</form>
</li>`);};

export default class EventFormView extends AbstractStatefulView{
  #destinations = null;
  #formType = null;
  #handleSubmit = null;
  #handleReset = null;
  constructor({waypoint = BLANK_WAYPOINT, formType, onSubmit, onReset, destinations }){
    super();
    this._setState(EventFormView.parseWaypointToState(waypoint));
    this.#formType = formType;
    this.#handleSubmit = onSubmit;
    this.#handleReset = onReset;
    this.#destinations = destinations;
    this._restoreHandlers();
  }

  get template(){
    return createEventFormTemplate(this._state, this.#formType);
  }


  _restoreHandlers(){
    if(this.#formType === 'edit'){
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetHandler);

    }

    this.element.querySelector('.event--edit').addEventListener('submit', this.#submitHandler);
    this.element.querySelector('.event--edit').addEventListener('reset', this.#resetHandler);

    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
  }

  #submitHandler = (evt)=>{
    evt.preventDefault();
    this.#handleSubmit();
  };

  #resetHandler = ()=>{
    this.#handleReset();
  };

  #typeChangeHandler = (evt)=>{
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value,
      });
    }
  };

  #destinationChangeHandler = (evt)=>{
    evt.preventDefault();
    if (evt.target.value === '') {
      this.updateElement({
        destination: ''
      });
    }

    const chosenDestination = this.#destinations.find((item)=>item.name === evt.target.value);
    this.updateElement({
      destination: chosenDestination.id
    });
  };

  static parseWaypointToState(waypoint){
    return {
      ...waypoint,
    };
  }

  static parseStateToWaypoint(state){
    const waypoint = {...state};
    waypoint.destination = waypoint.chosenDestination.id;

    return waypoint;
  }

}
