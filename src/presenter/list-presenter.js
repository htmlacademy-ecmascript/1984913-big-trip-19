import SortView from '../view/sort-view';
import EventFormView from '../view/event-form-view';
import EventsListView from '../view/events-list-view';
import { render, RenderPosition, remove } from '../framework/render';
import TripInfoView from '../view/trip-info-view';
import { isEscapeKey, updateItem } from '../utils/common.js';
import ListEmptyView from '../view/list-empty-view';
import AddWaypoinButtonView from '../view/add-waypoint-button-view';
import WaypointPresenter from './waypoint-presenter';
import { SortType, WAYPOINTS_AMOUNT } from '../consts';
import { sortWaypointByPrice, sortWaypontByTime, sortWaypointByDay } from '../utils/waypoint';
export default class ListPresenter{
  #headerContainer = null;
  #eventsContainer = null;
  #waypointsListModel = null;

  #filterType = null;

  #eventsListComponent = new EventsListView();
  #sortComponent = null;
  #emptyListComponent = new ListEmptyView(this.#filterType);
  #tripInfoComponent = new TripInfoView();

  #waypoints = [];
  #waypointPresenter = new Map();
  #currentSortType = SortType.DAY;

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

  #handleStatusChange = ()=>{
    this.#waypointPresenter.forEach((presenter)=> presenter.resetView());
  };

  #handleDataChange = (updatedWaypoint) => {
    this.#waypoints = updateItem(this.#waypoints, updatedWaypoint);
    this.#waypointPresenter.get(updatedWaypoint.id).init(updatedWaypoint);
  };

  #renderWaypoint(waypoint){
    const waypointPresenter = new WaypointPresenter({
      eventsContainer:this.#eventsListComponent.element,
      onStatusChange:this.#handleStatusChange,
      onDataChange: this.#handleDataChange
    });
    waypointPresenter.init(waypoint);
    this.#waypointPresenter.set(waypoint.id, waypointPresenter);
  }

  #renderWaypoints(from, to){
    this.#waypoints.slice(from, to).forEach((waypoint)=>this.#renderWaypoint(waypoint));
  }


  #renderEmptyList(){
    render(this.#emptyListComponent, this.#eventsContainer);
  }

  #sortWaypoints = (sortType)=>{
    switch (sortType) {
      case SortType.TIME:
        this.#waypoints.sort(sortWaypontByTime);
        break;
      case SortType.PRICE:
        this.#waypoints.sort(sortWaypointByPrice);
        break;
      default:
        this.#waypoints.sort(sortWaypointByDay);
        break;
    }
    this.#currentSortType = sortType;
  };

  #handleSortTypeChange = (sortType)=>{
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#sortWaypoints(sortType);
    this.#clearEventsList();
    this.#renderEventsList();
  };

  #renderSort(){
    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange});
    this.#sortWaypoints(this.#currentSortType);
    render(this.#sortComponent, this.#eventsContainer);
  }

  #renderTripInfo(){
    render(this.#tripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  }

  #renderEventsList(){
    render(this.#eventsListComponent, this.#eventsContainer);
    this.#renderWaypoints(0, WAYPOINTS_AMOUNT);
  }

  #clearEventsList(){
    this.#waypointPresenter.forEach((presenter)=> presenter.destroy());
    this.#waypointPresenter.clear();
  }
}

