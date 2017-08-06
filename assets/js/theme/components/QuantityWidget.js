export default class QuantityWidget {
  constructor(options = {}) {
    this.options = $.extend({
      el: '[data-quantity-control]',
      cntrl: '[data-quantity-control-action]',
      scope: 'body',
    }, options);

    // Bind Control Actions
    $(this.options.scope).on('click', this.options.cntrl, (event) => {
      event.preventDefault(); //in case we use <button>/<a> instead of <span>'s
      const $target = $(event.target).closest(this.options.cntrl);
      const action = $target.data('quantity-control-action');

      const $quantityInput = $target.siblings('input');
      const values = this._getAttrs($quantityInput);

      if (action === 'increment' && values.value < values.max) {
        $quantityInput.val(values.value + 1).trigger('change');
      } else if (action === 'decrement' && values.value > 0 && values.value > values.min) {
        $quantityInput.val(values.value - 1).trigger('change');
      }
    });

    // Simple input validation (keep input within min/max range)
    // Feel free to remove and replace with another form of validation
    $(this.options.scope).on('change', 'input', (event) => {
      const $target = $(event.target);
      const values = this._getAttrs($target);

      if (values.value > values.max) {
        //`Quantity "${value}" cannot be greater than maximum (${max})`
        $target.val($target.attr('value'));
      } if (values.value < values.min) {
        //`Quantity value "${value}" cannot be less than minimum (${min})`
        $target.val($target.attr('value'));
      }
    });
  }

  _getAttrs($quantityInput){
    const min = $quantityInput.attr('min') ? parseInt($quantityInput.attr('min'),10) : 0;
    const max = $quantityInput.attr('max') ? parseInt($quantityInput.attr('max'),10) : Infinity;
    const baseValue = parseInt($quantityInput.val(), 10);
    const value = (!isNaN(baseValue) && min <= baseValue ? baseValue : 0);

    return {
      min,
      max,
      value,
    };
  }
}
