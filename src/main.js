import ListPresenter from './presenter/list-presenter.js';
import WaypointsListModel from './model/waypoints-list-model.js';
import FiltersPresenter from './presenter/filters-presenter.js';
import AddWaypoinButtonView from './view/add-waypoint-button-view.js';
import { render, RenderPosition } from './framework/render.js';
import FiltersModel from './model/filters-model.js';
import WaypointsApiService from './waypoints-api-service.js';
import { ApiData } from './consts.js';


const headerContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const waypointsListModel = new WaypointsListModel({
  waypointsApiService: new WaypointsApiService(ApiData.END_POINT, ApiData.AUTHORIZATION)
});
const filtersModel = new FiltersModel();

const filtersPresenter = new FiltersPresenter( {filtersContainer, filtersModel, waypointsListModel });
const listPresenter = new ListPresenter( {headerContainer, eventsContainer, filtersModel,waypointsListModel, onNewWaypointDestroy:handleNewEventFormClose });

const addWaypointButtonComponent = new AddWaypoinButtonView({onAddClick: handleAddWaypoinButtonClick});
function handleAddWaypoinButtonClick (){
  listPresenter.createWaypoint();
  addWaypointButtonComponent.element.disabled = true;
}
function handleNewEventFormClose (){
  addWaypointButtonComponent.element.disabled = false;
}
render (addWaypointButtonComponent, headerContainer, RenderPosition.BEFOREEND);


filtersPresenter.init();
listPresenter.init();
waypointsListModel.init();
