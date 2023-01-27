import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class WaypointsApiService extends ApiService {
  get waypoints() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  async updateWaypoint(waypoint) {
    const response = await this._load({
      url: `points/${waypoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(waypoint)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #adaptToServer(waypoint){
    const adaptedWaypoint = {...waypoint,
      'date_to':waypoint.dateTo.toISOString(),
      'date_from': waypoint.dateFrom.toISOString(),
      'base_price':waypoint.basePrice,
      'is_favorite': waypoint.isFavorite
    };
    delete adaptedWaypoint['dateTo'];
    delete adaptedWaypoint['dateFrom'];
    delete adaptedWaypoint['basePrice'];
    delete adaptedWaypoint['isFavorite'];

    return adaptedWaypoint;
  }
}
