import Modal from 'bc-modal';
import FormValidator from '../utils/FormValidator';

export default class ProductReviews {
  constructor(context) {
    this.context = context;
    this.$reviewForm = $('#form-leave-a-review');
    this.$modalContent = $('#modal-review-form');
    this.$modalAlerts = $('.alert', this.$modalContent);

    this.Validator = new FormValidator(this.context);

    this.reviewModal = new Modal({
      el: this.$modalContent,
      modalClass: 'modal-leave-review',
      afterShow: () => {
        this.Validator.initSingle(this.$reviewForm);
      },
    });

    this._bindEvents();
    this._init();
  }

  _bindEvents() {
    $('.review-link').click((event) => {
      event.preventDefault();
      this.reviewModal.open();
    });

    $('[data-review-close]').click(() => {
      this.$reviewForm.trigger('reset');

      if (this.$modalAlerts.length) {
        this.$modalAlerts.remove();
      }
    });
  }

  _init() {
    if (this.$modalAlerts.length) {
      this.reviewModal.open();
    }
  }
}
