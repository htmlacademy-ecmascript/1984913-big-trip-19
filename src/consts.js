const WAYPOINTS_AMOUNT = 4;
const WAYPOINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DEFAULT_POINT_TYPE = 'taxi';
const FormatPattern = {
  DATE:'MMM D',
  TIME:'HH:mm',
  DATETIME:'DD/MM/YY HH:mm',
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


export {WAYPOINTS_AMOUNT, WAYPOINT_TYPES, BLANK_WAYPOINT,DEFAULT_POINT_TYPE, FormatPattern};
