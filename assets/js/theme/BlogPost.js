import PageManager from '../PageManager';
import fitVideos from './utils/fitVideos';

export default class BlogPost extends PageManager {
  constructor() {
    super();
  }

  loaded() {
    fitVideos('.blog-item-content');
  }
}
