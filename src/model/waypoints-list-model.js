import Observable from '../framework/observable.js';
import { WAYPOINTS_AMOUNT } from '../consts';
import { getRandomWaypoint, destinations } from '../mocks/waypoint';

export default class WaypointsListModel extends Observable{
  #waypoints = Array.from({length:WAYPOINTS_AMOUNT}, getRandomWaypoint);

  get waypoints(){
    return this.#waypoints;
  }

  addWaypoint(updateType, update){
    this.#waypoints = [
      update,
      ...this.#waypoints,
    ];

    this._notify(updateType, update);
  }

  updateWaypoint(updateType, update){
    const index = this.#waypoints.findIndex((waypoint) => waypoint.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting waypoint');
    }

    this.#waypoints = [
      ...this.#waypoints.slice(0, index),
      update,
      ...this.#waypoints.slice(index + 1),
    ];

    this._notify(updateType, update);

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

  get destinations(){
    return destinations;
  }

}
