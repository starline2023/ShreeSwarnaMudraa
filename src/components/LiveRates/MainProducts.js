import { AppState, LayoutAnimation, View } from "react-native";
import React, { useState, useRef, useEffect, useContext } from "react";
import { FlashList } from "@shopify/flash-list";
import {
  BidAskColor,
  CalculateTerminalRate,
  inflateData,
} from "../../../constants/Functions";
import EmptyListComponent from "../emptyListComponent/EmptyListComponent";
import LiveRateHeaders from "./LiveRateHeaders";
import MainProductCard from "../card/MainProductCard";
import { HEIGHT } from "../../../constants/Styles";
import { useSelector } from "react-redux";
import { GLOBALS } from "../../../constants/GLOBALS";
import { useIsFocused } from "@react-navigation/native";
import LiverateSkeleton from "../skeleton/LiverateSkeleton";
import { navigate } from "../../navigations/RootNavigation";
import BuySellModal from "../customModals/BuySellModal";
import { SignalRContext } from "../../../App";
import * as SignalR from "@microsoft/signalr";
import { COLORS } from "../../../constants/Colors";

const displayKeys = { False: false, True: true };

const MainProducts = ({ type }) => {
  const isFocused = useIsFocused();
  const signalRSocket = useContext(SignalRContext);

  const user = useSelector((store) => store?.user);
  const ratesInfo = useSelector((store) => store?.clientInfo?.RateInfo);
  const groupDetails = useSelector((store) => store?.groupData);

  const [mainProduct, setMainProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState(null);
  const [buySellModalVisible, setBuySellModalVisible] = useState(false);

  const mainProductRef = useRef({});
  const { mainProductRates } = GLOBALS.signalRConnection;
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const app = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      app.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    setAppState(nextAppState);
  };
  useEffect(() => {
    if (
      appState == "active" &&
      isFocused &&
      signalRSocket &&
      signalRSocket?.state == SignalR.HubConnectionState.Connected
    ) {
      setLoading(mainProduct.length == 0);
      signalRSocket?.off(mainProductRates, handleMainProductRates);
      mainProductRef.current = {};
      signalRSocket?.on(mainProductRates, handleMainProductRates);
    }
    return () => {
      if (signalRSocket) {
        signalRSocket?.off(mainProductRates, handleMainProductRates);
      }
      toggleModal(null);
    };
  }, [appState, isFocused, signalRSocket]);

  useEffect(() => {
    toggleModal(null);
  }, [user?.isLoggedIn]);

  const handleMainProductRates = (rates) => {
    try {
      let data = inflateData(rates, true);
      setMainProduct((prev) => {
        mainProductRef.current = prev.reduce((map, curr) => {
          map[curr?.id] = curr;
          return map;
        }, {});
        return data?.products;
      });
    } catch (error) {
      console.log("handleMainProductRates error:", error);
      setMainProduct([]);
    }
    setLoading(false);
  };
  const toggleModal = (prod) => {
    try {
      if (prod == null || selected?.id == prod?.id) {
        setSelected(null);
        setBuySellModalVisible(false);
      } else {
        setSelected(prod);
        setBuySellModalVisible(true);
      }
    } catch (error) {
      console.log("toggleModal error :", error);
      toggleModal(null);
    }
  };
  const handleOpenBuySell = (prod) => {
    if (!GLOBALS.isTerminal) {
      return;
    }
    if (!user?.isLoggedIn) {
      toggleModal(null);
      navigate("Login");
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      toggleModal(prod);
    }
  };

  const subHeader = [
    ratesInfo?.isBuy ? "BUY" : "",
    ratesInfo?.isSell ? "SELL" : "",
    ratesInfo?.isHigh ? "HIGH" : "",
    ratesInfo?.isLow ? "LOW" : "",
  ];

  const displayedSubHeader = subHeader.filter((item) => item.length);
  const calcTextWidth = 100 / displayedSubHeader.length - 1.5;
  const textWidth = `${calcTextWidth > 70 ? 70 : calcTextWidth}%`;

  return (
    <View style={{ minHeight: 5, marginVertical: 1 }}>
      {loading ? (
        <LiverateSkeleton type={1} />
      ) : (
        <>
          {buySellModalVisible ? (
            <View>
              <BuySellModal
                visible={buySellModalVisible}
                product={mainProduct.find((i) => i?.id == selected?.id)}
                isBuy={ratesInfo?.isBuy}
                isSell={ratesInfo?.isSell}
                groupSymbols={groupDetails?.SymbolGroup}
                commonGrp={groupDetails?.SymbolCommonGroup}
                previousItem={mainProductRef.current[selected?.id]}
                onClose={() => {
                  toggleModal(selected);
                }}
              />
            </View>
          ) : (
            <>
              {mainProduct.filter((i) => i?.src === type?.src).length > 0 && (
                <LiveRateHeaders
                  mainHeaderText={"PRODUCTS"}
                  subHeader={subHeader}
                  mainHeaderWidth={"24%"}
                />
              )}
              <FlashList
                data={mainProduct.filter((i) => i?.src === type?.src)}
                // data={mainProduct}
                extraData={[1, 2]}
                keyExtractor={(item) => item.id.toString()}
                // keyExtractor={(item, index) => index}
                estimatedItemSize={300}
                maintainVisibleContentPosition={{ disabled: true }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  const terminalLogin = user?.isLoggedIn ? item?.it : item?.iv;
                  const isDisplaySymbol = GLOBALS.isTerminal
                    ? terminalLogin
                    : true;
                  if (!isDisplaySymbol) return;
                  const previousItem = mainProductRef.current[item?.id];
                  const BidColors = BidAskColor(previousItem?.bid, item?.bid);
                  const AskColors = BidAskColor(previousItem?.ask, item?.ask);

                  let calculatedItem = item;

                  if (user?.isLoggedIn) {
                    calculatedItem = CalculateTerminalRate(
                      item,
                      groupDetails?.SymbolGroup,
                    );
                    if (!calculatedItem) return;
                  }
                  return (
                    <MainProductCard
                      item={calculatedItem}
                      index={index}
                      BidColors={BidColors}
                      AskColors={AskColors}
                      textWidth={textWidth}
                      onSelectItemPress={handleOpenBuySell}
                    />
                  );
                }}
                ListEmptyComponent={() => {
                  return (
                    <EmptyListComponent
                      displayText={`LIVE RATES ARE CURRENTLY NOT AVAILABLE`}
                      height={HEIGHT * 0.1}
                    />
                  );
                }}
              />
            </>
          )}
        </>
      )}
    </View>
  );
};

export default MainProducts;
