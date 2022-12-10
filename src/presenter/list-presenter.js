import WaypointView from '../view/waypoint-view';
import FiltersView from '../view/filters-view';
import SortingView from '../view/sorting-view';
import EditFormView from '../view/edit-form-view';
import EventsListView from '../view/events-list-view';
import { render, RenderPosition } from '../render';

const WAYPOINTS_AMOUNT = 3;

export default class ListPresenter{
  eventsListComponent = new EventsListView();
  constructor({filtersContainer,eventsContainer }){
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
  }

  init(){
    render(new FiltersView(), this.filtersContainer);
    render(new SortingView(), this.eventsContainer);
    render(new EditFormView(), this.eventsListComponent.getElement(), RenderPosition.AFTERBEGIN);
    for(let i = 0; i < WAYPOINTS_AMOUNT; i++){
      render(new WaypointView(), this.eventsListComponent.getElement());
    }
    render(this.eventsListComponent, this.eventsContainer);
  }

}

