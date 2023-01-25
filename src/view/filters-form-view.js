import AbstractView from '../framework/view/abstract-view.js';

const createFilterTemplate = ({type, name, isDisabled}, currentFilterType)=>`
<div class="trip-filters__filter">
  <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isDisabled ? 'disabled' : ''} ${type === currentFilterType ? 'checked' : ''}>
  <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
</div>
`;

const createFiltersFormTemplate = (filters, currentFilterType)=>{
  const filterTemplate = filters.map((filter)=> createFilterTemplate(filter, currentFilterType)).join('');
  return ` <form class="trip-filters" action="#" method="get">
${filterTemplate}
</form>`;};

export default class FiltersFormView extends AbstractView{
  #filters = null;
  #currentFilterType = null;
  #handleFilterTypeChange = null;

  constructor ({filters, currentFilterType, onFilterTypeChange}){
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;

    this.#handleFilterTypeChange = onFilterTypeChange;

    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template(){
    return createFiltersFormTemplate(this.#filters, this.#currentFilterType);
  }

  #filterTypeChangeHandler = (evt)=>{
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
