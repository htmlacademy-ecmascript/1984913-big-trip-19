import AbstractView from '../framework/view/abstract-view.js';

const createAddWaypoinButtonTemplate = ()=>`
<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
`;

export default class AddWaypoinButtonView extends AbstractView {
  get template(){
    return createAddWaypoinButtonTemplate();
  }
}
