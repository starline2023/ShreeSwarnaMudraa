import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useRef } from "react";
import StaticImageBackground from "../../../components/background/StaticImageBackground";
import CustomHeader from "../../../components/header/CustomHeader";
import { navigate } from "../../../navigations/RootNavigation";
import CustomTopTab from "../../../components/topTab/CustomTopTab";
import { WIDTH } from "../../../../constants/Styles";
import { COLORS } from "../../../../constants/Colors";
import { FONTS } from "../../../../constants/Fonts";
import Heading from "../../../components/header/Heading";
import { Images } from "../../../../constants/Images";
import { OpenSnackbar } from "../../../../constants/Functions";
import { useSelector } from "react-redux";

const metalsTab = [
  { name: "Gold", unit: "gm", divideBy: 10, tabIndex: 0 },
  { name: "Silver", unit: "kg", divideBy: 1, tabIndex: 1 },
];

const defaultValues = [
  {
    Weight: "0",
    Rate: "0",
    Percentage: "0.1",
  },
];

const Calculator = () => {
  const handleSnackBar = OpenSnackbar();

  const ratesInfo = useSelector((store) => store?.clientInfo?.RateInfo);

  const calculatorType = [
    {
      name: "TDS",
      percentage: ratesInfo?.tdsPercentage || 0.1,
      operation: "subtract",
      divideBy: 1,
    },
    {
      name: "TCS",
      percentage: ratesInfo?.tcsPercentage || 0.1,
      operation: "add",
      divideBy: 1,
    },
  ];

  const [selectedMetal, setSelectedMetal] = useState(metalsTab[0]);
  const [selectedCalCType, setSelectedCalCType] = useState(calculatorType[0]);
  const [calValueList, setCalValueList] = useState([...defaultValues]);

  const scrollViewRef = useRef(null);
  const headerText = [
    { text: `Weight`, width: "18%" },
    { text: "Unit", width: "15%" },
    { text: `${selectedCalCType?.name?.toLocaleUpperCase()}(%)`, width: "15%" },
    { text: "Rate(₹)", width: "21%" },
    { text: "Payable", width: "21%" },
    { text: "", width: "10%" },
  ];

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
  const handleCalculatorTypeChange = (item) => {
    try {
      setSelectedCalCType(item);
    } catch (error) {}
  };

  const onScrollHorizontalEnd = (e) => {
    try {
      const { contentOffset, layoutMeasurement } = e.nativeEvent;

      const pageWidth = layoutMeasurement.width;
      const offsetX = contentOffset.x;

      const fractionalPage = offsetX / pageWidth;
      const threshold = 0.8;

      // Get current + next page difference
      let newPageNum;

      if (fractionalPage % 1 > threshold) {
        newPageNum = Math.ceil(fractionalPage);
      } else {
        newPageNum = Math.floor(fractionalPage);
      }

      // Clamp page number to range
      newPageNum = Math.max(0, Math.min(newPageNum, metalsTab.length - 1));

      if (metalsTab[newPageNum] && newPageNum !== selectedMetal.tabIndex) {
        setSelectedMetal(metalsTab[newPageNum]);
        setCalValueList([...defaultValues]);
      }
    } catch (error) {
      console.log("onScrollHorizontalEnd error:", error);
    }
  };

  const handleAddMore = () => {
    try {
      setCalValueList((prev) => [...prev, ...defaultValues]);
    } catch (error) {
      console.log("handleAddMore error:", error);
    }
  };
  const handleRemoveValue = (ind) => {
    try {
      if (calValueList.length == 1) {
        handleSnackBar("Atleast one calculative is mandatory", false);
        return;
      } else {
        setCalValueList((prev) => prev.filter((i, index) => index != ind));
      }
    } catch (error) {
      console.log("handleRemoveValue error:", error);
    }
  };
  const handleCalculatorValues = (key, val, ind) => {
    try {
      setCalValueList((prev) =>
        prev.map((i, index) => (index != ind ? i : { ...i, [key]: val })),
      );
    } catch (error) {
      console.log("handleCalculatorValues error:", error);
    }
  };
  const calculateRate = (item) => {
    try {
      if (item?.Weight == 0 || item?.Rate == 0) {
        return 0;
      }
      const totalAmount =
        (parseFloat(item?.Weight) * parseFloat(item?.Rate)) /
        parseFloat(selectedMetal?.divideBy);

      const gstAmount = parseFloat(totalAmount) * 0.03;
      const taxSpecialAmount =
        parseFloat(totalAmount) / parseFloat(selectedCalCType?.divideBy);
      const taxAmount = taxSpecialAmount * (selectedCalCType?.percentage / 100);
      // const taxAmount = taxSpecialAmount * (item?.Percentage / 100);
      const payableAmount =
        selectedCalCType?.operation == "subtract"
          ? parseFloat(totalAmount) -
            parseFloat(taxAmount) +
            parseFloat(gstAmount)
          : parseFloat(totalAmount) +
            parseFloat(taxAmount) +
            parseFloat(gstAmount);

      return { taxAmount, payableAmount, totalAmount, gstAmount };
    } catch (error) {
      console.log("handleRemoveValue error:", error);
    }
  };

  const totalAmountVals = calValueList.reduce(
    (prev, curr) => {
      if (curr?.Rate == 0 || curr?.Weight == 0) return prev;
      const payableAmount = calculateRate(curr);
      prev["weight"] += parseFloat(curr?.Weight);
      prev["amount"] += parseFloat(payableAmount?.totalAmount);
      prev["taxAmount"] += parseFloat(payableAmount?.taxAmount);
      prev["gstAmount"] += parseFloat(payableAmount?.gstAmount);
      prev["payable"] += parseFloat(payableAmount?.payableAmount);
      return prev;
    },
    { weight: 0, amount: 0, taxAmount: 0, payable: 0, gstAmount: 0 },
  );
  const totalBoxItems = [
    {
      text: "Total Weight",
      value: `${totalAmountVals?.weight?.toFixed(0)} ${selectedMetal?.unit}`,
    },
    {
      text: "Total Amount",
      value: `₹${totalAmountVals?.amount?.toFixed(0)}`,
    },
    {
      text: `Total ${selectedCalCType?.name?.toLocaleUpperCase()}`,
      value: `₹${totalAmountVals?.taxAmount?.toFixed(2)}`,
    },
    {
      text: `Total GST (3%)`,
      value: `₹${totalAmountVals?.gstAmount?.toFixed(2)}`,
    },
    {
      text: "Payable",
      value: `₹${totalAmountVals?.payable?.toFixed(2)}`,
    },
  ];
  return (
    <View style={styles.container}>
      <StaticImageBackground />
      <CustomHeader />
      <Heading text={"TDS Calculator"} />
      <CustomTopTab
        tabArray={metalsTab}
        selectedTab={selectedMetal}
        keyToAccess={"name"}
        onChangeTab={handleTabChange}
      />
      {/* <View style={styles.radioButtonWrapper}>
        {calculatorType.map((item, index) => {
          const isSelected = item?.name == selectedCalCType?.name;
          return (
            <TouchableOpacity
              activeOpacity={0.8}
              key={`cal-c-type-${index}`}
              onPress={() => handleCalculatorTypeChange(item)}
              style={styles.radioButtonContainer}
            >
              <View style={styles.outerRadioButton}>
                {isSelected && <View style={styles.innerRadioButton} />}
              </View>
              <Text style={[styles.radioButtonText]}>{item?.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View> */}

      <ScrollView
        ref={scrollViewRef}
        // decelerationRate={0}
        // scrollEventThrottle={0}
        decelerationRate="fast"
        scrollEventThrottle={0}
        style={styles.scrollViewItems}
        horizontal={true}
        pagingEnabled={true}
        // onScroll={onScrollHorizontal}
        onMomentumScrollEnd={onScrollHorizontalEnd}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        alwaysBounceHorizontal={false}
        automaticallyAdjustContentInsets={false}
      >
        {metalsTab.map((_, ind) => {
          return (
            <ScrollView
              key={`${ind}_calculator`}
              style={{ minHeight: 5, width: WIDTH }}
            >
              <View style={styles.calItemContainer}>
                {headerText.map((headerItem, headerInd) => {
                  return (
                    <Text
                      key={`cal-header-${headerInd}-${ind}`}
                      style={[
                        styles.calHeaderText,
                        { width: headerItem?.width },
                      ]}
                    >
                      {headerItem?.text}
                    </Text>
                  );
                })}
              </View>
              {calValueList.map((calItem, calIndex) => {
                const payableAmount = calculateRate(calItem);
                return (
                  <View
                    key={`cal-value-card-${calIndex}-${ind}`}
                    style={[
                      styles.calItemContainer,
                      { backgroundColor: COLORS.greyColor },
                    ]}
                  >
                    <TextInput
                      value={calItem?.Weight}
                      onChangeText={(txt) =>
                        handleCalculatorValues("Weight", txt, calIndex)
                      }
                      keyboardType={"number-pad"}
                      placeholder={defaultValues[0]?.Weight}
                      placeholderTextColor={COLORS.imagePlaceHolder}
                      style={[
                        styles.calTextInput,
                        { width: headerText[0]?.width },
                      ]}
                    />
                    <Text
                      style={[
                        styles.calDescText,
                        { width: headerText[1]?.width },
                      ]}
                    >
                      {selectedMetal?.unit}
                    </Text>
                    <Text
                      style={[
                        styles.calDescText,
                        {
                          width: headerText[2]?.width,
                        },
                      ]}
                    >
                      {selectedCalCType?.percentage}
                    </Text>
                    {/* <View style={{ width: headerText[2]?.width }}>
                      <TextInput
                        value={calItem?.Percentage}
                        onChangeText={(txt) =>
                          handleCalculatorValues("Percentage", txt, calIndex)
                        }
                        keyboardType={"number-pad"}
                        placeholder={defaultValues[0]?.Percentage}
                        placeholderTextColor={COLORS.imagePlaceHolder}
                        style={[styles.calTextInput, { width: "90%" }]}
                      />
                    </View> */}
                    <TextInput
                      value={calItem?.Rate}
                      onChangeText={(txt) =>
                        handleCalculatorValues("Rate", txt, calIndex)
                      }
                      keyboardType={"number-pad"}
                      placeholder={defaultValues[0]?.Rate}
                      placeholderTextColor={COLORS.imagePlaceHolder}
                      style={[
                        styles.calTextInput,
                        { width: headerText[3]?.width },
                      ]}
                    />
                    <Text
                      style={[
                        styles.calDescText,
                        { width: headerText[4]?.width },
                      ]}
                    >
                      {payableAmount?.payableAmount?.toFixed(2)}
                    </Text>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handleRemoveValue(calIndex)}
                      style={styles.deleteIconContainer}
                    >
                      <Image source={Images.delete} style={styles.deleteIcon} />
                    </TouchableOpacity>
                  </View>
                );
              })}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={handleAddMore}
                style={styles.addButtonContainer}
              >
                <Text style={styles.calHeaderText}>Add More</Text>
              </TouchableOpacity>
              <View style={styles.totalBox}>
                {totalBoxItems?.map((totItem, totInd) => {
                  return (
                    <View
                      key={`totItem-${totInd}`}
                      style={styles.totalRowContainer}
                    >
                      <Text style={styles.totalDesc}>{totItem?.text}</Text>
                      <Text style={styles.totalDesc}>: {totItem?.value}</Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Calculator;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollViewItems: {
    width: WIDTH,
    // minHeight: HEIGHT * 0.7,
  },
  radioButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  outerRadioButton: {
    height: 20,
    width: 20,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.blackColor,
    marginRight: 4,
  },
  innerRadioButton: {
    height: 12,
    width: 12,
    borderRadius: 50,
    backgroundColor: COLORS.primaryColor,
  },
  radioButtonText: {
    fontFamily: FONTS.Bold,
    fontSize: 16,
    color: COLORS.blackColor,
  },
  calItemContainer: {
    width: "95%",
    alignSelf: "center",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 5,
    marginVertical: 2,
  },
  calHeaderText: {
    fontFamily: FONTS.Bold,
    fontSize: 12,
    color: COLORS.whiteColor,
    textAlign: "center",
  },
  calTextInput: {
    padding: 4,
    height: 40,
    borderBottomColor: COLORS.primaryColor,
    borderBottomWidth: 1,
    fontFamily: FONTS.Bold,
    fontSize: 12,
    color: COLORS.primaryColor,
  },
  calDescText: {
    fontFamily: FONTS.Bold,
    fontSize: 12,
    color: COLORS.primaryColor,
    textAlign: "center",
  },
  deleteIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 3,
    backgroundColor: COLORS.failure,
    borderRadius: 5,
  },
  deleteIcon: {
    height: 15,
    width: 15,
    resizeMode: "contain",
    tintColor: COLORS.whiteColor,
  },
  addButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    padding: 5,
    paddingHorizontal: 15,
    backgroundColor: COLORS.primaryColor,
    alignSelf: "center",
    borderRadius: 10,
  },
  totalBox: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: COLORS.primaryColor,
    width: "95%",
    alignSelf: "center",
  },
  totalRowContainer: { flexDirection: "row", alignItems: "center" },
  totalDesc: {
    width: "50%",
    fontFamily: FONTS.Bold,
    fontSize: 14,
    color: COLORS.whiteColor,
    textAlign: "left",
  },
});
