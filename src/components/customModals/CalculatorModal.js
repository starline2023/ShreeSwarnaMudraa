import {
  StyleSheet,
  Text,
  Modal,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FONTS } from "../../../constants/Fonts";
import { COLORS } from "../../../constants/Colors";
import { HEIGHT, SHADOW, WIDTH } from "../../../constants/Styles";
import Heading from "../header/Heading";

const calculatorType = [
  {
    name: "TDS",
    percentage: { gold: 0.1, silver: 0.1 },
    operation: "subtract",
    divideBy: 1,
  },
  // { name: "TCS", percentage: 0.1, operation: "add", divideBy: 1 },
];
const metals = {
  gold: { unit: "gm", divideBy: 10 },
  silver: { unit: "kg", divideBy: 1 },
};

const CalculatorModal = ({ visible, orders, onDismiss }) => {
  // console.log("orders", orders);
  const orderMetal = orders[0]?.source?.toLowerCase()?.trim();

  const updatedOrders = orders.map((i) => ({
    ...i,
    Total:
      (parseFloat(i?.rate) * parseInt(i?.volume)) /
      metals[orderMetal]["divideBy"],
  }));

  const [selectedCalCType, setSelectedCalCType] = useState(calculatorType[0]);

  const handleCalculatorTypeChange = (item) => {
    try {
      setSelectedCalCType(item);
    } catch (error) {}
  };

  const roundOff = (rate) => Math.round(parseFloat(rate));

  const totalAmountVals = updatedOrders.reduce(
    (prev, curr) => {
      if (curr?.rate == 0 || curr?.volume == 0) return prev;
      const totalAmount = roundOff(curr?.Total);
      const taxSpecialAmount =
        roundOff(totalAmount) / parseFloat(selectedCalCType?.divideBy);
      const taxAmount =
        taxSpecialAmount * (selectedCalCType?.percentage[orderMetal] / 100);
      const gstAmount = totalAmount * 0.03;
      prev["weight"] += parseFloat(curr?.volume);
      prev["amount"] += roundOff(totalAmount);
      prev["taxAmount"] += roundOff(taxAmount);
      prev["gst"] += roundOff(gstAmount);
      prev["payable"] +=
        // selectedCalCType?.operation == "subtract"
        //   ? roundOff(totalAmount) - roundOff(taxAmount)
        //   : roundOff(totalAmount) + roundOff(taxAmount);
        selectedCalCType?.operation == "subtract"
          ? roundOff(totalAmount) - roundOff(taxAmount) + roundOff(gstAmount)
          : roundOff(totalAmount) + roundOff(taxAmount) + roundOff(gstAmount);
      return prev;
    },
    { weight: 0, amount: 0, taxAmount: 0, payable: 0, gst: 0 },
  );
  const totalBoxItems = [
    {
      text: "Total Weight",
      value: `${totalAmountVals?.weight} ${metals[orderMetal]?.unit || ""}`,
    },
    {
      text: "Total Amount",
      value: `₹${totalAmountVals?.amount?.toLocaleString()}`,
    },
    {
      text: `Total ${selectedCalCType?.name?.toLocaleUpperCase()}`,
      value: `₹${totalAmountVals?.taxAmount?.toLocaleString()}`,
    },
    {
      text: `Total GST(3%)`,
      value: `₹${totalAmountVals?.gst?.toLocaleString()}`,
    },
    {
      text: "Payable",
      value: `₹${totalAmountVals?.payable?.toLocaleString()}`,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent={true}
      onDismiss={onDismiss}
      onRequestClose={onDismiss}
      animationType={"slide"}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onDismiss}
        style={styles.modalBackground}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {}}
          style={styles.container}
        >
          {/* <Heading text={"Calculator"} /> */}
          <View style={[styles.headingContainer]}>
            <Text style={[styles.heading]}>{"Calculator"}</Text>
          </View>
          <View style={styles.radioButtonWrapper}>
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
                  <Text style={[styles.radioButtonText]}>
                    {item?.name} ({item?.percentage[orderMetal]}%)
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <View
            style={[
              styles.calItemCard,
              { borderWidth: 1, borderColor: COLORS.primaryColor },
            ]}
          >
            <Text style={styles.calItemText}>Deal No.</Text>
            <Text style={styles.calItemText}>Volume</Text>
            <Text style={styles.calItemText}>Rate</Text>
            <Text style={styles.calItemText}>Total</Text>
          </View>
          <ScrollView
            style={{ maxHeight: HEIGHT * 0.3, marginVertical: 3 }}
            showsVerticalScrollIndicator
            nestedScrollEnabled={true}
          >
            {updatedOrders?.map((ord, ordInd) => {
              return (
                <View
                  key={`cal-value-card-${ordInd}`}
                  style={styles.calItemCard}
                >
                  <Text style={styles.calItemText}>{ord?.dealNo}</Text>
                  <Text style={styles.calItemText}>
                    {ord?.volume}
                    {metals[orderMetal]?.unit || ""}
                  </Text>
                  <Text style={styles.calItemText}>₹{ord?.rate}</Text>
                  <Text style={styles.calItemText}>₹{ord?.total}</Text>
                </View>
              );
            })}
          </ScrollView>
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
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default CalculatorModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.modalBackground,
    zIndex: 10,
  },
  alertContainer: {
    width: WIDTH * 0.85,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  container: {
    width: WIDTH * 0.95,
    maxHeight: HEIGHT * 0.9,
    padding: 10,
    backgroundColor: COLORS.whiteColor,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.boxBorder,
  },
  radioButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 3,
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
  calItemCard: {
    width: "100%",
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 1,
    // paddingHorizontal: 4,
    marginVertical: 1,
    borderRadius: 5,
    borderColor: COLORS.greyColor,
    borderWidth: 1,
  },
  calItemText: {
    fontFamily: FONTS.Medium,
    fontSize: 14,
    color: COLORS.primaryColor,
    width: "24%",
    textAlign: "center",
    marginHorizontal: 1,
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
    fontSize: 16,
    color: COLORS.whiteColor,
    textAlign: "left",
  },
  headingContainer: {
    width: WIDTH * 0.9,
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
    overflow: "hidden",
    ...SHADOW,
  },
  heading: {
    textAlign: "center",
    fontFamily: FONTS.Bold,
    fontSize: 15,
    color: COLORS.whiteColor,
  },
});
