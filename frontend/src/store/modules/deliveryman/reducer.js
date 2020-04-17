import produce from 'immer';

const INITIAL_STATE = {
  data: null,
  loading: false,
};

export default function delivery(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@deliveryman/ADD_DELIVERYMAN_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@deliveryman/EDIT_DELIVERYMAN_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@deliveryman/DELETE_DELIVERYMAN_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@deliveryman/DELIVERYMAN_END_REQUEST': {
        draft.loading = false;
        break;
      }
      default:
    }
  });
}
