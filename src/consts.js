const WAYPOINTS_AMOUNT = 4;
const WAYPOINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DEFAULT_POINT_TYPE = 'taxi';

const FormType = {
  ADDING: 'adding',
  EDITING: 'editing',
};
const WaypointStatus = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

const FormatPattern = {
  DATE:'MMM D',
  TIME:'HH:mm',
  DATETIME:'DD/MM/YY HH:mm',
};

const FilterType = {
  EVERYTHING:'everything',
  FUTURE:'future',
  PRESENT:'present',
  PAST:'past',
};

const EmptyListMessage = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now',
};

const SortType = {
  DAY:'day',
  TIME:'time',
  PRICE:'price',
};

const BLANK_WAYPOINT = {
  'basePrice': '',
  'dateFrom': '',
  'dateTo': '',
  'destination': '',
  'isFavorite': false,
  'offers': [],
  'type':  DEFAULT_POINT_TYPE
};


const UserAction = {
  UPDATE_WAYPOINT: 'UPDATE_WAYPOINT',
  ADD_WAYPOINT: 'ADD_WAYPOINT',
  DELETE_WAYPOINT: 'DELETE_WAYPOINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};


export {WAYPOINTS_AMOUNT, WAYPOINT_TYPES, BLANK_WAYPOINT,DEFAULT_POINT_TYPE,WaypointStatus, FormatPattern, FilterType, SortType, EmptyListMessage, UserAction,UpdateType, FormType };
