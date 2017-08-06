import utils from '@bigcommerce/stencil-utils';

/**
 * State/provices are dynamically updated via this function
 *
 * Parameters:
 *   event:
 *     Country select change event
 *   context:
 *     Page context for "required" flag
 *   useIdForState:
 *     Boolean to toggle between state id and name for option value
 *   callback:
 *     Used for firing SelectWrapper if in use by the theme
 */
export default function updateState(event, context, useIdForState, callback) {
  const $target = $(event.currentTarget);
  const country = $target.val();
  const $stateElement = $('[data-field-type="State"]');

  const stateElementAttributes = {
    stateId: $stateElement.attr('id'),
    stateName: $stateElement.attr('name'),
  };

  utils.api.country.getByName(country, (err, response) => {
    if (response.data.states.length) {
      const stateArray = [];
      stateArray.push(`<option value="">${response.data.prefix}</option>`);
      if (useIdForState) {
        $.each(response.data.states, (i, state) => {
          stateArray.push(`<option value="${state.id}">${state.name}</option>`);
        });
      } else {
        $.each(response.data.states, (i, state) => {
          stateArray.push(`<option value="${state.name}">${state.name}</option>`);
        });
      }
      $stateElement.replaceWith(`
        <select
          class="form-input form-select"
          id=${stateElementAttributes.stateId}
          name=${stateElementAttributes.stateName}
          required
          aria-required="true"
          data-field-type="State">
            ${stateArray.join(' ')}
        </select>
      `);
    } else {
      $stateElement.replaceWith(`
        <input
          class="form-input"
          type="text"
          id=${stateElementAttributes.stateId}
          name=${stateElementAttributes.stateName}
          placeholder="${context.selectState}"
          data-field-type="State">
      `);
    }

    const $newStateElement = $('[data-field-type="State"]');
    const $newStateElementParent = $newStateElement.parent();
    const $selectorText = $newStateElementParent.closest('.form-field-selectortext');
    $newStateElementParent.find('.form-selected-text').remove();

    if (response.data.states.length) {
      $newStateElementParent.addClass('form-select-wrapper');

      if (!$selectorText.find('.required-text').length) {
        $selectorText
          .find('.form-field-title')
          .append(`<span class="required-text">${context.required}</span>`);
      }

      if (callback) {
        callback($newStateElement);
      }
    } else {
      $newStateElementParent.removeClass('form-select-wrapper');
      $selectorText
        .find('.required-text')
        .remove();
    }
  });
}
