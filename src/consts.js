const WAYPOINTS_AMOUNT = 4;
const WAYPOINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const DATE_FORMAT = 'MMM D';
const TIME_FORMAT = 'HH:mm';

const BLANK_WAYPOINT = {
  'base_price': '',
  'date_from': '',
  'date_to': '',
  'destination': '',
  'id': '',
  'is_favorite': false,
  'offers': [],
  'type': ''
};


export {WAYPOINTS_AMOUNT, WAYPOINT_TYPES, DATE_FORMAT, TIME_FORMAT, BLANK_WAYPOINT};
