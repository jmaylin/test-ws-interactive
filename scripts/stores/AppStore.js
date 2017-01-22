// cf https://scotch.io/tutorials/creating-a-simple-shopping-cart-with-react-js-and-flux

import { EventEmitter } from 'events';
import AppDispatcher from '../dispatcher/AppDispatcher';
import { SET_GRAVITY_CENTER } from '../constants/AppConstants';

const CHANGE_EVENT = 'change';

// Set max number of listeners
// Src: http://stackoverflow.com/a/26176922/962893
EventEmitter.prototype._maxListeners = 500;

let gravityCenter = { x: 0, y: 0 };

function setGravityCenter(item) {
  gravityCenter = item;
}

class Store extends EventEmitter {

  constructor() {
    super();
  }

  getGravityCenter() {
    return gravityCenter;
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

const AppStore = new Store();

AppDispatcher.register((payload) => {
  const action = payload.action;

  switch(action.actionType) {

    case SET_GRAVITY_CENTER:
      setGravityCenter(action.item);
      break;

    default:
      return true;
  }

  AppStore.emitChange();

  return true;

});

export default AppStore;
