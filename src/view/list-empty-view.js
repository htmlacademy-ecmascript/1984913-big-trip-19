import {createElement} from '../render.js';

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

export default class ListEmptyView {
  #element = null;
  #filterType=null;

  constructor(filterType='everything'){
    this.#filterType = filterType;
  }

  get template(){
    return createListEmptyTemplate(this.#filterType);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
