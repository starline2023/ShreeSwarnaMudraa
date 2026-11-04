import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import MainProducts from "../../components/LiveRates/MainProducts";
import MCXRates from "../../components/LiveRates/MCXRates";
import StaticImageBackground from "../../components/background/StaticImageBackground";
import { FlashList } from "@shopify/flash-list";
import { WIDTH } from "../../../constants/Styles";
import StaticBackground from "../../components/background/StaticBackground";
import { FONTS } from "../../../constants/Fonts";
import { COLORS } from "../../../constants/Colors";
import EmptyListComponent from "../../components/emptyListComponent/EmptyListComponent";
import { useSelector } from "react-redux";

const data = ["Main", "Spot", "Future"];
const topTabs = [
  { id: 1, name: "Gold Rates", headerName: "GOLD PRODUCT", src: "gold" },
  { id: 2, name: "Silver Rate", headerName: "SILVER PRODUCT", src: "silver" },
];

const LiverateScreen = () => {
  const [selectedTab, setSelectedTab] = useState(topTabs[0]);

  const user = useSelector((store) => store?.user);
  const ratesInfo = useSelector((store) => store?.clientInfo?.RateInfo);

  const renderItem = ({ item }) => {
    switch (item) {
      case "Spot":
        return (
          <MCXRates
            title={"SPOT RATE"}
            showDiff={false}
            isHorizontal={false}
            symbols={["XAUUSD", "XAGUSD", "INRSpot", "DGINRI", "DGINRSPOT"]}
          />
        );
      case "Main":
        return user.isLoggedIn || ratesInfo?.isRateDisplay ? (
          <MainProducts type={selectedTab} />
        ) : (
          <EmptyListComponent
            displayText={`LIVE RATES ARE CURRENTLY NOT AVAILABLE`}
            height={100}
          />
        );
      case "Future":
        return (
          <MCXRates
            title={"FUTURE RATE"}
            showDiff={false}
            isHorizontal={false}
            numOfColumns={2}
            symbols={["gold", "silver", "goldnext", "silvernext"]}
          />
        );
      default:
        return null;
    }
  };
  return (
    <View style={styles.container}>
      <StaticBackground isBGImage />

      <FlashList
        data={data}
        renderItem={renderItem}
        estimatedItemSize={400}
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 50 }}
      />
      <View style={styles.tabsContainer}>
        {topTabs.map((i, ind) => {
          const isSelected = i?.id === selectedTab?.id;
          return (
            <TouchableOpacity
              key={`top-tab-${ind}`}
              activeOpacity={0.9}
              onPress={() => setSelectedTab(i)}
              style={[
                styles.tabsButton,
                isSelected && {
                  backgroundColor: COLORS.secondaryColor,
                  borderColor: COLORS.secondaryColor,
                },
              ]}
            >
              {/* {isSelected && <StaticBackground isGradient />} */}
              <Text style={styles.tabsTitle}>{i?.headerName}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default LiverateScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    height: 100,
    width: WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    marginVertical: 5,
  },
  tabsButton: {
    flex: 1,
    marginHorizontal: 6,
    padding: 6,
    // padding: 3,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 3,
    borderWidth: 1,
    borderColor: COLORS.secondaryColor,
    overflow: "hidden",
  },
  tabsTitle: {
    fontFamily: FONTS.Bold,
    color: COLORS.blackColor,
    fontSize: 15,
  },
});
