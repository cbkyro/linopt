import PageManager from '../PageManager';
import FacetedSearch from './components/FacetedSearch';
import toggleFacetContainer from './components/toggleFacetContainer';
import Compare from './components/Compare';
import Loading from 'bc-loading';

export default class Brand extends PageManager {
  constructor() {
    super();

    this.Loading = new Loading();
  }

  loaded() {
    new Compare({}, this.context);

    this._initializeFacetedSearch(this.context.productsPerPage);

    toggleFacetContainer();
  }

  _initializeFacetedSearch(productsPerPage) {
    /*eslint-disable camelcase*/
    const facetedSearchOptions = {
      config: {
        brand: {
          products: {
            limit: productsPerPage,
          },
        },
        shop_by_brand: true,
      },
      template: {
        productListing: 'brand/product-listing',
        header: 'brand/header',
        sidebar: 'brand/sidebar',
        footer: 'brand/footer',
      },
      showMore: 'brand/show-more',
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
}
