/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import settings from './settings';
// import chatAppReducer from './ChatAppReducer';
// import emailAppReducer from './EmailAppReducer';
// import sidebarReducer from './SidebarReducer';
// import todoAppReducer from './TodoAppReducer';
import authUserReducer from './AuthUserReducer';
// import feedbacksReducer from './FeedbacksReducer';
// import CrmReducer from './CrmReducer';

const reducers = combineReducers({
   settings,
   // chatAppReducer,
   // emailApp: emailAppReducer,
   // sidebar: sidebarReducer,
   // todoApp: todoAppReducer,
   authUser: authUserReducer,
   // feedback: feedbacksReducer,   
   // CrmReducer: CrmReducer
});

export default reducers;
