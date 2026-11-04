const Tutorial = {
  onBoardingTutorial: true,
};
const OTRstate = {
  otrDisplay: true,
};
const SnackbarContent = {
  visible: false,
  message: "",
  status: "",
  color: "",
};
const alertBoxState = {
  visible: false,
  description: "",
  title: "",
  child: <></>,
  yesText: "",
  noText: "",
  onYesPress: () => {},
  onNoPress: () => {},
};
const userState = {
  isLoggedIn: false,
  userDetails: null,
  fcmToken: null,
  remember: { mobileNumber: null, password: null },
};
const SplashState = {
  splashDisplay: true,
};
const clientDetailsState = {
  Address: [],
  BookingNumber: [],
  Email: [],
  WhatsAppNumber: "",
  Name: "",
  Display: {
    Marquee: { Top: "", Bottom: "" },
    AdBanner: "",
  },
  RateInfo: {},
};
const groupDetailsState = {
  CoinGroup: [],
  SymbolGroup: {},
  SymbolCommonGroup: {},
};
const orderDetails = null;

export const splashReducer = (state = SplashState, action) => {
  const { type } = action;
  switch (type) {
    case "SPLASH_DISPLAY":
      return { ...state, splashDisplay: false };
    default:
      return state;
  }
};
export const otrReducer = (state = OTRstate, action) => {
  const { type } = action;
  switch (type) {
    case "OTR_DISPLAY":
      return { ...state, otrDisplay: false };
    default:
      return state;
  }
};

export const tutorialReducer = (state = Tutorial, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ON_BOARDING_TUTORIAL":
      return { ...state, onBoardingTutorial: payload };
    default:
      return state;
  }
};

export const snackbarReducer = (state = SnackbarContent, action) => {
  const { type, payload } = action;
  switch (type) {
    case "SNACKBAR_OPEN":
      return {
        ...state,
        visible: true,
        message: payload.message,
        status: payload.status,
        color: payload.color,
      };
    case "SNACKBAR_CLOSE":
      return {
        ...state,
        visible: false,
        message: "",
        status: "",
        color: "",
      };
    default:
      return state;
  }
};

export const alertBoxReducer = (state = alertBoxState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ALERT_OPEN":
      return {
        ...state,
        ...payload,
      };
    case "ALERT_CLOSE":
      return { ...alertBoxState };
    default:
      return state;
  }
};

export const clientDetailsReducers = (state = clientDetailsState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "UPDATE_CLIENT_DETAILS":
      return {
        ...state,
        ...payload,
      };
    case "EMPTY_DETAILS":
      return { ...clientDetailsState };
    default:
      return state;
  }
};

export const userReducer = (state = userState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "FCM_TOKEN_UPDATE":
      return { ...state, fcmToken: payload };
    case "LOGIN":
      return { ...state, userDetails: payload, isLoggedIn: true };
    case "LOGOUT":
      return { ...state, userDetails: null, isLoggedIn: false };
    case "REMEMBER_ME":
      return { ...state, remember: payload };
    default:
      return state;
  }
};

export const groupReducer = (state = groupDetailsState, action) => {
  const { type, payload } = action;
  switch (type) {
    case "COIN_GROUP":
      return { ...state, CoinGroup: payload };
    case "SYMBOL_GROUP":
      return { ...state, SymbolGroup: payload };
    case "SYMBOL_COMMON_GROUP":
      return { ...state, SymbolCommonGroup: payload };
    case "LOGOUT":
      return { ...groupDetailsState };
    default:
      return state;
  }
};

export const orderDetailsReducer = (state = orderDetails, action) => {
  const { type, payload } = action;
  switch (type) {
    case "ORDER_DETAILS_UPDATE":
      return payload;
    default:
      return state;
  }
};
