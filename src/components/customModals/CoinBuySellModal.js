import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Platform,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { FONTS } from "../../../constants/Fonts";
import { COLORS } from "../../../constants/Colors";
import {
  BidAskColor,
  FixedDecimal,
  OpenSnackbar,
} from "../../../constants/Functions";
import { useDispatch, useSelector } from "react-redux";
import { postAPI_Terminal } from "../../../constants/APIs";
import { AlertClose, AlertOpen } from "../../redux/action";
import TradeStatus from "./TradeStatus";
import { IS_ANDROID, SHADOW, WIDTH } from "../../../constants/Styles";
import QuantityDropDown from "../dropDown/QuantityDropDown";
import { navigate } from "../../navigations/RootNavigation";
import StaticBackground from "../background/StaticBackground";

const defaultOrderStatusObj = {
  visible: false,
  message: "",
  status: null,
  onOKPress: () => {},
};

const getButtonColors = (colorData) => {
  const bgColor = colorData?.BGColor;
  const isTransparent = bgColor === "transparent";
  return {
    borderColor: isTransparent ? COLORS.blackColor : bgColor,
    textColor: isTransparent ? COLORS.blackColor : bgColor,
    shadowColor: isTransparent ? COLORS.blackColor : bgColor,
  };
};

const CoinBuySellModal = ({
  visible,
  product,
  isBuy,
  isSell,
  groupSymbols,
  onClose,
  previousItem,
  isFullScreen = true,
}) => {
  const handleSnackBar = OpenSnackbar();
  const dispatch = useDispatch();
  const postTerminalApiResponse = postAPI_Terminal();
  const user = useSelector((store) => store?.user);

  const BidColor = BidAskColor(previousItem?.bid, product?.bid);
  const AskColor = BidAskColor(previousItem?.ask, product?.ask);

  // const isDisplaySymbol = user?.isLoggedIn
  //   ? product?.IsDisplayTerminal
  //   : product?.IsDisplay;
  // if (!isDisplaySymbol) {
  //   onClose();
  //   return;
  // }
  // if (user?.isLoggedIn) {
  //   product = CalculateTerminalRate(product, groupSymbols);
  //   if (!product) {
  //     onClose();
  //     return;
  //   }
  // }

  // const isGold =
  //   product?.Source &&
  //   (product?.Source?.toLowerCase()?.trim() == "gold" ||
  //     product?.Source?.toLowerCase()?.trim() == "goldnext");
  const tradeAt = ["Market"];

  const [Quantity, setQuantity] = useState("1");

  const [buyLoading, setBuyLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);

  const [tradeAtType, setTradeAtType] = useState(tradeAt[0]);
  const [orderStatusModal, setOrderStatusModal] = useState({
    ...defaultOrderStatusObj,
  });

  const disableTouchRef = useRef(false);
  // useEffect(() => {
  //   if (product?.quantityList != undefined) {
  //     let isQuantityAvailable = product?.quantityList.find(
  //       (item) => item.value == selectedQuantity
  //     );
  //     if (!isQuantityAvailable)
  //       setSelectedQuantity(product?.quantityList[0]?.value);
  //   }
  // }, [product]);
  const onBuySellPress = (tradeType, buttonType) => {
    try {
      let alertObj = {
        description: "",
        title: "",
        yesText: "OK",
        noText: "",
        onYesPress: () => {
          dispatch(AlertClose());
        },
        onNoPress: () => {},
      };
      let Qty = Quantity?.toString();
      if (Qty?.trim() == "") {
        const errMsg = "Please Enter Quantity to trade";
        if (IS_ANDROID) {
          dispatch(AlertOpen({ ...alertObj, description: errMsg }));
        } else {
          let orderStatusObj = {
            visible: true,
            message: errMsg,
            status: false,
            onOKPress: () => {
              setOrderStatusModal({
                ...defaultOrderStatusObj,
              });
            },
          };
          setOrderStatusModal({ ...orderStatusObj });
        }
        setTimeout(() => {
          disableTouchRef.current = false;
        }, 500);
        return;
      }
      if (tradeType == "Market") {
        const tradeType = buttonType == "Buy" ? "1" : "2";
        const price = buttonType == "Buy" ? product?.Ask : product?.Bid;
        submitTrade(Quantity, tradeType, price);
      }
    } catch (error) {
      console.log("onBuySellPress error: ", error);
    }
  };
  const submitTrade = async (Quantity, TradeType, Buy_Sell_Price) => {
    setBuyLoading(TradeType == 1 || TradeType == 3);
    setSellLoading(TradeType == 2 || TradeType == 4);
    try {
      if (user?.isLoggedIn) {
        const Token = user?.userDetails?.Data?.token;
        if (Token == undefined) {
          setTimeout(() => {
            disableTouchRef.current = false;
            setBuyLoading(false);
            setSellLoading(false);
            logoutUser();
          }, 500);
          return;
        }
        let orderObj = {
          SymbolId: product?.id,
          Token: user?.userDetails?.Data?.token,
          volume: Quantity.toString(),
          TradeFrom: Platform.OS,
          TradeType: TradeType,
          DeviceToken: user?.fcmToken || "",
          BuyLimitPrice: "0",
          SellLimitPrice: "0",
        };
        console.log("res", res);
        const res = await postTerminalApiResponse(
          "InsertCoinOpenOrderDetailWithRegID",
          orderObj
        );

        if (res?.code != undefined) {
          let orderStatusObj = {
            visible: true,
            message: res?.message || "Something Went Wrong",
            status: res?.code == "200" ? true : false,
            onOKPress: () => {
              onClose();
              setOrderStatusModal({
                ...defaultOrderStatusObj,
              });
              setTimeout(() => {
                if (res?.code == "200") {
                  navigate("CoinTrade", {
                    scrollTo: { tab: 0 },
                  });
                }
              }, 500);
            },
          };
          setOrderStatusModal({ ...orderStatusObj });
        }
      } else {
        logoutUser();
      }
    } catch (error) {
      console.log("onBuySellPress error : ", error);
    }
    setTimeout(() => {
      setBuyLoading(false);
      setSellLoading(false);
      disableTouchRef.current = false;
    }, 500);
  };
  const logoutUser = () => {
    try {
      onClose();
      handleSnackBar(`Please Login to Trade`, false);
      dispatch(logoutAction());
      setTimeout(() => {
        navigate("Login");
      }, 300);
    } catch (error) {
      console.log("logoutUser error : ", error);
    }
  };
  const onCloseRequest = () => {
    if (!disableTouchRef.current) {
      onClose();
    }
  };
  let bidButtonColors = getButtonColors(BidColor);
  let askButtonColors = getButtonColors(AskColor);
  let Total = Quantity * product?.ask;
  return (
    <Modal
      visible={visible}
      transparent={true}
      // onRequestClose={onClose}
      onRequestClose={onCloseRequest}
      onDismiss={onCloseRequest}
      animationType={"slide"}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={!isFullScreen ? onCloseRequest : () => {}}
          style={[
            styles.modalBackground,
            isFullScreen && {
              justifyContent: "flex-start",
              backgroundColor: COLORS.whiteColor,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={styles.modalContainer}
          >
            <View style={styles.modalTitleContainer}>
              <StaticBackground />
              <Text style={styles.modalTitle}>{product?.name}</Text>
            </View>
            <View style={styles.modalBox}>
              <View style={styles.marketTradeTypeContainer}>
                {tradeAt.map((type, index) => {
                  let isSelectedTradeType = type === tradeAtType;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      key={`tradeAt_${index}`}
                      onPress={() => setTradeAtType(type)}
                      style={[
                        styles.marketTradeTypeButtons,
                        !isSelectedTradeType && {
                          backgroundColor: COLORS.primaryColor + 30,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.bidAskRate,
                          isSelectedTradeType && {
                            color: COLORS.blackColor,
                          },
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View
                style={[
                  styles.buySellButtonContainer,
                  {
                    justifyContent: isBuy && isSell ? "space-around" : "center",
                    marginTop: 10,
                    marginBottom: 20,
                  },
                ]}
              >
                {isBuy && (
                  <View
                    style={[
                      styles.buySellBox,
                      {
                        borderColor: bidButtonColors.borderColor,
                        shadowColor: bidButtonColors.shadowColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.buySellButtonText,
                        {
                          color: bidButtonColors.textColor,
                        },
                      ]}
                    >
                      SELL
                    </Text>
                    <Text
                      style={[
                        styles.selectedBidAskRate,
                        {
                          color: bidButtonColors.textColor,
                        },
                      ]}
                    >
                      {product?.Bid}
                    </Text>
                  </View>
                )}
                {isSell && (
                  <View
                    style={[
                      styles.buySellBox,
                      {
                        borderColor: askButtonColors.borderColor,
                        shadowColor: askButtonColors.shadowColor,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.buySellButtonText,
                        {
                          color: askButtonColors.textColor,
                        },
                      ]}
                    >
                      BUY
                    </Text>
                    <Text
                      style={[
                        styles.selectedBidAskRate,
                        {
                          color: askButtonColors.textColor,
                        },
                      ]}
                    >
                      {product?.ask}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.QtyFieldContainer}>
                <Text style={styles.QtyTitle}>Quantity : </Text>
                <View style={styles.QtyButtonContainer}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    disabled={Number(Quantity) <= 1}
                    onPress={() => {
                      if (Number(Quantity) != 1) {
                        setQuantity((prev) =>
                          Number(prev) - 1 <= 1 ? 1 : Number(prev) - 1
                        );
                      }
                    }}
                    style={[
                      styles.QtyButtons,
                      { opacity: Number(Quantity) <= 1 ? 0.5 : 1 },
                    ]}
                  >
                    <Text style={styles.QtyButtonText}>-</Text>
                  </TouchableOpacity>
                  <TextInput
                    value={Quantity?.toString()}
                    onChangeText={(text) => {
                      const integerOnly = /^[0-9]+$/;
                      if (text?.trim() === "" || parseInt(text) < 1) {
                        setQuantity("1"); // allow clearing input
                        return;
                      }
                      // Check if valid integer (no decimals)
                      if (integerOnly.test(text)) {
                        setQuantity(text);
                      }
                    }}
                    keyboardType={"numeric"}
                    onSubmitEditing={() => Keyboard.dismiss()}
                    style={styles.formInputFields}
                    placeholder="Quantity"
                    placeholderTextColor={COLORS.greyColor}
                    returnKeyType={"done"}
                    activeOutlineColor={COLORS.primaryColor}
                  />
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setQuantity((prev) => Number(prev) + 1)}
                    style={styles.QtyButtons}
                  >
                    <Text style={styles.QtyButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={[
                  styles.buySellButtonContainer,
                  {
                    justifyContent: isBuy && isSell ? "space-around" : "center",
                  },
                ]}
              >
                {isBuy && (
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      onPress={() => {
                        if (!disableTouchRef.current) {
                          disableTouchRef.current = true;
                          onBuySellPress(tradeAtType, "Sell");
                        }
                      }}
                      activeOpacity={0.9}
                      disabled={disableTouchRef.current}
                      style={[
                        styles.buySellButton,
                        {
                          backgroundColor: COLORS.failure,
                          opacity: disableTouchRef.current ? 0.5 : 1,
                        },
                      ]}
                    >
                      {sellLoading ? (
                        <ActivityIndicator
                          size={"large"}
                          color={COLORS.blackColor}
                        />
                      ) : (
                        <Text style={styles.buySellButtonText}>SELL</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
                {isSell && (
                  <View
                    style={{
                      flex: 1,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (!disableTouchRef.current) {
                          disableTouchRef.current = true;
                          onBuySellPress(tradeAtType, "Buy");
                        }
                      }}
                      activeOpacity={0.9}
                      disabled={disableTouchRef.current}
                      style={[
                        styles.buySellButton,
                        {
                          backgroundColor: COLORS.success,
                          opacity: disableTouchRef.current ? 0.5 : 1,
                        },
                      ]}
                    >
                      {buyLoading ? (
                        <ActivityIndicator
                          size={"large"}
                          color={COLORS.blackColor}
                        />
                      ) : (
                        <Text style={styles.buySellButtonText}>BUY</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <Text style={styles.totalLbl}>Total : {Total}</Text>
            </View>
            {isFullScreen && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onCloseRequest}
                style={styles.closeButton}
              >
                <StaticBackground />
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </SafeAreaView>

      {orderStatusModal.visible && (
        <View>
          <TradeStatus {...orderStatusModal} />
        </View>
      )}
    </Modal>
  );
};

export default CoinBuySellModal;

const styles = StyleSheet.create({
  buySellButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    marginTop: 20,
  },
  buySellBox: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.headingBackgorund,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    overflow: "hidden",
    backgroundColor: COLORS.headingBackgorund,
    ...SHADOW,
    shadowColor: COLORS.primaryColor,
    paddingVertical: 6,
  },
  buySellButton: {
    // flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buySellButtonText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: COLORS.whiteColor,
  },
  modalBackground: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalContainer: {
    // flex: 1,
    width: WIDTH,
    marginHorizontal: 25,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    alignItems: "center",
    backgroundColor: COLORS.whiteColor,
    zIndex: 4,
  },
  modalTitleContainer: {
    borderRadius: 8,
    borderWidth: 2,
    width: "95%",
    alignSelf: "center",
    marginTop: 10,
    borderColor: COLORS.boxBorder,
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.Bold,
    color: COLORS.blackColor,
    width: "100%",
    textAlign: "center",
    includeFontPadding: false,
  },
  modalBox: {
    margin: 10,
    padding: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.boxBorder,
  },
  marketTradeTypeContainer: {
    // width: "90%",
    marginHorizontal: 5,
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: 15,
    borderRadius: 5,
    overflow: "hidden",
  },
  marketTradeTypeButtons: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    backgroundColor: COLORS.primaryColor,
  },
  bidAskRate: {
    fontFamily: FONTS.Bold,
    fontSize: 14,
    color: COLORS.blackColor,
    padding: 3,
    paddingHorizontal: 15,
    borderRadius: 3,
  },
  selectedBidAskRate: {
    fontFamily: FONTS.Bold,
    fontSize: 15,
    color: COLORS.RateText,
  },
  flexEndView: {
    marginRight: 5,
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  QtyFieldContainer: {
    backgroundColor: COLORS.transparent,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    alignSelf: "flex-end",
    // alignItems: "flex-end",
  },
  QtyTitle: {
    fontFamily: FONTS.Semi_Bold,
    fontSize: 15,
    color: COLORS.blackColor,
  },
  totalLbl: {
    fontFamily: FONTS.Semi_Bold,
    fontSize: 17,
    color: COLORS.blackColor,
    alignSelf: "flex-end",
    margin: 5,
  },
  QtyButtonContainer: {
    width: 160,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 2,
  },
  QtyButtons: {
    height: 25,
    width: 25,
    borderRadius: 8,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primaryColor,
    margin: 10,
  },
  QtyButtonText: {
    fontFamily: FONTS.Medium,
    fontSize: 20,
    color: COLORS.blackColor,
    includeFontPadding: false,
  },
  formInputFields: {
    width: 90,
    height: 45,
    alignSelf: "center",
    justifyContent: "center",
    padding: 10,
    borderColor: COLORS.primaryColor,
    borderWidth: 1, // use full border instead of just bottom
    borderRadius: 10, // all corners rounded
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: COLORS.blackColor,
  },
  closeButton: {
    alignSelf: "center",
    marginVertical: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: COLORS.primaryColor,
    overflow: "hidden",
  },
  closeButtonText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: COLORS.blackColor,
  },
});
