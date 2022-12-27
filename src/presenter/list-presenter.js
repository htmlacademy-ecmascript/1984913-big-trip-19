import SortView from '../view/sort-view';
import EventFormView from '../view/event-form-view';
import EventsListView from '../view/events-list-view';
import { render, RenderPosition, remove } from '../framework/render';
import TripInfoView from '../view/trip-info-view';
import { isEscapeKey } from '../utils/common.js';
import ListEmptyView from '../view/list-empty-view';
import AddWaypoinButtonView from '../view/add-waypoint-button-view';
import WaypointPresenter from './waypoint-presenter';
export default class ListPresenter{
  #headerContainer = null;
  #eventsContainer = null;
  #waypointsListModel = null;

  #filterType = null;

  #eventsListComponent = new EventsListView();
  #sortComponent = new SortView();
  #emptyListComponent = new ListEmptyView(this.#filterType);
  #tripInfoComponent = new TripInfoView();

  #waypoints = null;

  constructor({headerContainer, eventsContainer, waypointsListModel }){
    this.#headerContainer = headerContainer;
    this.#eventsContainer = eventsContainer;
    this.#waypointsListModel = waypointsListModel;
    this.#filterType = '';
  }

  init(){
    this.#waypoints = [...this.#waypointsListModel.waypoints];
    this.#renderAddFormButton();
    this.#renderSort();
    if(this.#waypoints.length > 0){
      this.#renderTripInfo();
      for(let i = 0; i < this.#waypoints.length; i++){
        this.#renderWaypoint(this.#waypoints[i]);
      }
    } else{
      this.#renderEmptyList();
    }
    this.#renderEventsList();
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

  #renderWaypoint(waypoint){
    const waypointPresenter = new WaypointPresenter({
      eventsContainer:this.#eventsListComponent.element,
    });
    waypointPresenter.init(waypoint);
  }

  #renderEmptyList(){
    render(this.#emptyListComponent, this.#eventsContainer);
  }

  #renderSort(){
    render(this.#sortComponent, this.#eventsContainer);
  }

  #renderTripInfo(){
    render(this.#tripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  }

  #renderEventsList(){
    render(this.#eventsListComponent, this.#eventsContainer);
  }
}

