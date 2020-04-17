export function addProviderRequest(data) {
  return {
    type: '@provider/ADD_PROVIDER_REQUEST',
    payload: { data },
  };
}

export function editProviderRequest(data) {
  return {
    type: '@provider/EDIT_PROVIDER_REQUEST',
    payload: { data },
  };
}

export function deleteProviderRequest(data) {
  return {
    type: '@provider/DELETE_PROVIDER_REQUEST',
    payload: { data },
  };
}

export function providerEndRequest() {
  return {
    type: '@provider/PROVIDER_END_REQUEST',
  };
}
