import AbstractView from '../framework/view/abstract-view.js';

const createListEmptyTemplate = (filterType)=>{
  let messageText = '';
  switch (filterType){
    case 'past':
      messageText = 'There are no past events now';
      break;
    case 'present':
      messageText = 'There are no present events now';
      break;
    case 'future':
      messageText = 'There are no future events now';
      break;
    default:
      messageText = 'Click New Event to create your first point';
      break;
  }

  return `<p class="trip-events__msg">${messageText}</p>`;};

export default class ListEmptyView extends AbstractView {
  #filterType = null;

  constructor(filterType = 'everything'){
    super();
    this.#filterType = filterType;
  }

  get template(){
    return createListEmptyTemplate(this.#filterType);
  }
}
