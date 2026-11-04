import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Linking,
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
import { getAPI_Terminal, postAPI_Terminal } from "../../../constants/APIs";
import { logoutAction, OrderDetailsUpdate } from "../../redux/action";
import FromToDatePicker from "../../components/DatePicker/FromToDatePicker";
import StaticImageBackground from "../../components/background/StaticImageBackground";
import UserBalanceCard from "../../components/card/UserBalanceCard";
import { GLOBALS } from "../../../constants/GLOBALS";
import { Images } from "../../../constants/Images";
import CalculatorModal from "../../components/customModals/CalculatorModal";
import StaticBackground from "../../components/background/StaticBackground";

const orderType = [
  {
    tabName: "Execute",
    apiEndpoint: "open",
    tabIndex: 0,
    filterTradeTypes: [1, 2],
    checkNull: "OpenOrder",
  },
  {
    tabName: "Pending",
    apiEndpoint: "open",
    tabIndex: 1,
    filterTradeTypes: [3, 4],
    checkNull: "OpenOrder",
  },
  {
    tabName: "Close",
    apiEndpoint: "close",
    tabIndex: 2,
    filterTradeTypes: [],
    checkNull: "CloseOrder",
  },
  {
    tabName: "Delete",
    apiEndpoint: "delete",
    tabIndex: 3,
    filterTradeTypes: [],
    checkNull: "DeleteOrder",
  },
];
const TradeScreen = (props) => {
  const dispatch = useDispatch();
  const handleSnackBar = OpenSnackbar();
  const isFocused = useIsFocused();
  const getTerminalApiResponse = getAPI_Terminal();
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

  const [calculateOrders, setCalculateOrders] = useState([]);
  const [calcModal, setCalcModal] = useState(false);

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
        (_, ind) => (ind == tradeTab.tabIndex ? true : _),
      ),
    );
    setCalculateOrders([]);
    try {
      const Token = user?.userDetails?.Data?.token;
      if (Token == undefined) {
        dispatch(logoutAction());
        setLoading((prev) =>
          prev.map((_, ind) => (ind == tradeTab.tabIndex ? false : _)),
        );
        return;
      }
      let openOrderList = "";
      let orderList = await getTerminalApiResponse(
        `orderList?orderType=${
          tradeTab.apiEndpoint
        }&fromDate=${convertDateFormat(startDate)}&toDate=${convertDateFormat(
          endDate,
        )}&searchData=`,
        Token,
      );
      if (tradeTab.apiEndpoint != "open") {
        openOrderList = await getTerminalApiResponse(
          `orderList?orderType=open&fromDate=${convertDateFormat(
            startDate,
          )}&toDate=${convertDateFormat(endDate)}&searchData=`,
          Token,
        );
      } else {
        openOrderList = orderList;
      }
      if (orderList.code == "200") {
        let accDetails = JSON.parse(openOrderList.message);
        setAccountDetails(accDetails || null);
        dispatch({
          type: "USER_BALANCE",
          payload: accDetails,
        });
        setOrdersList((prev) =>
          prev.map((item, index) => {
            if (index !== tradeTab.tabIndex) return item;

            const { filterTradeTypes } = tradeTab;
            const shouldFilter = filterTradeTypes.length > 0;

            return shouldFilter
              ? orderList.data.filter((o) =>
                  filterTradeTypes.includes(o.tradeType),
                )
              : orderList.data;
          }),
        );
      } else {
        handleSnackBar(
          `Something Went Wrong, Please Login Again &  Try Again Later!`,
          false,
        );
        dispatch(logoutAction());
        setLoading((prev) =>
          prev.map((_, ind) => (ind == tradeTab.tabIndex ? false : _)),
        );
        return;
      }
    } catch (error) {
      console.log("fetchOrders error :", error);
      handleSnackBar(`Something Went Wrong, Please Try Again Later!`, false);
    }
    setLoading((prev) =>
      prev.map((_, ind) => (ind == tradeTab.tabIndex ? false : _)),
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
  const handleSelect = (order, isSelected) => {
    try {
      if (isSelected) {
        setCalculateOrders((prev) =>
          prev.filter((i) => i?.dealNo !== order?.dealNo),
        );
      } else {
        if (
          calculateOrders.length > 0 &&
          order?.Source != calculateOrders[0]?.Source
        ) {
          handleSnackBar(
            `Please select ${calculateOrders[0]?.Source?.toUpperCase()} orders only`,
            false,
          );
          return;
        } else {
          setCalculateOrders((prev) => [...prev, order]);
        }
      }
    } catch (error) {
      setCalculateOrders([]);
    }
  };

  return (
    <View style={styles.container}>
      <StaticBackground isBGImage />
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

          {GLOBALS.hasTradeCalculator &&
            calculateOrders.length > 0 &&
            selectedOrderType?.tabIndex == 0 && (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setCalcModal(true)}
                style={styles.calculatorButton}
              >
                <Image source={Images.calculator} style={styles.calImage} />
                <Text style={styles.calculatorButtonText}>Calculate TDS</Text>
              </TouchableOpacity>
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
                        color={COLORS.primaryColor}
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
                      const isSelected = calculateOrders.some(
                        (o) => o?.dealNo == item?.dealNo,
                      );
                      return (
                        <View>
                          <TradeCard
                            order={item}
                            type={selectedOrderType.tabName}
                            onRefresh={() => fetchOrders(selectedOrderType)}
                            onSelect={handleSelect}
                            isSelected={isSelected}
                            isCalculator={true}
                            isTrade={true}
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
                          displayText={`No ${selectedOrderType.tabName} Orders available for Selected Dates`}
                          height={150}
                        />
                      );
                    }}
                  />
                </View>
              );
            })}
          </ScrollView>
          {calcModal && (
            // <View>
            <CalculatorModal
              visible={calcModal}
              orders={calculateOrders}
              onDismiss={() => setCalcModal(false)}
            />
            // </View>
          )}
        </>
      )}
    </View>
  );
};

export default TradeScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  calculatorButton: {
    width: "95%",
    flexDirection: "row",
    alignSelf: "center",
    backgroundColor: COLORS.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    paddingVertical: 5,
    marginTop: 5,
  },
  calculatorButtonText: {
    fontFamily: FONTS.Bold,
    fontSize: 14,
    color: COLORS.whiteColor,
  },
  calImage: {
    height: 20,
    width: 20,
    resizeMode: "contain",
    tintColor: COLORS.whiteColor,
    marginRight: 10,
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
    // backgroundColor: COLORS.modalBackground,
    position: "absolute",
    zIndex: 3,
  },
});
