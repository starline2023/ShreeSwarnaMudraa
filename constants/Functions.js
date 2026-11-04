import { useDispatch } from "react-redux";
import { AlertOpen, SnackbarOpen } from "../src/redux/action";
import { COLORS } from "./Colors";
import { GLOBALS } from "./GLOBALS";
import { inflate, inflateRaw, ungzip } from "pako";

export const OpenSnackbar = () => {
  // use like this in component where we need to call API
  // const loginFunction = userLogin();
  // async & await loginFunction(DATA);
  const dispatch = useDispatch();
  const handleSnackBarOpen = async (message, status, color = null) => {
    let dispatchedColor = "";
    if (color == null) {
      dispatchedColor = status == true ? COLORS.success : COLORS.failure;
    } else {
      dispatchedColor = color;
    }
    dispatch(
      SnackbarOpen({
        message: message,
        status: status,
        color: dispatchedColor,
      }),
    );
  };

  return handleSnackBarOpen;
};

export const OpenAlert = () => {
  // use like this in component where we need to call API
  // const loginFunction = userLogin();
  // async & await loginFunction(DATA);
  const dispatch = useDispatch();
  const handleAlertOpen = async (alertObj) => {
    dispatch(AlertOpen(alertObj));
  };

  return handleAlertOpen;
};

export const convertToValidPhoneNumber = (num) => {
  let phoneNumber = num.replace(/[^\d+]/g, "");
  if (phoneNumber.startsWith("+")) {
    phoneNumber = phoneNumber.replace(/^\+\d{0,2}/, "");
  }
  return phoneNumber;
};
export const convertDateFormat = (date) => {
  return date.toLocaleDateString("en-GB");
};
export const deepEqual = (...values) => {
  // Compare pairwise
  for (let i = 1; i < values.length; i++) {
    if (!isEqual(values[0], values[i])) return false;
  }
  return true;
};

export const isEqual = (a, b) => {
  if (a === b) return true;

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a == null ||
    b == null
  ) {
    return false;
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((val, idx) => isEqual(val, b[idx]));
  }

  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();
  if (keysA.length !== keysB.length) return false;
  if (!keysA.every((key, idx) => key === keysB[idx])) return false;

  return keysA.every((key) => isEqual(a[key], b[key]));
};

const atob = (input) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let str = String(input).replace(/=+$/, "");
  let output = "";

  if (str.length % 4 === 1) {
    throw new Error(
      "'atob' failed: The string to be decoded is not correctly encoded.",
    );
  }

  for (
    let bc = 0, bs = 0, buffer, i = 0;
    (buffer = str.charAt(i++));
    ~buffer && ((bs = bc % 4 ? bs * 64 + buffer : buffer), bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    buffer = chars.indexOf(buffer);
  }

  return output;
};
export const inflateData = (data) => {
  try {
    if (GLOBALS.inflateDataRequired) {
      const compressed = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
      return JSON.parse(ungzip(compressed, { to: "string" }));
    } else {
      return data;
    }
  } catch (error) {
    console.log("inflateData Error :", error);
  }
};
export const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};
export const valuesWithSpecificKeys = (obj, keyIncludes) => {
  let arrayOfKeys = Object.keys(obj);
  return arrayOfKeys
    .filter(
      (item) =>
        item.includes(keyIncludes) &&
        obj[item]?.trim().length != 0 &&
        obj[item] != null,
    )
    .map((item) => obj[item]?.trim());
};
export const validEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
};

export const isDisableByNotNumber = (val) => val === "--";

export const CalculateTerminalRate = (currentItem, groupDetails) => {
  try {
    if (!groupDetails || Object.keys(groupDetails).length === 0) {
      return null;
    }
    let findGroupPremium = groupDetails?.find(
      (groupData) =>
        parseInt(groupData?.symbolId) === parseInt(currentItem?.id),
    );
    if (findGroupPremium == undefined) {
      return null;
    }
    let newBidRate =
      parseFloat(currentItem?.bid) + parseFloat(findGroupPremium?.buyPremium);
    let newAskRate =
      parseFloat(currentItem?.ask) + parseFloat(findGroupPremium?.sellPremium);
    if (currentItem?.src?.trim()?.toLowerCase() == "gold") {
      newBidRate = newBidRate + parseFloat(findGroupPremium?.buyPremiumGold);
      newAskRate = newAskRate + parseFloat(findGroupPremium?.sellPremiumGold);
    } else if (currentItem?.src?.trim()?.toLowerCase() == "silver") {
      newBidRate = newBidRate + parseFloat(findGroupPremium?.buyPremiumSilver);
      newAskRate = newAskRate + parseFloat(findGroupPremium?.sellPremiumSilver);
    } else if (currentItem?.src?.trim()?.toLowerCase() == "copper") {
      newBidRate = newBidRate + parseFloat(findGroupPremium?.buyPremiumCopper);
      newAskRate = newAskRate + parseFloat(findGroupPremium?.sellPremiumCopper);
    }
    return {
      ...currentItem,
      bid: isNaN(newBidRate) ? "--" : newBidRate,
      ask: isNaN(newAskRate) ? "--" : newAskRate,
      quantityList: QuantityDropDownMaker(findGroupPremium),
    };
  } catch (error) {
    console.log("CalculateTerminalRate Error :", error);
  }
};

export const QuantityDropDownMaker = (group) => {
  try {
    if (!group) return [];
    let weightUnitArr = [];
    let inTotal = group?.inTotal;
    let oneClick = group?.oneClick;
    let Step = group?.step || 0;
    if (Step <= 0) {
      Step = oneClick;
    }
    if (inTotal && oneClick && Step) {
      for (let index = oneClick; index <= inTotal; index) {
        var objGram = FixedDecimal(index, 1);
        weightUnitArr.push({ value: objGram.toString() });
        index = index + Step;
      }
    }
    return weightUnitArr;
  } catch (error) {
    return [];
  }
};
export const BidAskColor = (
  prev,
  curr,
  defaultBG = COLORS.RateBg,
  defaultTxt = COLORS.RateText,
) => {
  let BGColor = defaultBG;
  let textColor = defaultTxt;
  let PreValue = parseFloat(prev);
  let CurValue = parseFloat(curr);
  try {
    if (PreValue > CurValue) {
      BGColor = COLORS.RateDownBg;
      textColor = COLORS.RateDown;
    } else if (PreValue < CurValue) {
      BGColor = COLORS.RateUpBg;
      textColor = COLORS.RateUp;
    }
  } catch (e) {
    BGColor = defaultBG;
    textColor = defaultTxt;
  }
  return { BGColor: BGColor, textColor: textColor };
};

export const FixedDecimal = (num, fixed = 2) => {
  try {
    return Number(num) % 1 === 0 ? Number(num) : Number(num).toFixed(fixed);
  } catch (e) {
    return 0;
  }
};
