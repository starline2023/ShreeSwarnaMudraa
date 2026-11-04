import { AppState, FlatList, View } from "react-native";
import React, { useEffect, useState, useRef, useContext } from "react";
import { BidAskColor, inflateData } from "../../../constants/Functions";
import SpotCard from "../card/SpotCard";
import LiveRateHeaders from "./LiveRateHeaders";
import { useIsFocused } from "@react-navigation/native";
import { GLOBALS } from "../../../constants/GLOBALS";
import SpotHorizontalCard from "../card/SpotHorizontalCard";
import LiverateSkeleton from "../skeleton/LiverateSkeleton";
import { SignalRContext } from "../../../App";
import * as SignalR from "@microsoft/signalr";

const MCXRates = ({
  title,
  symbols,
  showDiff,
  isHorizontal,
  numOfColumns = 3,
}) => {
  const isFocused = useIsFocused();
  const signalRSocket = useContext(SignalRContext);

  const [MCXRates, setMCXRates] = useState([]);
  const [loading, setLoading] = useState(true);

  const MCXRatesRef = useRef({});
  const { mcxRates } = GLOBALS.signalRConnection;

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
      signalRSocket.state == SignalR.HubConnectionState.Connected
    ) {
      setLoading(MCXRates.length == 0);
      signalRSocket?.off(mcxRates, handleMCXRates);
      MCXRatesRef.current = {};
      signalRSocket?.on(mcxRates, handleMCXRates);
    }
    return () => {
      if (signalRSocket) {
        signalRSocket?.off(mcxRates, handleMCXRates);
      }
    };
  }, [appState, isFocused, signalRSocket, symbols]);

  const handleMCXRates = (rates) => {
    try {
      let data = inflateData(rates);
      const refDetails = data?.refDetails.reduce((map, curr) => {
        map[curr?.source?.toLowerCase()] = curr;
        return map;
      }, {});
      setMCXRates((prev) => {
        MCXRatesRef.current = prev.reduce((map, curr) => {
          map[curr?.symbol] = curr;
          return map;
        }, {});
        return data?.refProduct.reduce((prev, curr) => {
          const match = refDetails[curr?.symbol?.toLowerCase()];
          if (match) {
            prev.push({ ...curr, Symbol_Name: match.name });
          }
          return prev;
        }, []);
      });
    } catch (error) {
      console.log("handleMCXRates error:", error);
      setMCXRates([]);
    }
    setLoading(false);
  };

  const displayRates = MCXRates.filter((i) => symbols.includes(i?.symbol)).sort(
    (a, b) => symbols.indexOf(a.symbol) - symbols.indexOf(b.symbol),
  );

  return (
    <View style={{ minHeight: 5, marginVertical: 3 }}>
      {loading ? (
        <LiverateSkeleton
          type={isHorizontal ? (numOfColumns == 2 ? 3 : 2) : 1}
        />
      ) : (
        <>
          {displayRates.length > 0 && !isHorizontal && (
            <LiveRateHeaders
              mainHeaderText={`${title.toUpperCase()}`}
              subHeader={["BUY", "SELL", "HIGH", "LOW"]}
              mainHeaderWidth={"26%"}
            />
          )}
          <FlatList
            data={displayRates}
            extraData={[1, 2]}
            estimatedItemSize={300}
            {...(isHorizontal ? { numColumns: numOfColumns } : {})}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => index}
            renderItem={({ item, index }) => {
              const previousItem = MCXRatesRef.current[item?.symbol];
              const BidColors = BidAskColor(previousItem?.Bid, item?.Bid);
              const AskColors = BidAskColor(previousItem?.Ask, item?.Ask);
              // console.log(AskColors);
              if (isHorizontal) {
                return (
                  <SpotHorizontalCard
                    numOfColumns={numOfColumns}
                    item={item}
                    index={index}
                    BidColors={BidColors}
                    AskColors={AskColors}
                    showDiff={showDiff}
                  />
                );
              } else {
                return (
                  <SpotCard
                    item={item}
                    index={index}
                    BidColors={BidColors}
                    AskColors={AskColors}
                    showDiff={showDiff}
                  />
                );
              }
            }}
          />
        </>
      )}
    </View>
  );
};

export default MCXRates;
