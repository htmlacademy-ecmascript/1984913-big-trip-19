import { EmptyListMessage, FilterType } from '../consts.js';
import AbstractView from '../framework/view/abstract-view.js';

const createEmptyListTemplate = (filterType)=>{
  let messageText = '';
  switch (filterType){
    case FilterType.PAST:
      messageText = EmptyListMessage.PAST;
      break;
    case FilterType.PRESENT:
      messageText = EmptyListMessage.PRESENT;
      break;
    case FilterType.FUTURE:
      messageText = EmptyListMessage.FUTURE;
      break;
    default:
      messageText = EmptyListMessage.EVERYTHING;
      break;
  }

  return `<p class="trip-events__msg">${messageText}</p>`;};

export default class EmptyListView extends AbstractView {
  #filterType = null;

  constructor({filterType}){
    super();
    this.#filterType = filterType;
  }

  get template(){
    return createEmptyListTemplate(this.#filterType);
  }
}
