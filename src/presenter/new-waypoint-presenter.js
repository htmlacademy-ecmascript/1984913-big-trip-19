import {remove, render, RenderPosition} from '../framework/render.js';
import EventFormView from '../view/event-form-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType, FormType} from '../consts.js';
import { isEscapeKey } from '../utils/common.js';

export default class NewWaypointPresenter {
  #eventsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #destinations = null;
  #offers = null;

  #waypointAddComponent = null;

  constructor({eventsListContainer, onDataChange, onDestroy, destinations, offers}) {
    this.#eventsListContainer = eventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init() {
    if (this.#waypointAddComponent !== null) {
      return;
    }

    this.#waypointAddComponent = new EventFormView({
      destinations:this.#destinations,
      offers:this.#offers,
      formType:FormType.ADDING,
      onSubmit: this.#handleFormSubmit,
      onReset: this.#handleFormReset,
    });

    render(this.#waypointAddComponent, this.#eventsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#waypointAddComponent === null) {
      return;
    }
    this.#handleDestroy();
    remove(this.#waypointAddComponent);
    this.#waypointAddComponent = null;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  #handleFormSubmit = (waypoint) => {
    this.#handleDataChange(
      UserAction.ADD_WAYPOINT,
      UpdateType.MINOR,
      {id: nanoid(), ...waypoint},
    );
    this.destroy();
  };

  #handleFormReset = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
