import { BLANK_WAYPOINT, WAYPOINT_TYPES, DEFAULT_POINT_TYPE, FormType } from '../consts.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {getOffersByType, getDestination, isOfferChecked } from '../mocks/waypoint.js';
import { capitalizeFirstLetter } from '../utils/common.js';
import { formatEditDatetime } from '../utils/format-dates.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const createFormTypeTemplate = (pointType, id)=>
  WAYPOINT_TYPES.map((type)=>
    `
         <div class="event__type-item">
            <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${pointType === type ? 'checked' : ''}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}"> ${capitalizeFirstLetter(type)}</label>
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
<input class="event__offer-checkbox  visually-hidden" id="event-offer-${getOfferName(offer.title)}-${id}" type="checkbox" name="event-offer-${getOfferName(offer.title)}" ${isOfferChecked(pointOffers, offer) ? 'checked' : ''}  data-offer-id="${offer.id}">
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
  const resetButtonText = formType === FormType.EDITING ? 'Delete' : 'Cancel';
  return `<button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
 <button class="event__reset-btn" type="reset">${resetButtonText}</button>
 ${formType === FormType.EDITING ? `<button class="event__rollup-btn" type="button">
  <span class="visually-hidden">Open event</span>
</button>` : ''}
`;};


const createEventFormTemplate = (waypoint, formType, destinations)=>{
  const {basePrice, dateFrom, dateTo, destination, offers, type, id } = waypoint;
  const pointType = type !== '' ? type : DEFAULT_POINT_TYPE;
  const typeListTemplate = createFormTypeTemplate(pointType,id);
  const offersTemplate = createFormOffersListTemplate(type, offers,id);
  const destinationInfo = getDestination(destination);
  const controlsTemplate = createFormControlsTemplate(formType);

  const destinationsList = destinations?.map((item) => `<option value="${item.name}"></option>`).join('');

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
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destinationInfo ? he.encode(destinationInfo.name) : ''}" list="destination-list-1">
      <datalist id="destination-list-1">
${destinationsList}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${id}">From</label>
      <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value='${formatEditDatetime(dateFrom)}'>
      &mdash;
      <label class="visually-hidden" for="event-end-time-${id}">To</label>
      <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value='${formatEditDatetime(dateTo)}'>
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
  #handleDeleteClick = null;
  #dateFromPicker = null;
  #dateToPicker = null;


  constructor({waypoint = BLANK_WAYPOINT, formType, onSubmit, onReset,onDeleteClick, destinations }){
    super();
    this._setState(EventFormView.parseWaypointToState(waypoint));
    this.#formType = formType;
    this.#handleSubmit = onSubmit;
    this.#handleReset = onReset;
    this.#handleDeleteClick = onDeleteClick;
    this.#destinations = destinations;
    this._restoreHandlers();
  }

  get template(){
    return createEventFormTemplate(this._state, this.#formType, this.#destinations);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#dateFromPicker) {
      this.#dateFromPicker.destroy();
      this.#dateFromPicker = null;
    }

    if (this.#dateToPicker) {
      this.#dateToPicker.destroy();
      this.#dateToPicker = null;
    }
  };

  reset(waypoint){
    this.updateElement(EventFormView.parseWaypointToState(waypoint));
  }

  _restoreHandlers(){
    this.#setInnerHandlers();

    this.element.querySelector('.event--edit').addEventListener('submit', this.#submitHandler);
    this.element.querySelector('.event--edit').addEventListener('reset', this.#resetHandler);
  }

  #setInnerHandlers = ()=>{
    if(this.#formType === FormType.EDITING){
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#resetHandler);
      this.element.querySelector('.event__reset-btn')
        .addEventListener('click', this.#formDeleteClickHandler);
    }

    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offerCheckHandler);

    this.#setDateFromPicker();
    this.#setDateToPicker();
  };

  #submitHandler = (evt)=>{
    evt.preventDefault();

    const submitButton = this.element.querySelector('.event__save-btn');
    const destination = this.element.querySelector('.event__input--destination').value;
    const price = this.element.querySelector('.event__input--price').value;

    if (price < 1) {
      submitButton.disabled = true;
      return;
    }

    if (destination === '') {
      submitButton.disabled = true;
      return;
    }
    this.#handleSubmit(EventFormView.parseStateToWaypoint(this._state));
  };

  #resetHandler = ()=>{
    this.#handleReset();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EventFormView.parseStateToWaypoint(this._state));
  };

  #typeChangeHandler = (evt)=>{
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value,
        offers:[]
      });
    }
  };

  #destinationChangeHandler = (evt)=>{
    evt.preventDefault();

    const chosenDestination = this.#destinations.find((item)=>item.name === evt.target.value);

    if(chosenDestination){
      this.updateElement({
        destination: chosenDestination.id
      });
    }else{
      evt.target.value = '';
    }
  };

  #priceChangeHandler = (evt)=>{
    evt.preventDefault();
    const newPrice = evt.target.value;
    if(Number(newPrice)){
      this._setState({
        basePrice: +newPrice
      });}
    else{
      evt.target.value = 0;
    }
  };

  #offerCheckHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      const checkedOfferId = Number(evt.target.dataset.offerId);
      const checkedOfferIndex = this._state.offers.indexOf(checkedOfferId);
      if (checkedOfferIndex === -1) {
        this._state.offers.push(checkedOfferId);
        return;
      }

      this._state.offers.splice(checkedOfferIndex, 1);
    }
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDateFromPicker = () => {
    this.#dateFromPicker = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        maxDate: this._state.dateTo,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
        'time_24hr':true
      }
    );
  };

  #setDateToPicker = () => {
    this.#dateToPicker = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        minDate: this._state.dateFrom,
        defaultDate: this._state.dateTo,
        onChange: this.#dateToChangeHandler,
        'time_24hr':true
      }
    );
  };

  static parseWaypointToState(waypoint){
    return {
      ...waypoint,
    };
  }

  static parseStateToWaypoint(state){
    const waypoint = {...state};
    return waypoint;
  }

}
