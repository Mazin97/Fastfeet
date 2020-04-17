export function addDeliverymanRequest(data) {
  return {
    type: '@deliveryman/ADD_DELIVERYMAN_REQUEST',
    payload: { data },
  };
}

export function editDeliverymanRequest(data) {
  return {
    type: '@deliveryman/EDIT_DELIVERYMAN_REQUEST',
    payload: { data },
  };
}

export function deleteDeliverymanRequest(data) {
  return {
    type: '@deliveryman/DELETE_DELIVERYMAN_REQUEST',
    payload: { data },
  };
}

export function deliverymanEndRequest() {
  return {
    type: '@deliveryman/DELIVERYMAN_END_REQUEST',
  };
}
