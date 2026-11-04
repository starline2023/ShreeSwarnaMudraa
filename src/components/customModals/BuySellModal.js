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
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { FONTS } from "../../../constants/Fonts";
import { COLORS } from "../../../constants/Colors";
import {
  BidAskColor,
  CalculateTerminalRate,
  isDisableByNotNumber,
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
import StaticImageBackground from "../background/StaticImageBackground";
import TradeActionButton from "../customButton/TradeActionButton";

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

const BuySellModal = ({
  visible,
  product,
  isBuy,
  isSell,
  groupSymbols,
  commonGrp,
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

  const isDisplaySymbol = user?.isLoggedIn ? product?.it : product?.iv;
  if (!isDisplaySymbol) {
    onClose();
    return;
  }
  if (user?.isLoggedIn) {
    product = CalculateTerminalRate(product, groupSymbols);
    if (!product) {
      onClose();
      return;
    }
  }

  const isGold = product?.src?.toLowerCase()?.trim() == "gold";
  const tradeAt = ["Market", "Limit"];

  const [selectedQuantity, setSelectedQuantity] = useState("");
  const [limitPrice, setLimitPrice] = useState("");

  const [buyLoading, setBuyLoading] = useState(false);
  const [sellLoading, setSellLoading] = useState(false);

  const [tradeAtType, setTradeAtType] = useState(tradeAt[0]);
  const [orderStatusModal, setOrderStatusModal] = useState({
    ...defaultOrderStatusObj,
  });

  const disableTouchRef = useRef(false);
  useEffect(() => {
    if (product?.quantityList != undefined) {
      let isQuantityAvailable = product?.quantityList.find(
        (item) => item.value == selectedQuantity,
      );
      if (!isQuantityAvailable)
        setSelectedQuantity(product?.quantityList[0]?.value);
    }
  }, [product]);

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
      let Quantity = selectedQuantity?.toString();
      if (Quantity?.trim() == "") {
        const errMsg = "Quantity not Selected";
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
      const LimitPrice = limitPrice?.trim();
      if (tradeType == "Market") {
        const tradeType = buttonType == "Buy" ? "1" : "2";
        const price = buttonType == "Buy" ? product?.ask : product?.bid;
        submitTrade(Quantity, tradeType, price);
      } else if (tradeType == "Limit") {
        if (LimitPrice.length > 0) {
          const tradeType = buttonType == "Buy" ? "3" : "4";
          submitTrade(Quantity, tradeType, LimitPrice);
        } else {
          const errMsg = "Please enter Limit Price";
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
          symbolId: product?.id,
          volume: parseFloat(Quantity),
          rate: parseFloat(Buy_Sell_Price),
          tradeType: parseInt(TradeType),
          deviceType: Platform.OS,
        };

        let response = await postTerminalApiResponse("placeOrder", orderObj);

        if (response?.code != undefined) {
          let orderStatusObj = {
            visible: true,
            message: response?.message,
            status: response?.code == "200" ? true : false,
            onOKPress: () => {
              onClose();
              setOrderStatusModal({
                ...defaultOrderStatusObj,
              });
              setTimeout(() => {
                if (response?.code == "200") {
                  navigate("Trades", {
                    scrollTo: { tab: TradeType == 3 || TradeType == 4 ? 1 : 0 },
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

  return (
    <Modal
      visible={visible}
      transparent={true}
      // onRequestClose={onClose}
      onRequestClose={onCloseRequest}
      onDismiss={onCloseRequest}
      animationType={"slide"}
    >
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={["top", "bottom"]}>
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
            <StaticBackground isBGImage />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {}}
              style={styles.modalContainer}
            >
              <View style={styles.modalTitleContainer}>
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
                            backgroundColor: COLORS.primaryColor + 40,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.bidAskRate,
                            isSelectedTradeType && {
                              color: COLORS.whiteColor,
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
                      justifyContent:
                        isBuy && isSell ? "space-around" : "center",
                      marginTop: 10,
                      marginBottom: 20,
                    },
                  ]}
                >
                  {/* {isBuy && ( */}
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
                      {product?.bid}
                    </Text>
                  </View>
                  {/* )} */}
                  {/* {isSell && ( */}
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
                  {/* )} */}
                </View>

                <View style={styles.flexEndView}>
                  {product?.quantityList?.length != 0 && (
                    <QuantityDropDown
                      data={product?.quantityList}
                      value={selectedQuantity}
                      setValue={setSelectedQuantity}
                      suffix={isGold ? "GM" : "KG"}
                    />
                  )}
                  {tradeAtType == "Limit" && (
                    <View style={styles.limitFieldContainer}>
                      <Text style={styles.limitTitle}>Limit : </Text>
                      <TextInput
                        value={limitPrice}
                        onChangeText={(text) => {
                          setLimitPrice(text);
                        }}
                        keyboardType={"numeric"}
                        onSubmitEditing={() => Keyboard.dismiss()}
                        style={styles.formInputFields}
                        placeholder="Limit Price"
                        placeholderTextColor={COLORS.darkgreyColor}
                        returnKeyType={"done"}
                        activeOutlineColor={COLORS.primaryColor}
                        selectionColor={COLORS.greyColor}
                        cursorColor={COLORS.blackColor}
                      />
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.buySellButtonContainer,
                    {
                      justifyContent:
                        isBuy && isSell ? "space-around" : "center",
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <TradeActionButton
                      title="SELL"
                      backgroundColor={COLORS.failure}
                      loading={sellLoading}
                      skeleton={product?.quantityList?.length === 0}
                      disabled={
                        disableTouchRef.current ||
                        isDisableByNotNumber(product?.bid)
                      }
                      onPress={() => {
                        if (!disableTouchRef.current) {
                          disableTouchRef.current = true;
                          onBuySellPress(tradeAtType, "Sell");
                        }
                      }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <TradeActionButton
                      title="BUY"
                      backgroundColor={COLORS.success}
                      loading={buyLoading}
                      skeleton={product?.quantityList?.length === 0}
                      disabled={
                        disableTouchRef.current ||
                        isDisableByNotNumber(product?.ask)
                      }
                      onPress={() => {
                        if (!disableTouchRef.current) {
                          disableTouchRef.current = true;
                          onBuySellPress(tradeAtType, "Buy");
                        }
                      }}
                    />
                  </View>
                </View>
              </View>
              {isFullScreen && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={onCloseRequest}
                  style={styles.closeButton}
                >
                  <StaticBackground isGradient />
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </TouchableOpacity>
        </SafeAreaView>
      </SafeAreaProvider>

      {orderStatusModal.visible && (
        <View>
          <TradeStatus {...orderStatusModal} />
        </View>
      )}
    </Modal>
  );
};

export default BuySellModal;

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
    borderColor: COLORS.boxBorder,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    overflow: "hidden",
    backgroundColor: COLORS.whiteColor,
    ...SHADOW,
    shadowColor: COLORS.primaryColor,
    paddingVertical: 8,
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
    backgroundColor: COLORS.transparent,
    zIndex: 4,
  },
  modalTitleContainer: {
    borderRadius: 8,
    borderWidth: 2,
    width: "95%",
    alignSelf: "center",
    marginTop: 10,
    borderColor: COLORS.boxBorder,
    backgroundColor: COLORS.secondaryColor,
    padding: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.Bold,
    color: COLORS.primaryColor,
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
    backgroundColor: COLORS.whiteColor,
  },
  marketTradeTypeContainer: {
    // width: "90%",
    marginHorizontal: 5,
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: 15,
    borderRadius: 5,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
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
  limitFieldContainer: {
    backgroundColor: COLORS.transparent,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  limitTitle: {
    fontFamily: FONTS.Semi_Bold,
    fontSize: 15,
    color: COLORS.blackColor,
  },
  formInputFields: {
    width: 180,
    height: 45,
    paddingHorizontal: 10,
    borderColor: COLORS.primaryColor,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 14,
    fontFamily: FONTS.Medium,
    color: COLORS.blackColor,
    includeFontPadding: false,
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
    color: COLORS.whiteColor,
  },
});
