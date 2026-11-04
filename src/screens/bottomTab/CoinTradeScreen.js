import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { useIsFocused } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { FONTS } from "../../../constants/Fonts";
import { COLORS } from "../../../constants/Colors";
import { convertDateFormat, OpenSnackbar } from "../../../constants/Functions";
import CustomTopTab from "../../components/topTab/CustomTopTab";
import TradeCard from "../../components/card/TradeCard";
import EmptyListComponent from "../../components/emptyListComponent/EmptyListComponent";
import { HEIGHT, WIDTH } from "../../../constants/Styles";
import { postAPI_Terminal } from "../../../constants/APIs";
import { logoutAction, OrderDetailsUpdate } from "../../redux/action";
import FromToDatePicker from "../../components/DatePicker/FromToDatePicker";
import StaticImageBackground from "../../components/background/StaticImageBackground";
import UserBalanceCard from "../../components/card/UserBalanceCard";
import { GLOBALS } from "../../../constants/GLOBALS";

const { primaryColor, secondaryColor, blackColor, whiteColor } = COLORS;
const { Medium } = FONTS;

const orderType = [
  {
    tabName: "Execute",
    apiEndpoint: "GetCoinsOpenOrderDetails",
    tabIndex: 0,
    // filterTradeTypes: [1, 2],
    filterTradeTypes: [],
    listKey: "OpenOrder",
  },
  {
    tabName: "Close",
    apiEndpoint: "GetCloseOrderCoinDetails",
    tabIndex: 1,
    filterTradeTypes: [],
    listKey: "ClosedOrder",
  },
  {
    tabName: "Delete",
    apiEndpoint: "GetDeleteOrderCoinDetails",
    tabIndex: 2,
    filterTradeTypes: [],
    listKey: "DeleteOrder",
  },
];
const CoinTradeScreen = (props) => {
  const dispatch = useDispatch();
  const postTerminalApiResponse = postAPI_Terminal();
  const handleSnackBar = OpenSnackbar();
  const isFocused = useIsFocused();
  const user = useSelector((store) => store?.user);
  const orderDetails = useSelector((store) => store?.orderDetails);
  const scrollViewRef = useRef(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [orderList, setOrdersList] = useState(orderType.map(() => []));
  const [loading, setLoading] = useState(orderType.map(() => false));
  // const orderType = ["Execute", "Pending", "Close", "Delete"];

  const [selectedOrderType, setSelectedOrderType] = useState(orderType[0]);
  const [accountDetails, setAccountDetails] = useState(null);

  useEffect(() => {
    if (isFocused) {
      if (!props?.route?.params?.scrollTo) {
        fetchOrders(selectedOrderType);
      } else {
        handleTabChange(props?.route?.params?.scrollTo?.tab);
        if (props?.route?.params?.scrollTo?.tab == selectedOrderType.tabIndex) {
          fetchOrders(selectedOrderType);
        }
      }
    }
    return () => {
      props?.navigation?.setParams({ scrollTo: undefined });
    };
  }, [isFocused]);
  useEffect(() => {
    if (isFocused && orderDetails != null) {
      const indexToScroll = orderType
        .map((e) => e.apiEndpoint)
        .indexOf(orderDetails.type);
      if (indexToScroll != -1) {
        handleTabChange(indexToScroll);
        if (indexToScroll == selectedOrderType.tabIndex) {
          fetchOrders(selectedOrderType);
        }
      }
      dispatch(OrderDetailsUpdate(null));
    }
  }, [orderDetails]);

  const fetchOrders = async (tradeTab) => {
    if (!user?.isLoggedIn) return;
    setLoading((prev) =>
      prev.map(
        // (_, ind) => (ind == tradeTab.tabIndex ? orderList[ind].length == 0 : _)
        (_, ind) => (ind == tradeTab.tabIndex ? true : _)
      )
    );
    try {
      const Token = user?.userDetails?.Data?.token;
      if (Token == undefined) {
        dispatch(logoutAction());
        setLoading((prev) =>
          prev.map((_, ind) => (ind == tradeTab.tabIndex ? false : _))
        );
        return;
      }
      // let openOrderList = "";
      let orderReqObj = {
        loginid: parseInt(user?.userDetails?.Data?.LoginId),
        Firmname: GLOBALS.FirmName,
        ClientID: GLOBALS.ClientId,
        Fromdate: convertDateFormat(startDate),
        Todate: convertDateFormat(endDate),
      };
      let orderList = await postTerminalApiResponse(
        tradeTab.apiEndpoint,
        orderReqObj
      );

      if (orderList.returnCode == 200) {
        setOrdersList((prev) =>
          prev.map((item, index) => {
            if (index !== tradeTab.tabIndex) return item;

            const { filterTradeTypes, listKey } = tradeTab;
            const shouldFilter = filterTradeTypes.length > 0;
            // const parsedList = orderList?.data[listKey];
            return shouldFilter
              ? orderList?.data.filter((o) =>
                  filterTradeTypes.includes(parseInt(o.tradeType))
                )
              : orderList?.data;
          })
        );
      } else {
        handleSnackBar(
          `Something Went Wrong, Please Login Again & Try Again Later!`,
          false
        );
        dispatch(logoutAction());
        setLoading((prev) =>
          prev.map((_, ind) => (ind == tradeTab.tabIndex ? false : _))
        );
        return;
      }
    } catch (error) {
      console.log("fetchOrders error :", error);
      handleSnackBar(`Something Went Wrong, Please Try Again Later!`, false);
    }
    setLoading((prev) =>
      prev.map((_, ind) => (ind == tradeTab.tabIndex ? false : _))
    );
  };

  const handleTabChange = (index) => {
    try {
      if (index != null) {
        scrollViewRef?.current.scrollTo({
          x: index * WIDTH,
          y: 0,
          animated: true,
        });
      }
    } catch (error) {}
  };
  const onScrollHorizontal = (e) => {
    try {
      let contentOffset = e.nativeEvent.contentOffset;
      let viewSize = e.nativeEvent.layoutMeasurement;

      let newPageNum = Math.round(contentOffset.x / viewSize.width + 1) - 1;
      if (newPageNum != selectedOrderType.tabIndex) {
        fetchOrders(orderType[newPageNum]);
        setSelectedOrderType(orderType[newPageNum]);
      }
    } catch (error) {}
  };
  return (
    <View style={styles.container}>
      <StaticImageBackground />
      {!user?.isLoggedIn ? (
        <EmptyListComponent
          displayText={"Please Login to Access Orders"}
          height={HEIGHT * 0.7}
        />
      ) : (
        <>
          <FromToDatePicker
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onSearch={() => fetchOrders(selectedOrderType)}
          />
          {accountDetails != null && accountDetails != undefined && (
            <UserBalanceCard accountDetails={accountDetails} />
          )}

          <CustomTopTab
            tabArray={orderType}
            selectedTab={selectedOrderType}
            keyToAccess={"tabName"}
            onChangeTab={handleTabChange}
            suffix={`\nOrders`}
          />

          <ScrollView
            ref={scrollViewRef}
            decelerationRate={0}
            scrollEventThrottle={0}
            style={styles.scrollViewItems}
            horizontal={true}
            pagingEnabled={true}
            onScroll={(event) => onScrollHorizontal(event)}
            //onMomentumScrollEnd={(event) => this._onScroll(event)}
            nestedScrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            alwaysBounceHorizontal={false}
            automaticallyAdjustContentInsets={false}
          >
            {orderType.map((_, ind) => {
              return (
                <View
                  key={`${ind}_order_Type`}
                  style={{ minHeight: 5, width: WIDTH }}
                >
                  {loading[ind] && (
                    <View
                      key={`${ind}_order_Type`}
                      style={styles.orderListLoaderContainer}
                    >
                      <ActivityIndicator
                        size={"large"}
                        color={COLORS.blackColor}
                      />
                    </View>
                  )}

                  <FlashList
                    data={orderList[ind]}
                    // data={currentItem}
                    extraData={[1, 2]}
                    estimatedItemSize={300}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, index }) => {
                      return (
                        <View>
                          <TradeCard
                            order={item}
                            type={selectedOrderType.tabName}
                            onRefresh={() => fetchOrders(selectedOrderType)}
                            isCalculator={false}
                            isTrade={false}
                            // onRefresh={() => {}}
                          />
                          {index + 1 === orderList[ind].length && (
                            <View style={{ height: 20 }} />
                          )}
                        </View>
                      );
                    }}
                    ListEmptyComponent={() => {
                      return (
                        <EmptyListComponent
                          displayText={`No ${selectedOrderType.tabName} Orders avaialable for Selected Dates`}
                          height={150}
                        />
                      );
                    }}
                  />
                </View>
              );
            })}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default CoinTradeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  dateContainer: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 5,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 4,
  },
  dateText: {
    fontFamily: Medium,
    fontSize: 15,
    color: whiteColor,
    textAlign: "center",
  },
  verticalLineBreak: {
    backgroundColor: blackColor,
    width: 2,
    // marginHorizontal: 5,
  },
  balanceContainer: {
    padding: 10,
    margin: 5,
    borderRadius: 8,
    backgroundColor: secondaryColor + 50,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  balanceView: {
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "30%",
  },
  balanceText: {
    fontSize: 12,
    fontFamily: Medium,
    color: primaryColor,
  },

  scrollViewItems: {
    width: WIDTH,
    // minHeight: HEIGHT * 0.7,
  },
  orderListLoaderContainer: {
    height: "100%",
    width: WIDTH,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.transparent,
    position: "absolute",
    zIndex: 3,
  },
});
