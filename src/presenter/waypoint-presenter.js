import WaypointView from '../view/waypoint-view';
import EventFormView from '../view/event-form-view';
import { render, replace, remove } from '../framework/render';
import { isEscapeKey } from '../utils/common.js';
import { FormType, UpdateType, UserAction, WaypointStatus } from '../consts';
import { isDatesEqual } from '../utils/waypoint';

export default class WaypointPresenter{
  #eventsContainer = null;
  #handleStatusChange = null;
  #handleDataChange = null;

  #waypointComponent = null;
  #eventFormComponent = null;

  #waypoint = null;
  #destinations = null;
  #offers = null;
  #status = WaypointStatus.DEFAULT;

  constructor({eventsContainer, onStatusChange, onDataChange }){
    this.#eventsContainer = eventsContainer;
    this.#handleStatusChange = onStatusChange;
    this.#handleDataChange = onDataChange;
  }

  init(waypoint, destinations, offers){
    this.#waypoint = waypoint;
    this.#destinations = destinations;
    this.#offers = offers;

    const prevWaypointComponent = this.#waypointComponent;
    const prevEventFormComponent = this.#eventFormComponent;

    this.#waypointComponent = new WaypointView({
      waypoint:this.#waypoint,
      destinations:this.#destinations,
      offers:this.#offers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#eventFormComponent = new EventFormView({
      waypoint:this.#waypoint,
      destinations:this.#destinations,
      offers:this.#offers,
      formType:FormType.EDITING,
      onSubmit:this.#handleFormSubmit,
      onReset:this.#handleFormReset,
      onDeleteClick:this.#handleDeleteClick
    });

    if(prevWaypointComponent === null || prevEventFormComponent === null){
      render(this.#waypointComponent, this.#eventsContainer);
      return;
    }

    if(this.#status === WaypointStatus.DEFAULT){
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if(this.#status === WaypointStatus.EDITING){
      replace(this.#waypointComponent, prevEventFormComponent);
      this.#status = WaypointStatus.DEFAULT;
    }

    remove(prevWaypointComponent);
    remove(prevEventFormComponent);
  }

  setSaving() {
    if(this.#status === WaypointStatus.EDITING){
      this.#eventFormComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if(this.#status === WaypointStatus.EDITING){
      this.#eventFormComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#status === WaypointStatus.DEFAULT) {
      this.#waypointComponent.shake();
      return;
    }
    const resetFormState = () => {
      this.#eventFormComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#eventFormComponent.shake(resetFormState);
  }

  destroy(){
    remove(this.#waypointComponent);
    remove(this.#eventFormComponent);
  }

  resetView() {
    if (this.#status !== WaypointStatus.DEFAULT) {
      this.#eventFormComponent.reset(this.#waypoint, this.#destinations);
      this.#replaceComponent('form');
    }
  }

  #replaceComponent = (componentType)=>{
    const replacingComponent = componentType === 'waypoint'
      ? this.#eventFormComponent
      : this.#waypointComponent;
    const replaceableComponent = componentType === 'waypoint'
      ? this.#waypointComponent
      : this.#eventFormComponent;
    if(componentType === 'waypoint'){
      document.addEventListener('keydown', this.#handleEscKeyDown);
      this.#handleStatusChange();
      this.#status = WaypointStatus.EDITING;
    }else{
      document.removeEventListener('keydown', this.#handleEscKeyDown);
      this.#status = WaypointStatus.DEFAULT;
    }
    replace(replacingComponent,replaceableComponent);
  };

  #handleEscKeyDown = (evt)=> {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#eventFormComponent.reset(this.#waypoint, this.#destinations);
      this.#replaceComponent('form');
    }
  };

  #handleEditClick = ()=>{
    this.#replaceComponent('waypoint');
  };

  #handleDeleteClick = (data)=>{
    this.#handleDataChange(UserAction.DELETE_WAYPOINT, UpdateType.MINOR,data);
  };

  #handleFavoriteClick = ()=>{
    this.#handleDataChange(UserAction.UPDATE_WAYPOINT, UpdateType.PATCH,{...this.#waypoint, isFavorite:!this.#waypoint.isFavorite},);
  };

  #handleFormSubmit = (update)=>{
    const isDatesFromEqual = isDatesEqual(this.#waypoint.dateFrom, update.dateFrom);
    const isDatesToEqual = isDatesEqual(this.#waypoint.dateTo, update.dateTo);
    const isBasePricesEqual = this.#waypoint.basePrice === update.basePrice;
    const isDestinationsEqual = this.#waypoint.destination === update.destination;
    const isMinorUpdate = !isDatesFromEqual || !isDatesToEqual || !isBasePricesEqual || !isDestinationsEqual;
    const updateType = isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH;
    this.#handleDataChange(UserAction.UPDATE_WAYPOINT,updateType ,update);
  };

  #handleFormReset = ()=>{
    this.#eventFormComponent.reset(this.#waypoint, this.#destinations);
    this.#replaceComponent('form');
  };
}
