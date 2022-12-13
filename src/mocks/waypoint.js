import { WAYPOINT_TYPES } from '../consts';
import { getRandomArrayItem } from '../utils';

const offers = [{
  'id': 1,
  'title': 'Upgrade to a business class',
  'price': 120
}, {
  'id': 2,
  'title': 'Order Uber',
  'price': 20
}, {
  'id': 3,
  'title': 'Rent a car',
  'price': 300
}, {
  'id': 4,
  'title': 'Add luggage',
  'price': 70
}];

const destinations = [
  {
    'id': 1,
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': 'http://picsum.photos/300/200?r=0.0762563005163317',
        'description': 'Chamonix parliament building'
      }
    ]
  },
  {
    'id': 2,
    'description': 'Amsterdam, is a beautiful city. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
    'name': 'Amsterdam',
    'pictures': [
      {
        'src': 'https://loremflickr.com/248/152?random=125',
        'description': 'Amsterdam '
      }
    ]
  },
  {
    'id': 3,
    'description': 'Geneva, is a beautiful city.Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui',
    'name': 'Geneva',
    'pictures': [
      {
        'src': 'https://loremflickr.com/248/152?random=320',
        'description': 'Geneva'
      }
    ]
  },
  {
    'id': 4,
    'description': 'Geneva, is a beautiful city. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    'name': 'Mont Blanc',
    'pictures': [
      {
        'src': 'https://loremflickr.com/248/152?random=740',
        'description': 'Mont Blanc'
      }
    ]
  }];

const mockWaypoints = [
  {
    'base_price': 1100,
    'date_from': '2019-06-10T11:55:56.845Z',
    'date_to': '2019-06-11T15:22:13.375Z',
    'destination': getRandomArrayItem(destinations),
    'id': '0',
    'is_favorite': false,
    'offers': [getRandomArrayItem(offers)],
    'type': getRandomArrayItem(WAYPOINT_TYPES)
  },
  {
    'base_price': 2200,
    'date_from': '2019-07-11T10:10:56.845Z',
    'date_to': '2019-07-11T15:07:13.375Z',
    'destination': getRandomArrayItem(destinations),
    'id': '1',
    'is_favorite': true,
    'offers':  [getRandomArrayItem(offers)],
    'type': getRandomArrayItem(WAYPOINT_TYPES)
  },
  {
    'base_price': 3500,
    'date_from': '2019-08-12T08:35:56.845Z',
    'date_to': '2019-08-12T19:45:13.375Z',
    'destination': getRandomArrayItem(destinations),
    'id': '2',
    'is_favorite': false,
    'offers': [ getRandomArrayItem(offers)],
    'type': getRandomArrayItem(WAYPOINT_TYPES)
  },
  {
    'base_price': 700,
    'date_from': '2019-09-13T11:13:56.845Z',
    'date_to': '2019-09-13T13:15:13.375Z',
    'destination': getRandomArrayItem(destinations),
    'id': '3',
    'is_favorite': false,
    'offers':  [getRandomArrayItem(offers)],
    'type': getRandomArrayItem(WAYPOINT_TYPES)
  }
];

const getRandomWaypoint = ()=> getRandomArrayItem(mockWaypoints);

export {getRandomWaypoint};
