import PageManager from '../PageManager';
import FacetedSearch from './components/FacetedSearch';
import toggleFacetContainer from './components/toggleFacetContainer';
import Compare from './components/Compare';
import Loading from 'bc-loading';

export default class Category extends PageManager {
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
        shop_by_brand: true,
        category: {
          shop_by_price: true,
          products: {
            limit: productsPerPage,
          },
        },
      },
      template: {
        productListing: 'category/product-listing',
        header: 'category/header',
        sidebar: 'category/sidebar',
        footer: 'category/footer',
      },
      showMore: 'category/show-more',
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
