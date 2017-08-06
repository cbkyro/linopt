import { hooks, api } from '@bigcommerce/stencil-utils';
import Url from 'url';

export default class FacetedSearch {
  constructor(options) {
    this.$body = $(document.body);

    /* eslint-disable camelcase*/
    this.options = $.extend({
      config: {
        shop_by_brand: true,
      },
      template: {
        productListing: 'category/product-listing',
        sidebar: 'category/sidebar',
      },
      scope: {
        productListing: '[data-collection]',
        header: '[data-collection-sort]',
        sidebar: '[data-collection-facets]',
        footer: '[data-collection-footer]',
      },
      showMore: null,
      facetToggle: '[data-facet-toggle]',
      moreToggle: '[data-additional-facets]',
      toggleFacet: () => {},
    }, options);

    this.callbacks = $.extend({
      willUpdate: () => {},
      didUpdate: () => {},
    }, options.callbacks);

    this._bindEvents();
  }

  _bindEvents() {
    this.$body.on('click', this.options.facetToggle, (event) => {
      this._toggleFacet(event);
    });

    this.$body.on('click', this.options.moreToggle, (event) => {
      this._showAdditionalFilters(event);
    });

    $(window).on('statechange', this._onStateChange.bind(this));
    hooks.on('facetedSearch-facet-clicked', this._onFacetClick.bind(this));
    hooks.on('facetedSearch-range-submitted', this._onRangeSubmit.bind(this));
    hooks.on('sortBy-submitted', this._onSortBySubmit.bind(this));
  }

  _showAdditionalFilters(event) {
    event.preventDefault();

    const $toggle = $(event.currentTarget);
    const facet = $toggle.data('additional-facets');
    const $navList = $(`[data-facet-name="${facet}"]`);
    const $container = $navList.parent('[data-facet-filter-wrapper]');
    const facetUrl = History.getState().url;

    const options = {
      template: this.options.showMore,
      params: {
        list_all: facet,
      },
    };

    if (!$container.find('[data-additional-facets-list]').length) {
      this.callbacks.willUpdate();
      const blocker = true;

      api.getPage(facetUrl, options, (err, response) => {
        if (err) {
          throw new Error(err);
        }

        $(response).insertAfter($navList);
        this._toggleFacetLists({$container, $navList, $toggle}, blocker);
      });
    } else {
      this._toggleFacetLists({$container, $navList, $toggle});
    }
  }

  _toggleFacetLists($els, blocker = false) {
    const {$container, $navList, $toggle} = $els;

    // Hide original list
    $navList.toggle();

    // Toggle new list
    $container
      .find('[data-additional-facets-list]')
      .toggle();

    // Toggle more/less link
    $toggle.children().toggle();

    if (blocker) {
      this.callbacks.didUpdate();
    }
  }

  _toggleFacet(event) {
    this.options.toggleFacet(event);
  }

  _onFacetClick(event) {
    event.preventDefault();

    const $target = $(event.currentTarget);
    const url = $target.attr('href');

    if(typeof $target.attr('data-go-to-url') !== 'undefined'){
      this._goToUrl(url);
    }else{
      this._getURL(url);
    }
  }

  _onRangeSubmit(event) {
    event.preventDefault();

    const url = Url.parse(location.href);
    let queryParams = $(event.currentTarget).serialize();

    if (this.$body.hasClass('template-search')) {
      const currentSearch = `search_query=${$('[data-faceted-search]').data('search-query')}` || '';
      queryParams = `${queryParams}&${currentSearch}`;
    }

    this._getURL(Url.format({ pathname: url.pathname, search: `'?${queryParams}` }));
  }

  _onSortBySubmit(event) {
    event.preventDefault();

    const url = Url.parse(location.href, true);
    const queryParams = $(event.currentTarget).serialize().split('=');

    url.query[queryParams[0]] = queryParams[1];
    delete url.query['page'];

    this._getURL(Url.format({ pathname: url.pathname, query: url.query }));
  }

  _onStateChange() {
    this._getURL(History.getState().url);
  }

  _getURL(url){
    this.callbacks.willUpdate();
    History.pushState({}, document.title, url);

    api.getPage(url, this.options, (err, content) => {
      if (err) {
        this.callbacks.didUpdate();
        throw new Error(err);
      }

      if (content) {
        $(this.options.scope.productListing).html(content.productListing);
        $(this.options.scope.sidebar).html(content.sidebar);
        $(this.options.scope.footer).html(content.footer);
        $(this.options.scope.header).html(content.header);
        this.callbacks.didUpdate();
      }
    });
  }

  _goToUrl(url) {
    window.location = url;
  }
}
