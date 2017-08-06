import utils from '@bigcommerce/stencil-utils';

export default function(didUpdate, remove) {
  const $cartTotals = $('[data-cart-totals]');
  const $cartContent = $('[data-cart-content]');
  const $cartActions = $('[data-cart-actions]');
  const options = {
    template: {
      content: 'cart/content',
      totals: 'cart/totals',
      actions: 'cart/actions',
    },
  };

  // Need to remove totals / cart headers? Remove them.
  if (remove) {
    return window.location.reload();
  }

  utils.api.cart.getContent(options, (err, response) => {
    // TODO: Scope the call to this function by area that needs updating
    $cartContent.html(response.content);
    $cartTotals.html(response.totals);
    $cartActions.html(response.actions);
    $(document).trigger('cart-initialize-modules');

    // TODO: If the loading overlay is scoped to an area that is replaced
    // it does not fade out, but is removed abrubtly (due to being a
    // part of that area's content).
    didUpdate();
  });
}
