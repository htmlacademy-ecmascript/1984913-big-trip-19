import WaypointView from '../view/waypoint-view';
import SortView from '../view/sort-view';
import EventFormView from '../view/event-form-view';
import EventsListView from '../view/events-list-view';
import { render, RenderPosition } from '../render';
import TripInfoView from '../view/trip-info-view';
import { isEscapeKey } from '../utils';
import ListEmptyView from '../view/list-empty-view';
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
    if(this.#waypoints.length > 0){
      render(new TripInfoView(), this.#headerContainer, RenderPosition.AFTERBEGIN);
      for(let i = 0; i < this.#waypoints.length; i++){
        this.#renderWaypoints(this.#waypoints[i]);
      }
    } else{
      render(new ListEmptyView(this.filterType), this.#eventsContainer);
    }
    render(this.#eventsListComponent, this.#eventsContainer);
  }

  #renderWaypoints(waypoint){
    const formType = 'edit';
    const waypointComponent = new WaypointView({waypoint});
    const eventFormComponent = new EventFormView({waypoint, formType});

    const replaceComponent = (replacingComponent, replaceableComponent)=>{
      this.#eventsListComponent.element.replaceChild(replacingComponent,replaceableComponent);
    };

    const handleEscKeyDown = (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        replaceComponent(waypointComponent.element, eventFormComponent.element);
        document.removeEventListener('keydown', handleEscKeyDown);
      }
    };

    waypointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', ()=>{
      replaceComponent(eventFormComponent.element, waypointComponent.element);
      document.addEventListener('keydown', handleEscKeyDown);
    });

    eventFormComponent.element.querySelector('.event__rollup-btn').addEventListener('click', ()=>{
      replaceComponent( waypointComponent.element, eventFormComponent.element);
      document.removeEventListener('keydown', handleEscKeyDown);
    });

    eventFormComponent.element.querySelector('.event--edit').addEventListener('submit', (evt)=>{
      evt.preventDefault();
      replaceComponent( waypointComponent.element, eventFormComponent.element);
      document.removeEventListener('keydown', handleEscKeyDown);
    });

    eventFormComponent.element.querySelector('.event--edit').addEventListener('reset', ()=>{
      replaceComponent( waypointComponent.element, eventFormComponent.element);
      document.removeEventListener('keydown', handleEscKeyDown);
    });

    render(waypointComponent, this.#eventsListComponent.element);
  }
}

