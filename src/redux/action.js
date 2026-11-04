export const SnackbarOpen = (data) => {
  return {
    type: "SNACKBAR_OPEN",
    payload: data,
  };
};
export const SnackbarClose = () => {
  return {
    type: "SNACKBAR_CLOSE",
    payload: {},
  };
};
export const fcmTokenAction = (data) => {
  return {
    type: "FCM_TOKEN_UPDATE",
    payload: data,
  };
};
export const AlertOpen = (data) => {
  return {
    type: "ALERT_OPEN",
    payload: { ...data, visible: true },
  };
};
export const AlertClose = () => {
  return {
    type: "ALERT_CLOSE",
    payload: {
      visible: false,
      description: "",
      title: "",
      yesText: "",
      noText: "",
      onYesPress: () => {},
      onNoPress: () => {},
    },
  };
};

export const ClientDetailsAction = (data) => {
  return {
    type: "UPDATE_CLIENT_DETAILS",
    payload: data,
  };
};
export const loginAction = (data) => {
  return {
    type: "LOGIN",
    payload: data,
  };
};
export const logoutAction = () => {
  return {
    type: "LOGOUT",
    payload: null,
  };
};
export const SymbolGroupDataAction = (data) => {
  return {
    type: "SYMBOL_GROUP",
    payload: data,
  };
};
export const SymbolCoomonGroupDataAction = (data) => {
  return {
    type: "SYMBOL_COMMON_GROUP",
    payload: data,
  };
};
export const OrderDetailsUpdate = (data) => {
  return {
    type: "ORDER_DETAILS_UPDATE",
    payload: data,
  };
};
export const CoinGroupDataAction = (data) => {
  return {
    type: "COIN_GROUP",
    payload: data,
  };
};
export const onBoardingTutorial = (data) => {
  return {
    type: "ON_BOARDING_TUTORIAL",
    payload: data,
  };
};
export const RememberMeAction = (data) => {
  return {
    type: "REMEMBER_ME",
    payload: data,
  };
};
