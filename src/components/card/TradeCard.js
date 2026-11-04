import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { FONTS } from "../../../constants/Fonts";
import { COLORS } from "../../../constants/Colors";
import { SHADOW } from "../../../constants/Styles";
import { AntDesign, MaterialIcons } from "../../../constants/Icons";
import EditLimit from "../customModals/EditLimit";
import { GLOBALS } from "../../../constants/GLOBALS";

const { Bold, Medium } = FONTS;

const tradeTypeText = {
  1: "Buy",
  2: "Sell",
  3: "Buy Limit",
  4: "Sell Limit",
};

const TradeCard = ({
  order,
  type,
  key,
  onRefresh,
  onSelect,
  isSelected,
  isCalculator,
  isTrade,
}) => {
  const [editLimitModal, setEditLimitModal] = useState(false);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);

    const padZero = (value) => String(value).padStart(2, "0");

    const dd = padZero(date.getDate());
    const mm = padZero(date.getMonth() + 1); // Months are 0-based
    const yyyy = date.getFullYear();
    const hh = padZero(date.getHours());
    const min = padZero(date.getMinutes());
    const sec = padZero(date.getSeconds());
    const ms = padZero(date.getMilliseconds());

    return `${dd} ${mm} ${yyyy}, ${hh}:${min}:${sec}:${ms}`;
  };

  const handleEditLimitPress = () => {
    try {
      setEditLimitModal(true);
    } catch (error) {
      console.log("handleEditLimitPress error :", error);
    }
  };
  const isExecuteOrder = type == "Execute";
  return (
    <>
      <TouchableOpacity
        activeOpacity={isExecuteOrder ? 0.9 : 1}
        onPress={() => {
          if (isCalculator && GLOBALS.hasTradeCalculator && isExecuteOrder) {
            onSelect(order, isSelected);
          }
        }}
        key={key}
        style={styles.OrderCard}
      >
        <View style={styles.SymbolNameContainer}>
          <Text style={styles.productName}>{order?.symbolName}</Text>
          {type == "Pending" && (
            <View style={styles.editDeleteContainer}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.vectors}
                onPress={() => handleEditLimitPress(order)}
              >
                <MaterialIcons
                  name={"edit"}
                  size={20}
                  color={COLORS.primaryColor}
                />
              </TouchableOpacity>
            </View>
          )}
          {/* {isExecuteOrder && (
            <View
              style={[
                styles.checkBox,
                {
                  backgroundColor: isSelected
                    ? COLORS.primaryColor
                    : COLORS.headingBackgorund,
                },
              ]}
            >
              <AntDesign name={"check"} size={13} color={COLORS.whiteColor} />
            </View>
          )} */}
        </View>
        <Text style={styles.description}>Deal No : {order?.dealNo}</Text>
        <Text style={styles.description}>Type : {order?.tradeTypeView}</Text>
        <Text style={styles.description}>Quantity : {order?.volume}</Text>

        <Text style={styles.description}>
          Rate :{" "}
          <Text style={{ fontFamily: FONTS.Bold, fontSize: 16 }}>
            ₹{order?.rate}
          </Text>
        </Text>
        <Text style={styles.description}>
          Total Price :{" "}
          <Text style={{ fontFamily: FONTS.Bold, fontSize: 16 }}>
            ₹{order?.total}
          </Text>
        </Text>

        {type != "Delete" && (
          <Text style={styles.description}>
            Open Time :{" "}
            {formatDateTime(
              isTrade ? order?.orderTime : order?.openTradeDateTime,
            )}
            {/* Open Time : {formatDateTime(order?.orderTime)} */}
          </Text>
        )}
      </TouchableOpacity>
      {editLimitModal && (
        <View>
          <EditLimit
            orderDetails={order}
            visible={editLimitModal}
            onDismiss={(refresh) => {
              if (refresh) {
                onRefresh();
              }
              setEditLimitModal(false);
            }}
          />
        </View>
      )}
    </>
  );
};

export default TradeCard;

const styles = StyleSheet.create({
  SymbolNameContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  OrderCard: {
    flex: 1,
    width: "95%",
    backgroundColor: COLORS.whiteColor,
    borderRadius: 5,
    marginHorizontal: 8,
    alignSelf: "center",
    marginVertical: 5,
    padding: 10,
    borderColor: COLORS.boxBorder,
    borderWidth: 1,
    // ...SHADOW,
  },
  productName: {
    fontFamily: Bold,
    fontSize: 15,
    color: COLORS.primaryColor,
  },
  editDeleteContainer: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  vectors: { marginHorizontal: 1 },
  description: {
    fontFamily: Medium,
    fontSize: 13,
    color: COLORS.blackColor,
  },
  checkBox: {
    borderRadius: 5,
    height: 18,
    width: 18,
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
    justifyContent: "center",
    alignItems: "center",
  },
});
