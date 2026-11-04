import { AppState, LayoutAnimation, View } from "react-native";
import React, { useState, useRef, useEffect, useContext } from "react";
import { FlashList } from "@shopify/flash-list";
import { BidAskColor, inflateData } from "../../../constants/Functions";
import EmptyListComponent from "../emptyListComponent/EmptyListComponent";
import LiveRateHeaders from "./LiveRateHeaders";
import { HEIGHT } from "../../../constants/Styles";
import { useSelector } from "react-redux";
import { GLOBALS } from "../../../constants/GLOBALS";
import { useIsFocused } from "@react-navigation/native";
import LiverateSkeleton from "../skeleton/LiverateSkeleton";
import { navigate } from "../../navigations/RootNavigation";
import CoinRateCard from "../card/CoinRateCard";
import { SignalRContext, SocketContext } from "../../../App";
import { COLORS } from "../../../constants/Colors";
import * as SignalR from "@microsoft/signalr";
import CoinBuySellModal from "../customModals/CoinBuySellModal";

const CoinRates = ({ type }) => {
  const ratesInfo = useSelector((store) => store?.clientInfo?.RateInfo);
  const signalRSocket = useContext(SignalRContext);

  const isFocused = useIsFocused();
  const user = useSelector((store) => store?.user);

  const [coinProducts, setCoinProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);
  const [buySellModalVisible, setBuySellModalVisible] = useState(false);

  const coinProductsRef = useRef(null);
  const { clientConnection, coinRates, connectionError } =
    GLOBALS.signalRConnection;
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
      signalRSocket.state === SignalR.HubConnectionState.Connected
    ) {
      setLoading(coinProducts.length == 0);

      signalRSocket?.off(coinRates, handleCoinRates);
      signalRSocket?.on(coinRates, handleCoinRates);
      // signalRSocket?.invoke(clientConnection, GLOBALS.FirmName);
    }
    return () => {
      if (signalRSocket) {
        signalRSocket.off(coinRates, handleCoinRates);
      }
    };
  }, [appState, isFocused, signalRSocket]);

  const handleCoinRates = (rates) => {
    try {
      let data = inflateData(rates);
      setCoinProducts((prev) => {
        coinProductsRef.current = prev.reduce((map, curr) => {
          map[curr?.id] = curr;
          return map;
        }, {});
        return data?.products;
      });
    } catch (error) {
      console.log("handleCoinRates error:", error);
      setCoinProducts([]);
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

  return (
    <View style={{ minHeight: 5, marginVertical: 5 }}>
      {loading ? (
        <LiverateSkeleton type={1} />
      ) : (
        <>
          {buySellModalVisible ? (
            <View>
              <CoinBuySellModal
                visible={buySellModalVisible}
                product={coinProducts.find((i) => i?.id == selected?.id)}
                isBuy={false}
                isSell={true}
                groupSymbols={[]}
                previousItem={coinProductsRef.current[selected?.id]}
                onClose={() => {
                  toggleModal(selected);
                }}
              />
            </View>
          ) : (
            <>
              {ratesInfo?.isCoinRateDisplay ? (
                <>
                  {coinProducts?.length > 0 && (
                    <View key={`COIN-RATES-${1}`}>
                      {coinProducts?.length > 0 && (
                        <LiveRateHeaders
                          // backgroundColor={COLORS.boxBorder}
                          mainHeaderText={type?.title}
                          subHeader={["PRICE"]}
                          mainHeaderWidth={"40%"}
                        />
                      )}

                      <FlashList
                        data={coinProducts?.filter(
                          (i) =>
                            i?.src?.toLowerCase()?.trim() ===
                            type?.filterByValue?.toLowerCase()?.trim()
                        )}
                        extraData={[1, 2]}
                        estimatedItemSize={300}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        maintainVisibleContentPosition={{
                          disabled: true,
                        }}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => {
                          const previousItem =
                            coinProductsRef.current[item?.id];

                          if (!item) return null;

                          return (
                            <CoinRateCard
                              item={item}
                              index={index}
                              BidColors={BidAskColor(
                                previousItem?.bid,
                                item?.bid
                              )}
                              AskColors={BidAskColor(
                                previousItem?.ask,
                                item?.ask
                              )}
                              onSelectItemPress={handleOpenBuySell}
                            />
                          );
                        }}
                        ListEmptyComponent={() => (
                          <EmptyListComponent
                            displayText={`${type?.title?.toUpperCase()} RATES ARE CURRENTLY NOT AVAILABLE`}
                            height={100}
                          />
                        )}
                      />
                    </View>
                  )}
                </>
              ) : (
                <EmptyListComponent
                  displayText="COIN RATES ARE CURRENTLY NOT AVAILABLE"
                  height={HEIGHT * 0.1}
                />
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};

export default CoinRates;
