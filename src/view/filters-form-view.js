import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = ({name, isDisabled}, isChecked)=>`
<div class="trip-filters__filter">
  <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isDisabled ? 'disabled' : ''} ${isChecked ? 'checked' : ''}>
  <label class="trip-filters__filter-label" for="filter-future">${name}</label>
</div>
`;

const createFiltersFormTemplate = (filters)=>{
  const filterTemplate = filters.map((filter, i)=> createFilterTemplate(filter, i === 0)).join('');
  return ` <form class="trip-filters" action="#" method="get">
${filterTemplate}
</form>`;};

export default class FiltersFormView extends AbstractView{
  #filters = null;

  constructor ({filters}){
    super();
    this.#filters = filters;
  }

  get template(){
    return createFiltersFormTemplate(this.#filters);
  }
}
