import {remove, render, RenderPosition} from '../framework/render.js';
import TripInfoView from '../view/trip-info-view';

export default class TripInfoPresenter {
  #headerContainer = null;
  #waypointsListModel = null;
  #tripInfoComponent = null;

  constructor ({headerContainer, waypointsListModel}) {
    this.#headerContainer = headerContainer;
    this.#waypointsListModel = waypointsListModel;

    this.#waypointsListModel.addObserver(this.#handleModelEvent);
  }

  get waypoints(){
    return this.#waypointsListModel.waypoints;
  }

  get destinations (){
    return this.#waypointsListModel.destinations;
  }

  get offers (){
    return this.#waypointsListModel.offers;
  }

  init = () => {
    if(!this.waypoints || !this.waypoints.length){
      return'';
    }
    this.#tripInfoComponent = new TripInfoView(this.waypoints, this.destinations, this.offers);

    render(this.#tripInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
  };

  #handleModelEvent = () => {
    remove(this.#tripInfoComponent);
    this.init();
  };

}
