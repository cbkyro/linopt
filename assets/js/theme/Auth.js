import CoreAuth from './core/Auth';
import SelectWrapper from './components/SelectWrapper';

export default class Auth extends CoreAuth {
  selectWrapCallback($selectEl) {
    // -- This select bubbles up from /core/Auth.js -- //
    new SelectWrapper($selectEl);
  }
}
