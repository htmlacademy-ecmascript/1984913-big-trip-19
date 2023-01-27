import {remove, render, RenderPosition} from '../framework/render.js';
import EventFormView from '../view/event-form-view.js';
import {nanoid} from 'nanoid';
import {UserAction, UpdateType, FormType} from '../consts.js';
import { isEscapeKey } from '../utils/common.js';

export default class NewWaypointPresenter {
  #eventsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;


  #waypointAddComponent = null;

  constructor({eventsListContainer, onDataChange, onDestroy,}) {
    this.#eventsListContainer = eventsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init(destinations, offers) {
    if (this.#waypointAddComponent !== null) {
      return;
    }
    this.#waypointAddComponent = new EventFormView({
      destinations:destinations,
      offers:offers,
      formType:FormType.ADDING,
      onSubmit: this.#handleFormSubmit,
      onReset: this.#handleFormReset,
    });

    render(this.#waypointAddComponent, this.#eventsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#waypointAddComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#waypointAddComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#waypointAddComponent.shake(resetFormState);
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
