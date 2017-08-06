export default function toggleFacetContainer() {

  $(document.body).on('click', '[data-faceted-search-toggle]', (event) => {
    event.preventDefault();

    const $toggle = $(event.target).closest('[data-faceted-search-toggle]');
    const $el = $('[data-collection-facets]');

    $el.toggleClass('facets-open');

    if ($el.hasClass('facets-open')) {
      $toggle.addClass('toggle-icon');
    } else {
      $toggle.removeClass('toggle-icon');
    }
  });
}
