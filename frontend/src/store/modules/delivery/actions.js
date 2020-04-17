export function addDeliveryRequest(data) {
  return {
    type: '@delivery/ADD_DELIVERY_REQUEST',
    payload: { data },
  };
}

export function editDeliveryRequest(data) {
  return {
    type: '@delivery/EDIT_DELIVERY_REQUEST',
    payload: { data },
  };
}

export function cancelDeliveryRequest(data) {
  return {
    type: '@delivery/CANCEL_DELIVERY_REQUEST',
    payload: { data },
  };
}

export function deleteDeliveryRequest(data) {
  return {
    type: '@delivery/DELETE_DELIVERY_REQUEST',
    payload: { data },
  };
}

export function deliveryEndRequest() {
  return {
    type: '@delivery/DELIVERY_END_REQUEST',
  };
}
