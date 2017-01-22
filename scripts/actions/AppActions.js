import AppDispatcher from '../dispatcher/AppDispatcher';
import { SET_GRAVITY_CENTER } from '../constants/AppConstants';

const AppActions = {
  setGravityCenter: function(item){
    AppDispatcher.handleViewAction({
      actionType: SET_GRAVITY_CENTER,
      item: item
    })
  }
}

export default AppActions;
