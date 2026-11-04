import { StyleSheet, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../../../constants/Colors";
import { FONTS } from "../../../../constants/Fonts";
import { convertDateFormat } from "../../../../constants/Functions";
import { FlashList } from "@shopify/flash-list";
import EmptyListComponent from "../../../components/emptyListComponent/EmptyListComponent";
import { useIsFocused } from "@react-navigation/native";
import { getAPI, postAPI } from "../../../../constants/APIs";
import { GLOBALS } from "../../../../constants/GLOBALS";
import { HEIGHT, WIDTH } from "../../../../constants/Styles";
import NewsCard from "../../../components/card/NewsCard";
import StaticImageBackground from "../../../components/background/StaticImageBackground";
import FromToDatePicker from "../../../components/DatePicker/FromToDatePicker";
import CustomHeader from "../../../components/header/CustomHeader";
import Marquee from "../../../components/Marquee/Marquee";
import { navigate } from "../../../navigations/RootNavigation";
import StaticBackground from "../../../components/background/StaticBackground";

const { primaryColor, blackColor, whiteColor } = COLORS;
const { Bold, Medium, Regular } = FONTS;

const News = () => {
  const isfocused = useIsFocused();

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (isfocused) {
      fetchNewsList();
    }
  }, [isfocused]);
  const fetchNewsList = async () => {
    try {
      setLoading(true);

      let response = await getAPI(
        `updateDetails?user=${GLOBALS.FirmName}&fromDate=${convertDateFormat(
          startDate,
        )}&toDate=${convertDateFormat(endDate)}`,
      );
      setNewsList(response?.code == 200 ? response?.data : []);
      setLoading(false);
    } catch (error) {
      console.log("fetchNewsList ", error);
      setLoading(true);
    }
  };
  return (
    <View style={styles.container}>
      <StaticBackground isBGImage />
      {/* <CustomHeader /> */}
      {/* {GLOBALS.isTerminal && (
        <CustomHeader
          onBackPress={() => navigate("BottomTabs", { name: "Liverate" })}
          // onBackPress={() => navigationRef.goBack()}
        />
      )} */}
      {/* <Marquee position={"Top"} /> */}
      <FromToDatePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        onSearch={fetchNewsList}
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={"large"} color={COLORS.blackColor} />
        </View>
      ) : (
        <FlashList
          data={newsList}
          extraData={[1, 2]}
          estimatedItemSize={150}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            return <NewsCard item={item} />;
          }}
          ListEmptyComponent={() => {
            return (
              <EmptyListComponent
                displayText={"No Updates Available on Selected Dates"}
              />
            );
          }}
          ListFooterComponent={() => {
            return <View style={styles.emptyFooter} />;
          }}
        />
      )}
    </View>
  );
};

export default News;

const styles = StyleSheet.create({
  container: { flex: 1 },
  dateContainer: {
    flexDirection: "row",
    width: "95%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-evenly",
    marginVertical: 8,
  },
  dateButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    // paddingHorizontal: 7,
    backgroundColor: primaryColor,
    borderRadius: 5,
    marginHorizontal: 3,
  },
  dateText: {
    fontFamily: Medium,
    fontSize: 15,
    color: whiteColor,
  },
  loadingContainer: {
    height: HEIGHT * 0.6,
    width: WIDTH,
    // backgroundColor: whiteColor,
    justifyContent: "center",
    alignItems: "center",
  },
  newsCard: {
    borderRadius: 5,
    backgroundColor: whiteColor,
    borderWidth: 1,
    borderColor: primaryColor,
    margin: 8,
    overflow: "hidden",
  },
  TitleTimeContainer: {
    backgroundColor: primaryColor,
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    paddingHorizontal: 10,
  },
  newsTitle: {
    fontFamily: Bold,
    color: whiteColor,
    fontSize: 18,
    width: "70%",
  },
  newsTime: {
    flex: 1,
    fontFamily: Regular,
    color: whiteColor,
    fontSize: 10,
    textAlign: "right",
  },
  newsDescription: {
    fontFamily: Regular,
    color: blackColor,
    fontSize: 14,
  },
  emptyFooter: {
    height: 25,
  },
});
