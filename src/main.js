
import ListPresenter from './presenter/list-presenter.js';

const filtersContainer = document.querySelector('.trip-controls__filters');
const eventsContainer = document.querySelector('.trip-events');

const listPresenter = new ListPresenter({filtersContainer,eventsContainer });
listPresenter.init();
