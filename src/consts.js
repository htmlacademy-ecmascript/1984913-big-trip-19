const WAYPOINTS_AMOUNT = 4;
const WAYPOINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DEFAULT_POINT_TYPE = 'taxi';
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

const BLANK_WAYPOINT = {
  'basePrice': '',
  'dateFrom': '',
  'dateTo': '',
  'destination': '',
  'id': '',
  'isFavorite': false,
  'offers': [],
  'type': ''
};


export {WAYPOINTS_AMOUNT, WAYPOINT_TYPES, BLANK_WAYPOINT,DEFAULT_POINT_TYPE,WaypointStatus, FormatPattern, FilterType};
