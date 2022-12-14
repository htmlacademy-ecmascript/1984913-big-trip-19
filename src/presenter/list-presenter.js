import WaypointView from '../view/waypoint-view';
import FiltersView from '../view/filters-view';
import SortingView from '../view/sorting-view';
import EventFormView from '../view/event-form-view';
import EventsListView from '../view/events-list-view';
import { render, RenderPosition } from '../render';
export default class ListPresenter{
  eventsListComponent = new EventsListView();
  constructor({filtersContainer,eventsContainer, waypointsListModel }){
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
    this.waypointsListModel = waypointsListModel;
  }

  init(){
    this.waypoints = [...this.waypointsListModel.getWaypoints()];
    render(new FiltersView(), this.filtersContainer);
    render(new SortingView(), this.eventsContainer);
    render(new EventFormView({waypoint:this.waypoints[0]}), this.eventsListComponent.getElement(), RenderPosition.AFTERBEGIN);
    for(let i = 1; i < this.waypoints.length; i++){
      render(new WaypointView({waypoint:this.waypoints[i]}), this.eventsListComponent.getElement());
    }
    render(this.eventsListComponent, this.eventsContainer);
  }

}

