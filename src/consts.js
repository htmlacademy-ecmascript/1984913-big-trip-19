const WAYPOINTS_AMOUNT = 4;
const WAYPOINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DEFAULT_POINT_TYPE = 'taxi';
const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';
const EDIT_DATETIME_FORMAT = 'DD/MM/YY HH:mm';

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


export {WAYPOINTS_AMOUNT, WAYPOINT_TYPES, DATE_FORMAT, TIME_FORMAT, BLANK_WAYPOINT,DEFAULT_POINT_TYPE, EDIT_DATETIME_FORMAT};
