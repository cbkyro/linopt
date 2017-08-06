/**
 * TODO: Leverage out other top-section alerts to use this class
 *
 * This class serves as a bridge between the Alert class and other compartmentalised messages
 * This will allow for messages to not visually interfere with each other
 *
 */

import Alert from '../utils/Alert';
import scrollTarget from '../utils/scrollTarget';

export default class PageAlert {
  constructor() {
    this.$el = $('[data-page-message]');
    this.$pageAlert = new Alert(this.$el, {
      callbacks: {
        willUpdate: ($el) => {
          this._goToMessage($el);
        },
      },
    });
  }

  alert(message, type = 'info'){
    this.$pageAlert.message(message, type, true);
  }

  clear(){
    this.$el.trigger('clear-messages');
  }

  _goToMessage($el){
    $el.revealer('show');
    scrollTarget('[data-page-message]');
  }
}
