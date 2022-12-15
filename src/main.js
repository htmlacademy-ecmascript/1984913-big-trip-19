import ListPresenter from './presenter/list-presenter.js';
import WaypointsListModel from './model/waypoints-list-model.js';

const headerContainer = document.querySelector('.trip-main');
const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');
const waypointsListModel = new WaypointsListModel();

const listPresenter = new ListPresenter( {headerContainer, filtersContainer,eventsContainer, waypointsListModel });
listPresenter.init();
