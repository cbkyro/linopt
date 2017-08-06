import PageManager from '../PageManager';
import FacetedSearch from './components/FacetedSearch';
import toggleFacetContainer from './components/toggleFacetContainer';
import Compare from './components/Compare';
import Loading from 'bc-loading';
import Tabs from 'bc-tabs';

export default class Search extends PageManager {
  constructor() {
    super();

    this.Loading = new Loading();
  }

  loaded() {
    new Compare({}, this.context);
    this.tabs = new Tabs({
      afterSetup: () => {
        this._clearLoadingTab();
      },
    });

    toggleFacetContainer();

    this._bindEvents();
  }

  _bindEvents() {
    this._initializeFacetedSearch(this.context.productsPerPage);
  }

  _initializeFacetedSearch(productsPerPage) {
    /*eslint-disable camelcase*/
    const facetedSearchOptions = {
      config: {
        product_results: {
          shop_by_price: true,
          limit: productsPerPage,
        },
      },
      template: {
        productListing: 'search/product-listing',
        header: 'search/header-sort',
        sidebar: 'search/sidebar',
        footer: 'search/product-footer',
      },
      showMore: 'search/show-more',
      callbacks: {
        willUpdate: () => {
          this.Loading.show();
        },
        didUpdate: () => {
          this.Loading.hide();
        },
      },
    };

    new FacetedSearch(facetedSearchOptions);
  }

  _clearLoadingTab() {
    $('[data-loading-tab]').toggleClass('active');
  }
}
