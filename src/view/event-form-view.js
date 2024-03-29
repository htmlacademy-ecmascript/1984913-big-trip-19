import { BLANK_WAYPOINT, WAYPOINT_TYPES, DEFAULT_POINT_TYPE, FormType } from '../consts.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getDestination,getOffersByType, isOfferChecked} from '../utils/waypoint.js';
import { capitalizeFirstLetter } from '../utils/common.js';
import { formatEditDatetime } from '../utils/format-dates.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

const createFormTypeTemplate = (pointType, id, isDisabled)=>
  WAYPOINT_TYPES.map((type)=>
    `
         <div class="event__type-item">
            <input id="event-type-${type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${pointType === type ? 'checked' : ''}${isDisabled ? 'disabled' : ''}>
            <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${id}"> ${capitalizeFirstLetter(type)}</label>
          </div>
    `
  ).join('');

const createFormOffersTemplate = (offers, pointOffers, id, isDisabled)=>{
  const getOfferName = (title)=>{
    const titleParts = title.split(' ');
    const name = titleParts[titleParts.length - 1];
    if(name === 'class'){
      return titleParts[titleParts.length - 2];
    }
    return name;
  };
  return offers.map((offer)=> {
    const offerTitle = he.encode(offer.title);
    const offerPrice = he.encode(offer.price.toString());
    return `
<div class="event__offer-selector">
<input class="event__offer-checkbox  visually-hidden" id="event-offer-${getOfferName(offerTitle)}-${id}" type="checkbox" name="event-offer-${getOfferName(offerTitle)}" ${isOfferChecked(pointOffers, offer) ? 'checked' : ''}  data-offer-id="${offer.id}  ${isDisabled ? 'disabled' : ''}">
<label class="event__offer-label" for="event-offer-${getOfferName(offerTitle)}-${id}" >
  <span class="event__offer-title">${ offerTitle}</span>
  &plus;&euro;&nbsp;
  <span class="event__offer-price">${ offerPrice}</span>
</label>
</div>
  `;}
  ).join('');
};

const createFormOffersListTemplate = (pointType, pointOffers, id, offersData, isDisabled)=>{
  const offersByType = getOffersByType(pointType, offersData);
  if(!offersByType || !offersByType.offers || offersByType.offers.length === 0){
    return '';
  }

  return ` <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
   ${createFormOffersTemplate (offersByType.offers, pointOffers, id, isDisabled)}
      </div>
    </section>`;

};

const createFormPhotosGalleryTemplate = (pictures) =>{
  if(!pictures || pictures.length === 0){
    return '';
  }
  return`<div class="event__photos-container">
    <div class="event__photos-tape">
      ${pictures.map((picture)=> `<img class="event__photo" src=${picture.src} alt=${picture.alt}>`)}
  </div>`;
};

const createFormControlsTemplate = (formType, isDisabled, isSaving, isDeleting)=>{

  const getResetButtonText = ()=>{
    if(formType === FormType.EDITING ){
      return isDeleting ? 'Deleting...' : 'Delete';
    }
    return 'Cancel';
  };
  return `<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
 <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${getResetButtonText()}</button>
 ${formType === FormType.EDITING ? `<button class="event__rollup-btn" type="button" >
  <span class="visually-hidden">Open event</span>
</button>` : ''}
`;};


const createEventFormTemplate = (waypoint, formType, destinations, offersData,)=>{
  const {basePrice, dateFrom, dateTo, destination, offers, type, id, isDisabled, isSaving, isDeleting } = waypoint;
  const pointType = type !== '' ? type : DEFAULT_POINT_TYPE;
  const typeListTemplate = createFormTypeTemplate(pointType,id);
  const offersTemplate = createFormOffersListTemplate(type, offers,id, offersData);
  const destinationInfo = getDestination(destination, destinations);
  const controlsTemplate = createFormControlsTemplate(formType,isDisabled, isSaving, isDeleting);
  const startDate = formatEditDatetime(dateFrom);
  const endDate = formatEditDatetime(dateTo);
  const destinationsList = destinations?.map((item) => `<option value="${item.name}"></option>`).join('');

  return(`   <li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
  <div class="event__type-wrapper">
  <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
  <span class="visually-hidden">Choose event type</span>
  <img class="event__type-icon" width="17" height="17" src="img/icons/${pointType}.png" alt="Event type icon">
</label>
<input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox"  ${isDisabled ? 'disabled' : ''}>
<div class="event__type-list">
  <fieldset class="event__type-group">
    <legend class="visually-hidden">Event type</legend>

${typeListTemplate}
</fieldset>
</div>
</div>
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-${id}">
        ${pointType}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${destinationInfo ? he.encode(destinationInfo.name) : ''}" list="destination-list-${id}"  ${isDisabled ? 'disabled' : ''}>
      <datalist id="destination-list-${id}">
${destinationsList}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${id}">From</label>
      <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value='${he.encode(startDate)}'  ${isDisabled ? 'disabled' : ''}>
      &mdash;
      <label class="visually-hidden" for="event-end-time-${id}">To</label>
      <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value='${he.encode(endDate)}'  ${isDisabled ? 'disabled' : ''}>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${id}">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${he.encode(basePrice.toString())}" ${isDisabled ? 'disabled' : ''} >
    </div>

${controlsTemplate}
  </header>
  <section class="event__details">
   ${offersTemplate}
   ${destinationInfo ? `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${he.encode(destinationInfo.description)}</p>
      ${createFormPhotosGalleryTemplate(destinationInfo.pictures)}
    </section>
  </section>` : ''}
</form>
</li>`);};

export default class EventFormView extends AbstractStatefulView{
  #destinations = null;
  #offers = null;
  #formType = null;
  #handleSubmit = null;
  #handleReset = null;
  #handleDeleteClick = null;
  #dateFromPicker = null;
  #dateToPicker = null;


  constructor({waypoint = BLANK_WAYPOINT, formType, onSubmit, onReset,onDeleteClick, destinations, offers }){
    super();
    this._setState(EventFormView.parseWaypointToState(waypoint));
    this.#formType = formType;
    this.#handleSubmit = onSubmit;
    this.#handleReset = onReset;
    this.#handleDeleteClick = onDeleteClick;
    this.#destinations = destinations;
    this.#offers = offers;
    this._restoreHandlers();
  }

  get template(){
    return createEventFormTemplate(this._state, this.#formType, this.#destinations, this.#offers);
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
    if(Number(newPrice) && newPrice >= 1){
      this._setState({
        basePrice: +newPrice
      });
    }
    else{
      evt.target.value = this._state.basePrice;
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
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToWaypoint(state){
    const waypoint = {...state};

    delete waypoint.isDisabled;
    delete waypoint.isSaving;
    delete waypoint.isDeleting;

    return waypoint;
  }

}
