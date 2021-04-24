import { combineReducers } from 'redux';
import LoginReducer from './reducer_login';
import LoaderReduer from './reducer_loader';
import ToastReduer from './reducer_toast';
import ModalReduer from './reducer_modal';
import StateReducer from './reducer_saveState';
import HeaderReducer from './reducer_header';
import BreadCrumbReducer from './reducer_breadcrumb';

const rootReducer = combineReducers({
  login: LoginReducer,
  loader: LoaderReduer,
  toast: ToastReduer,
  modal: ModalReduer, //{ isOpen: boolean, title: 'modal title': content: 'modal content', onConfirmCallBack: callback in btn click }
  previousState: StateReducer,
  header: HeaderReducer,
  breadCrumb: BreadCrumbReducer
});

export default rootReducer;
