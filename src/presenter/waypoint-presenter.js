import WaypointView from '../view/waypoint-view';
import EventFormView from '../view/event-form-view';
import { render, replace, remove } from '../framework/render';
import { isEscapeKey } from '../utils/common.js';
import { WaypointStatus } from '../consts';

export default class WaypointPresenter{
  #eventsContainer = null;
  #handleStatusChange = null;
  #handleDataChange = null;

  #waypointComponent = null;
  #eventFormComponent = null;

  #waypoint = null;
  #destinations = null;
  #status = WaypointStatus.DEFAULT;

  constructor({eventsContainer, onStatusChange, onDataChange }){
    this.#eventsContainer = eventsContainer;
    this.#handleStatusChange = onStatusChange;
    this.#handleDataChange = onDataChange;
  }

  init(waypoint, destinations){
    this.#waypoint = waypoint;
    this.#destinations = destinations;

    const formType = 'edit';
    const prevWaypointComponent = this.#waypointComponent;
    const prevEventFormComponent = this.#eventFormComponent;

    this.#waypointComponent = new WaypointView({
      waypoint:this.#waypoint,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#eventFormComponent = new EventFormView({
      waypoint:this.#waypoint,
      destinations:this.#destinations,
      formType,
      onSubmit:this.#handleFormSubmit,
      onReset:this.#handleFormReset
    });

    if(prevWaypointComponent === null || prevEventFormComponent === null){
      render(this.#waypointComponent, this.#eventsContainer);
      return;
    }

    if(this.#status === WaypointStatus.DEFAULT){
      replace(this.#waypointComponent, prevWaypointComponent);
    }

    if(this.#status === WaypointStatus.EDITING){
      replace(this.#eventFormComponent, prevEventFormComponent);
    }

    remove(prevWaypointComponent);
    remove(prevEventFormComponent);
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

  #handleFavoriteClick = ()=>{
    this.#handleDataChange({...this.#waypoint, isFavorite:!this.#waypoint.isFavorite});
  };

  #handleFormSubmit = (data)=>{
    this.#handleDataChange(data);
    this.#replaceComponent('form');
  };

  #handleFormReset = ()=>{
    this.#eventFormComponent.reset(this.#waypoint, this.#destinations);
    this.#replaceComponent('form');
  };
}
