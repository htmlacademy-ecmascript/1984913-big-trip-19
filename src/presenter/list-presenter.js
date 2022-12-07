import WaypointView from '../view/waypoint-view';
import FiltersView from '../view/filters-view';
import SortingView from '../view/sorting-view';
import EditFormView from '../view/edit-form-view';
import EventsListView from '../view/events-list-view';
import { render } from '../render';

export default class ListPresenter{
  eventsListComponent = new EventsListView();
  constructor({filtersContainer,eventsContainer }){
    this.filtersContainer = filtersContainer;
    this.eventsContainer = eventsContainer;
  }

  init(){
    render(new FiltersView(), this.filtersContainer);
    render(new SortingView(), this.eventsContainer);
    render(this.eventsListComponent, this.eventsContainer);
    render(new EditFormView(), this.eventsListComponent.getElement());
    for(let i = 0; i < 3; i++){
      render(new WaypointView(), this.eventsListComponent.getElement());}
  }

}
