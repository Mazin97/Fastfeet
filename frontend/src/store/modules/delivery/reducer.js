import produce from 'immer';

const INITIAL_STATE = {
  data: null,
  loading: false,
};

export default function delivery(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@delivery/ADD_DELIVERY_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@delivery/EDIT_DELIVERY_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@delivery/CANCEL_DELIVERY_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@delivery/DELETE_DELIVERY_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@delivery/DELIVERY_END_REQUEST': {
        draft.loading = false;
        break;
      }
      default:
    }
  });
}
