import produce from 'immer';

const INITIAL_STATE = {
  data: null,
  loading: false,
};

export default function delivery(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@provider/ADD_PROVIDER_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@provider/EDIT_PROVIDER_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@provider/DELETE_PROVIDER_REQUEST': {
        draft.loading = true;
        break;
      }
      case '@provider/PROVIDER_END_REQUEST': {
        draft.loading = false;
        break;
      }
      default:
    }
  });
}
