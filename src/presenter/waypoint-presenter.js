import WaypointView from '../view/waypoint-view';
import EventFormView from '../view/event-form-view';
import { render, replace } from '../framework/render';
import { isEscapeKey } from '../utils/common.js';

export default class WaypointPresenter{
  #eventsContainer = null;

  #waypointComponent = null;

  #eventFormComponent = null;

  #waypoint = null;

  constructor({eventsContainer }){
    this.#eventsContainer = eventsContainer;
  }

  init(waypoint){
    this.#waypoint = waypoint;
    const formType = 'edit';
    this.#waypointComponent = new WaypointView({
      waypoint:this.#waypoint,
      onEditClick: ()=>{
        this.#handleEditClick();
      }
    });
    this.#eventFormComponent = new EventFormView({
      waypoint:this.#waypoint,
      formType,
      onSubmit:()=>{
        this.#replaceComponent('form');
      },
      onReset:()=>{
        this.#replaceComponent('form');
      },
    });

    render(this.#waypointComponent, this.#eventsContainer);
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
    }else{
      document.removeEventListener('keydown', this.#handleEscKeyDown);

    }
    replace(replacingComponent,replaceableComponent);
  };

  #handleEscKeyDown = (evt)=> {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#replaceComponent('form');
    }
  };

  #handleEditClick = ()=>{
    this.#replaceComponent('waypoint');
  };

}
