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
    }
    this._notify(UpdateType.INIT);
  }

  addWaypoint(updateType, update){
    this.#waypoints = [
      update,
      ...this.#waypoints,
    ];

    this._notify(updateType, update);
  }

  async updateWaypoint(updateType, update){
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    try {
      const response = await this.#waypointsApiService.updateWaypoint(update);
      const updatedWaypoint = this.#adaptToClient(response);
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

  deleteWaypoint(updateType, update){
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting waypoint');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType);
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

  get destinations(){
    return this.#destinations;
  }

  get offers(){
    return this.#offers;
  }

}
