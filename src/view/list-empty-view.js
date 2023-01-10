import { EmptyListMessage } from '../consts.js';
import AbstractView from '../framework/view/abstract-view.js';

const createListEmptyTemplate = (filterType)=>{
  let messageText = '';
  switch (filterType){
    case 'past':
      messageText = EmptyListMessage.PAST;
      break;
    case 'present':
      messageText = EmptyListMessage.PRESENT;
      break;
    case 'future':
      messageText = EmptyListMessage.FUTURE;
      break;
    default:
      messageText = EmptyListMessage.EVERYTHING;
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
