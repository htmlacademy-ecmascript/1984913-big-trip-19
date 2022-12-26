import WaypointView from '../view/waypoint-view';
import SortView from '../view/sort-view';
import EventFormView from '../view/event-form-view';
import EventsListView from '../view/events-list-view';
import { render, RenderPosition, remove, replace } from '../framework/render';
import TripInfoView from '../view/trip-info-view';
import { isEscapeKey } from '../utils/common.js';
import ListEmptyView from '../view/list-empty-view';
import AddWaypoinButtonView from '../view/add-waypoint-button-view';
export default class ListPresenter{
  #headerContainer = null;
  #eventsContainer = null;
  #waypointsListModel = null;

  #eventsListComponent = new EventsListView();

  #waypoints = null;

  constructor({headerContainer, eventsContainer, waypointsListModel }){
    this.#headerContainer = headerContainer;
    this.#eventsContainer = eventsContainer;
    this.#waypointsListModel = waypointsListModel;
    this.filterType = '';
  }

  init(){
    this.#waypoints = [...this.#waypointsListModel.waypoints];
    render(new SortView(), this.#eventsContainer);
    this.#renderAddFormButton();
    if(this.#waypoints.length > 0){
      render(new TripInfoView(), this.#headerContainer, RenderPosition.AFTERBEGIN);
      for(let i = 0; i < this.#waypoints.length; i++){
        this.#renderWaypoints(this.#waypoints[i], i);
      }
    } else{
      render(new ListEmptyView(this.filterType), this.#eventsContainer);
    }
    render(this.#eventsListComponent, this.#eventsContainer);
  }

  #renderAddFormButton (){
    const formType = 'add';
    const eventFormComponent = new EventFormView({
      formType,
      onSubmit:()=>{
        removeAddForm.call(this);
        document.removeEventListener('keydown', handleEscKeyDown);
      },
      onReset:()=>{
        removeAddForm.call(this);
        document.removeEventListener('keydown', handleEscKeyDown);
      },
    });
    function removeAddForm (){
      remove(eventFormComponent);
    }
    function handleEscKeyDown (evt) {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        removeAddForm.call(this);
        document.removeEventListener('keydown', handleEscKeyDown);
      }
    }
    const addWaypointButton = new AddWaypoinButtonView({onAddClick: ()=>{
      this.#renderAddForm(eventFormComponent);
      document.addEventListener('keydown', handleEscKeyDown);
    }});
    render(addWaypointButton, this.#headerContainer, RenderPosition.BEFOREEND);
  }

  #renderAddForm(eventFormComponent){
    render (eventFormComponent, this.#eventsListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderWaypoints(waypoint, waypointIndex){
    const formType = 'edit';

    const waypointComponent = new WaypointView({
      waypoint,
      onEditClick: ()=>{
        replaceComponent.call(this, 'waypoint');
        document.addEventListener('keydown', handleEscKeyDown);
      }
    });

    const eventFormComponent = new EventFormView({
      waypoint,
      waypointIndex,
      formType,
      onSubmit:()=>{
        replaceComponent.call(this, 'form');
        document.removeEventListener('keydown', handleEscKeyDown);
      },
      onReset:()=>{
        replaceComponent.call(this, 'form');
        document.removeEventListener('keydown', handleEscKeyDown);
      },
    });

    function replaceComponent (componentType) {
      const replacingComponent = componentType === 'waypoint'
        ? eventFormComponent
        : waypointComponent;
      const replaceableComponent = componentType === 'waypoint'
        ? waypointComponent
        : eventFormComponent;
      replace(replacingComponent,replaceableComponent);
    }

    function handleEscKeyDown (evt) {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceComponent.call(this, waypointComponent.element, eventFormComponent.element);
        document.removeEventListener('keydown', handleEscKeyDown);
      }
    }

    render(waypointComponent, this.#eventsListComponent.element);
  }
}

