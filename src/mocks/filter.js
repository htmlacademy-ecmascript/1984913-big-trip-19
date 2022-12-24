import {filter} from '../utils/filter.js';

const createFilter = (waypoints)=> Object.entries(filter).map(
  ([filterName, filterWaypoints]) => ({
    name: filterName,
    isDisabled:!(filterWaypoints(waypoints).length > 0)
  }),
);

export {createFilter};
