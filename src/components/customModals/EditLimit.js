import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  Alert,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../../../constants/Colors";
import { IS_ANDROID, WIDTH } from "../../../constants/Styles";
import { FONTS } from "../../../constants/Fonts";
import StaticBackground from "../background/StaticBackground";
import Heading from "../header/Heading";
import { OpenSnackbar } from "../../../constants/Functions";
import {
  deleteAPI_Terminal,
  postAPI_Terminal,
  putAPI_Terminal,
} from "../../../constants/APIs";
import { GLOBALS } from "../../../constants/GLOBALS";
import { useDispatch, useSelector } from "react-redux";
import { AlertClose, AlertOpen } from "../../redux/action";
import { title } from "process";

const { whiteColor, greyColor, primaryColor, modalBackground, blackColor } =
  COLORS;
const { Semi_Bold, Medium, Bold } = FONTS;

const EditLimit = ({ visible, orderDetails, onDismiss }) => {
  const handleSnackbar = OpenSnackbar();
  const dispatch = useDispatch();
  const putTerminalApiResponse = putAPI_Terminal();
  const deleteTerminalApiResponse = deleteAPI_Terminal();
  const user = useSelector((store) => store?.user?.userDetails);

  const [limitPrice, setLimitPrice] = useState(orderDetails?.rate?.toString());
  const [isDisableDismiss, setIsDisableDismiss] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const isGold = orderDetails?.Source?.toLowerCase()?.trim() == "gold";
  const onEditLimitPress = async () => {
    try {
      Keyboard.dismiss();
      if (isDisableDismiss) {
        return;
      }
      if (limitPrice?.trim() == "") {
        onDismiss(false);
        handleSnackbar("Edit Limit Price should not be empty", false);
        return;
      }
      const message = `Are you sure you want to update the limit price?`;
      if (!IS_ANDROID) {
        Alert.alert("", message, [
          {
            text: "YES",
            onPress: async () => {
              editOrderLimit();
            },
            isPreferred: true,
          },
          {
            text: "NO",
            onPress: async () => {},
            isPreferred: true,
            style: "cancel",
          },
        ]);
      } else {
        let alertObj = {
          description: `Are you sure you want to update the limit price?`,
          title: "",
          yesText: "YES",
          noText: "NO",
          onYesPress: async () => {
            dispatch(AlertClose());
            editOrderLimit();
          },
          onNoPress: () => {
            dispatch(AlertClose());
          },
        };
        dispatch(AlertOpen(alertObj));
      }
    } catch (error) {
      console.log("onEditLimitPress error:", error);
    }
  };
  const onDeleteLimitPress = async () => {
    try {
      Keyboard.dismiss();
      if (isDisableDismiss) {
        return;
      }
      const message = `Are you sure you want to delete the Deal ${orderDetails?.dealNo}?`;
      if (!IS_ANDROID) {
        Alert.alert("", message, [
          {
            text: "YES",
            onPress: async () => {
              deleteLimit();
            },
            isPreferred: true,
          },
          {
            text: "NO",
            onPress: async () => {},
            isPreferred: true,
            style: "cancel",
          },
        ]);
      } else {
        let alertObj = {
          description: message,
          title: "",
          yesText: "YES",
          noText: "NO",
          onYesPress: async () => {
            dispatch(AlertClose());
            deleteLimit();
          },
          onNoPress: () => {
            dispatch(AlertClose());
          },
        };
        dispatch(AlertOpen(alertObj));
      }
    } catch (error) {
      console.log("onDeleteLimitPress error:", error);
    }
    setDeleteLoading(false);
    setIsDisableDismiss(false);
  };
  const onDismissPress = () => {
    try {
      if (!isDisableDismiss) {
        onDismiss(false);
      }
    } catch (error) {
      console.log("onDismissPress error:", error);
    }
  };

  const deleteLimit = async () => {
    try {
      setDeleteLoading(true);
      setIsDisableDismiss(true);
      // let deleteObj = {
      //   id: orderDetails?.id,
      // };
      let response = await deleteTerminalApiResponse(
        `deletePendingOrder?id=${parseInt(orderDetails?.id)}`,
        {},
      );
      if (response?.code == 200) {
        onDismiss(true);
        handleSnackbar(response?.message, true);
      } else {
        onDismiss(false);
        handleSnackbar(response?.message, false);
      }
    } catch (error) {
      console.log("deleteLimit error:", error);
    }
    setDeleteLoading(false);
    setIsDisableDismiss(false);
  };
  const editOrderLimit = async () => {
    try {
      setEditLoading(true);
      setIsDisableDismiss(true);
      let editLimitObj = {
        rate: parseInt(limitPrice),
        id: parseInt(orderDetails?.id),
      };
      let response = await putTerminalApiResponse(
        "updatePendingOrder",
        editLimitObj,
      );
      if (response?.code == 200) {
        onDismiss(true);
        handleSnackbar(response?.message, true);
      } else {
        onDismiss(false);
        handleSnackbar(response?.message, false);
      }
    } catch (error) {
      console.log("editOrderLimit error:", error);
    }
    setEditLoading(false);
    setIsDisableDismiss(false);
  };
  return (
    <Modal
      visible={visible}
      transparent={true}
      onDismiss={() => onDismissPress()}
      onRequestClose={() => onDismissPress()}
      animationType={"slide"}
    >
      <View style={styles.modalBackground}>
        <View style={styles.alertContainer}>
          <Heading text={"Update Limit"} width={"95%"} />
          <View style={styles.orderDetailsContainer}>
            <View style={styles.detailsListContainer}>
              <Text style={styles.detailsTitle}>Symbol Name</Text>
              <Text style={styles.detailsText}>{orderDetails?.symbolName}</Text>
            </View>
            <View style={styles.detailsListContainer}>
              <Text style={styles.detailsTitle}>Deal No.</Text>
              <Text style={styles.detailsText}>{orderDetails?.dealNo}</Text>
            </View>
            <View style={styles.detailsListContainer}>
              <Text style={styles.detailsTitle}>Quantity</Text>
              <Text style={styles.detailsText}>{orderDetails?.volume}</Text>
            </View>
            <View style={styles.detailsListContainer}>
              <Text style={styles.detailsTitle}>Price</Text>
              <TextInput
                value={limitPrice}
                onChangeText={(text) => {
                  setLimitPrice(text);
                }}
                keyboardType={"numeric"}
                style={styles.formInputFields}
                placeholder={"Limit"}
                placeholderTextColor={COLORS.blackColor + 80}
                returnKeyType="done"
                selectionColor={blackColor}
                cursorColor={COLORS.blackColor}
              />
            </View>
          </View>
          <View style={styles.alertButtonsContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={isDisableDismiss}
              style={[
                styles.alertButtons,
                { flex: 1, opacity: isDisableDismiss ? 0.5 : 1 },
              ]}
              onPress={() => {
                onEditLimitPress();
              }}
            >
              {/* <StaticBackground isGradient /> */}
              {editLoading ? (
                <ActivityIndicator size={"small"} color={whiteColor} />
              ) : (
                <Text style={styles.alertButtonsText}>Edit Limit</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              disabled={isDisableDismiss}
              style={[
                styles.alertButtons,
                { flex: 1, opacity: isDisableDismiss ? 0.5 : 1 },
              ]}
              onPress={() => {
                onDeleteLimitPress();
              }}
            >
              {/* <StaticBackground isGradient /> */}
              {deleteLoading ? (
                <ActivityIndicator size={"small"} color={whiteColor} />
              ) : (
                <Text style={styles.alertButtonsText}>Delete Limit</Text>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={isDisableDismiss}
            style={[
              styles.alertButtons,
              { width: "95%", opacity: isDisableDismiss ? 0.5 : 1 },
            ]}
            onPress={() => {
              onDismissPress();
            }}
          >
            {/* <StaticBackground isGradient /> */}
            <Text style={styles.alertButtonsText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default EditLimit;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: modalBackground,
  },
  alertContainer: {
    width: WIDTH * 0.9,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: COLORS.whiteColor,
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
    padding: 5,
  },
  detailsListContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  formInputFields: {
    maxWidth: 150,
    height: 40,
    paddingVertical: 5,
    paddingHorizontal: 30,
    //     textAlign: "center",
    borderColor: COLORS.boxBorder,
    borderWidth: 2,
    borderRadius: 8,
    fontSize: 14,
    fontFamily: Medium,
    color: COLORS.blackColor,
  },
  detailsTitle: {
    fontSize: 13,
    color: COLORS.blackColor,
    fontFamily: Bold,
    textAlign: "left",
    width: "45%",
  },
  detailsText: {
    fontSize: 15,
    color: COLORS.blackColor,
    fontFamily: Medium,
    textAlign: "right",
    width: "45%",
  },
  orderDetailsContainer: {
    width: "95%",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.boxBorder,
  },
  alertButtonsContainer: {
    width: "95%",
    //     padding: 5,
    marginVertical: 8,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  alertButtons: {
    // minWidth: "30%",
    //     flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: COLORS.secondaryColor,
  },
  alertButtonsText: {
    fontFamily: Semi_Bold,
    textAlign: "center",
    color: COLORS.blackColor,
    fontSize: 15,
  },
});
