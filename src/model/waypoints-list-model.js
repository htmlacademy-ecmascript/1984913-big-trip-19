import { UpdateType } from '../consts.js';
import Observable from '../framework/observable.js';

export default class WaypointsListModel extends Observable{
  #waypointsApiService = null;
  #waypoints = [];
  #destinations = [];
  #offers = [];


  constructor({waypointsApiService}){
    super();
    this.#waypointsApiService = waypointsApiService;
  }

  get waypoints(){
    return this.#waypoints;
  }

  get destinations(){
    return this.#destinations;
  }

  get offers(){
    return this.#offers;
  }

  async init(){
    const waypointsData = await this.#waypointsApiService.waypoints;
    const destinationsData = await this.#waypointsApiService.destinations;
    const offersData = await this.#waypointsApiService.offers;
    try{
      this.#waypoints = waypointsData.map(this.#adaptToClient);
      this.#destinations = destinationsData;
      this.#offers = offersData;
    }catch(err){
      this.#waypoints = [];
      this.#destinations = [];
      this.#offers = [];
      this._notify(UpdateType.INIT_ERROR);
    }
    this._notify(UpdateType.INIT);
  }

  async addWaypoint(updateType, update){
    try {
      const response = await this.#waypointsApiService.addWaypoint(update);
      const newWaypoint = this.#adaptToClient(response);
      this.#waypoints = [
        newWaypoint,
        ...this.#waypoints,
      ];
      this._notify(updateType, newWaypoint);
    } catch(err) {
      throw new Error('Can\'t add new waypoint');
    }
  }

  async updateWaypoint(updateType, update){
    try {
      const response = await this.#waypointsApiService.updateWaypoint(update);
      const updatedWaypoint = this.#adaptToClient(response);
      const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);
      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        updatedWaypoint,
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType, updatedWaypoint);
    } catch(err) {
      throw new Error('Can\'t update waypoint');
    }
  }

  async deleteWaypoint(updateType, update){
    try {
      await this.#waypointsApiService.deleteWaypoint(update);
      const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

      this.#waypoints = [
        ...this.#waypoints.slice(0, index),
        ...this.#waypoints.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete waypoint');
    }
  }


  #adaptToClient(waypoint){
    const adaptedWaypoint = {...waypoint,
      dateTo:new Date(waypoint['date_to']),
      dateFrom: new Date (waypoint['date_from']),
      basePrice:waypoint['base_price'],
      isFavorite: waypoint['is_favorite']
    };
    delete adaptedWaypoint['date_to'];
    delete adaptedWaypoint['date_from'];
    delete adaptedWaypoint['base_price'];
    delete adaptedWaypoint['is_favorite'];

    return adaptedWaypoint;
  }

}
