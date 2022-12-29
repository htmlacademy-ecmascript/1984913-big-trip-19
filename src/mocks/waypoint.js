import { nanoid } from 'nanoid';
import { WAYPOINT_TYPES } from '../consts';
import { getRandomArrayItem } from '../utils/common';

const mockOffers = [{
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
    'description': 'Mont Blanc, is a beautiful city. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
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
    'basePrice': 1100,
    'dateFrom': new Date('2019-06-10T11:55'),
    'dateTo':  new Date('2019-06-11T15:22'),
    'destination': getRandomArrayItem(destinations).id,
    'isFavorite': false,
    'offers': [getRandomArrayItem(mockOffers).id, getRandomArrayItem(mockOffers).id],
    'type': getRandomArrayItem(WAYPOINT_TYPES)
  },
  {
    'basePrice': 2200,
    'dateFrom': new Date('2019-07-11T10:10'),
    'dateTo': new Date('2019-07-11T15:07'),
    'destination': getRandomArrayItem(destinations).id,
    'isFavorite': true,
    'offers':  [getRandomArrayItem(mockOffers).id],
    'type': getRandomArrayItem(WAYPOINT_TYPES)
  },
  {
    'basePrice': 3500,
    'dateFrom': new Date('2019-08-12T08:35'),
    'dateTo': new Date('2019-08-12T19:45'),
    'destination': getRandomArrayItem(destinations).id,
    'isFavorite': false,
    'offers': [ getRandomArrayItem(mockOffers).id],
    'type': getRandomArrayItem(WAYPOINT_TYPES)
  },
  {
    'basePrice': 700,
    'dateFrom': new Date('2019-09-13T11:13'),
    'dateTo': new Date('2019-09-13T13:15'),
    'destination': getRandomArrayItem(destinations).id,
    'isFavorite': false,
    'offers':  [getRandomArrayItem(mockOffers).id],
    'type': getRandomArrayItem(WAYPOINT_TYPES)
  }
];

const getRandomWaypoint = ()=> ({id:nanoid(), ...getRandomArrayItem(mockWaypoints)});

const getDestination = (id)=> destinations.find((destination)=>destination.id === id);

const getOffer = (id)=> mockOffers.find((offer)=>offer.id === id);

const isOfferChecked = (pointOffers, offer)=> !!pointOffers.find((item)=> offer.id === item);

export {getRandomWaypoint, getDestination, getOffer, mockOffers, isOfferChecked};
