import { nanoid } from 'nanoid';
import { getRandomArrayItem } from '../utils/common';

const mockOffers = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Rent a limo',
        price: 120
      },
      {
        id: 2,
        title: 'Order Uber',
        price: 20
      },
      {
        id: 3,
        title: 'Add luggage',
        price: 40
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 1,
        'title': 'Upgrade to a business class',
        'price': 120
      },
      {
        id: 2,
        title: 'Add meal',
        price: 10
      }
    ]
  },
  {
    type: 'bus',
    offers: []
  },
  {
    type: 'train',
    offers: []
  },
  {
    type: 'ship',
    offers: []
  },
  {
    type: 'drive',
    offers: []
  }
];


const destinations = [
  {
    'id': 1,
    'description': 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    'name': 'Chamonix',
    'pictures': [
      {
        'src': `http://picsum.photos/300/200?r=${Math.random()}`,
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
        'src': `http://picsum.photos/300/200?r=${Math.random()}`,
        'description': 'Amsterdam '
      },
      {
        'src': `http://picsum.photos/300/200?r=${Math.random()}`,
        'description': 'Amsterdam '
      },
    ]
  },
  {
    'id': 3,
    'description': 'Geneva, is a beautiful city.Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui',
    'name': 'Geneva',
    'pictures': [
      {
        'src': `http://picsum.photos/300/200?r=${Math.random()}`,
        'description': 'Geneva'
      }
    ]
  },
  {
    'id': 4,
    'description': 'Mont Blanc, is a beautiful city. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    'name': 'Mont Blanc',
    'pictures': []
  }];

const mockWaypoints = [
  {
    'basePrice': 1100,
    'dateFrom': new Date('2019-06-10T11:55'),
    'dateTo':  new Date('2019-06-11T15:22'),
    'destination': getRandomArrayItem(destinations).id,
    'isFavorite': false,
    'offers': [1,2],
    'type': 'taxi'
  },
  {
    'basePrice': 2200,
    'dateFrom': new Date('2024-07-11T10:10'),
    'dateTo': new Date('2024-07-11T15:07'),
    'destination': getRandomArrayItem(destinations).id,
    'isFavorite': true,
    'offers':  [2],
    'type': 'flight'
  },
  {
    'basePrice': 3500,
    'dateFrom': new Date('2019-08-12T08:35'),
    'dateTo': new Date('2019-08-12T19:45'),
    'destination': getRandomArrayItem(destinations).id,
    'isFavorite': false,
    'offers': [],
    'type': 'bus'
  },
  {
    'basePrice': 700,
    'dateFrom': new Date('2019-09-13T11:13'),
    'dateTo': new Date('2019-09-13T13:15'),
    'destination': getRandomArrayItem(destinations).id,
    'isFavorite': false,
    'offers':  [1],
    'type': 'flight'
  }
];

const getRandomWaypoint = ()=>({id:nanoid(), ...getRandomArrayItem(mockWaypoints)});

const getDestination = (id)=> destinations.find((destination)=>destination.id === id);

const getOffersByType = (type)=> mockOffers.find((offer) => type === offer.type);

const getCheckedOffers = (type, offers) => {
  const offersByType = getOffersByType(type);

  const checkedOffers = offersByType.offers?.filter((offer) =>
    offers
      .some((offerId) => offerId === offer.id));
  return checkedOffers;
};

const isOfferChecked = (pointOffers, offer)=> !!pointOffers.find((item)=> offer.id === item);

export {getRandomWaypoint, getDestination, getOffersByType, getCheckedOffers, mockOffers, isOfferChecked, destinations};
