import React from "react";
import { StyleSheet, View } from "react-native";
import StaticImageBackground from "../../components/background/StaticImageBackground";
import CoinRates from "../../components/LiveRates/CoinRates";
import { FlashList } from "@shopify/flash-list";
import { useSelector } from "react-redux";
import EmptyListComponent from "../../components/emptyListComponent/EmptyListComponent";
import { HEIGHT } from "../../../constants/Styles";

const CoinRatesScreen = () => {
  const ratesInfo = useSelector((store) => store?.clientInfo?.RateInfo);
  const user = useSelector((store) => store?.user);

  const coinTypes = [
    {
      id: 1,
      title: ratesInfo?.goldCoin?.title,
      isDisplay: ratesInfo?.goldCoin?.display,
      filterByValue: "gold",
    },
    {
      id: 2,
      title: ratesInfo?.silverCoin?.title,
      isDisplay: ratesInfo?.silverCoin?.display,
      filterByValue: "silver",
    },
  ];
  return (
    <View style={styles.container}>
      <StaticImageBackground />
      {user.isLoggedIn || ratesInfo?.isCoinRateDisplay ? (
        <FlashList
          data={coinTypes}
          renderItem={({ item }) => {
            if (!item?.isDisplay) {
              return (
                <EmptyListComponent
                  displayText={`${item?.title?.toUpperCase()} COIN RATES ARE CURRENTLY NOT AVAILABLE`}
                  height={100}
                />
              );
            } else {
              return <CoinRates type={item} />;
            }
          }}
          estimatedItemSize={400}
          nestedScrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 50 }}
        />
      ) : (
        <EmptyListComponent
          displayText={`COIN RATES ARE CURRENTLY NOT AVAILABLE`}
          height={100}
        />
      )}
    </View>
  );
};

export default CoinRatesScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
