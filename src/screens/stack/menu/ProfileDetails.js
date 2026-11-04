import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { COLORS } from "../../../../constants/Colors";
import { FONTS } from "../../../../constants/Fonts";
import CustomHeader from "../../../components/header/CustomHeader";
import { HEIGHT, SHADOW, WIDTH } from "../../../../constants/Styles";
import { useDispatch, useSelector } from "react-redux";
import { AlertClose, AlertOpen, logoutAction } from "../../../redux/action";
import { OpenSnackbar } from "../../../../constants/Functions";
import { getAPI_Terminal } from "../../../../constants/APIs";
import { navigate, navigationRef } from "../../../navigations/RootNavigation";
import Heading from "../../../components/header/Heading";
import { useIsFocused } from "@react-navigation/native";
import StaticImageBackground from "../../../components/background/StaticImageBackground";
import StaticBackground from "../../../components/background/StaticBackground";
import ChangePasswordCard from "../../../components/card/ChangePasswordCard";

const { primaryColor, whiteColor } = COLORS;
const { Bold, Medium, Bold_Italic } = FONTS;
const ProfileDetails = () => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const handleSnackBar = OpenSnackbar();
  const getTerminalApiResponse = getAPI_Terminal();

  const user = useSelector((store) => store?.user);
  const groupData = useSelector((store) => store.groupData);

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isFocused && user?.isLoggedIn) {
      fetchUserData("profile");
    }
    if (!user?.isLoggedIn) navigationRef.goBack();
  }, [isFocused, user?.isLoggedIn]);

  const fetchUserData = async (type) => {
    try {
      setLoading(true);
      let response = await getTerminalApiResponse(
        `terminalInfo?infoType=${type}&symbolId=0`,
      );
      if (!user?.isLoggedIn) {
        handleSnackBar("Please Login in Again");
        navigationRef.goBack();
        return;
      }
      if (response?.code == 200) {
        setUserData(response?.data);
      } else {
        handleSnackBar(
          response?.message || "Something Went Wrong, Please Try Again Later!",
          false,
        );
      }
    } catch (error) {
      console.log("fetchUserData error :", error);
      if (!user?.isLoggedIn) {
        handleSnackBar("Please Login in Again");
        navigationRef.goBack();
      }
    }
    setLoading(false);
  };

  const handleDeleteAccount = () => {
    try {
      let alertObj = {
        visible: true,
        description: "Are you sure, you want to delete your account?",
        title: "",
        yesText: "Yes",
        noText: "No",
        onYesPress: () => {
          dispatch(AlertClose()), deleteUserAccount();
          // dispatch(logoutAction());
          // navigationRef.goBack();
          // navigate("Authentication");
        },
        onNoPress: () => {
          dispatch(AlertClose());
        },
      };
      dispatch(AlertOpen(alertObj));
    } catch (error) {
      console.log("handleDeleteAccount error :", error);
    }
  };
  const deleteUserAccount = async () => {
    try {
      setTimeout(() => {
        let alertObj = {
          visible: true,
          description: "Account Deleted Succesfully !!",
          title: "",
          yesText: "OK",
          noText: "",
          onYesPress: () => {
            dispatch(AlertClose());
            // navigationRef.goBack();
            // dispatch(logoutAction());
            // navigate("Authentication");
          },
          onNoPress: () => {},
        };
        dispatch(AlertOpen(alertObj));

        navigationRef.goBack();
        dispatch(logoutAction());
        setTimeout(() => {
          navigate("Login");
        }, 300);
      }, 800);
    } catch (error) {
      console.log("deleteUserAccount error:");
    }
  };
  const ProfileDetails = [
    {
      title: "Owner Name",
      info: userData?.name,
    },
    {
      title: "Firm Name",
      info: userData?.firmName,
    },
    {
      title: "Mobile Number",
      info: userData?.mobile,
    },
    {
      title: "Email Id",
      info: userData?.email,
    },
    {
      title: "City",
      info: userData?.city,
    },
  ];

  return (
    <View style={{ flex: 1 }}>
      <StaticBackground isBGImage />
      <CustomHeader />
      <ScrollView style={{ flex: 1 }}>
        <Heading text={"Profile Details"} />
        <View style={styles.userDataContainer}>
          {loading ? (
            <ActivityIndicator size={"large"} color={COLORS.primaryColor} />
          ) : (
            <>
              {ProfileDetails.map((details, index) => {
                if (
                  details?.info == undefined ||
                  details?.info?.toString().trim() == ""
                ) {
                  return null;
                }
                return (
                  <View
                    key={`Profile-Details-${index}`}
                    style={styles.detailsListContainer}
                  >
                    <Text style={styles.detailsTitle}>{details?.title} :</Text>
                    <Text style={styles.detailsText}>{details?.info}</Text>
                  </View>
                );
              })}
            </>
          )}
        </View>

        <ChangePasswordCard />
        {(userData?.firmName?.toLowerCase()?.includes("starline") ||
          userData?.firmName?.toLowerCase()?.includes("sl")) && (
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.submitButton]}
            onPress={() => handleDeleteAccount()}
          >
            {/* <StaticBackground /> */}
            <Text style={styles.submitButtonText}>Delete Account</Text>
          </TouchableOpacity>
        )}
        <Heading text={"Trade Permissions"} />
        {groupData?.SymbolGroup?.length > 0 && (
          <View style={styles.userDataContainer}>
            <View style={styles.tradeHeader}>
              <View style={{ width: "50%" }}>
                <Text style={styles.tradeSymbolHeaderText}>Symbol</Text>
              </View>
              <View style={[styles.tradeHeaderRight, { width: "50%" }]}>
                <Text style={styles.tradeSymbolHeaderText}>One Click</Text>
                <Text style={styles.tradeSymbolHeaderText}>In Total</Text>
              </View>
            </View>
            <View>
              {groupData?.SymbolGroup?.map((item, index) => {
                return (
                  <View
                    key={`Permission_${index}`}
                    style={[styles.tradeHeader, { marginVertical: 2 }]}
                  >
                    <View style={{ width: "50%" }}>
                      <Text style={styles.tradeSymbolDetailsText}>
                        {item?.symbolName}
                      </Text>
                    </View>
                    <View style={[styles.tradeHeaderRight, { width: "50%" }]}>
                      <Text style={styles.tradeSymbolDetailsText}>
                        {item?.oneClick}
                      </Text>
                      <Text style={styles.tradeSymbolDetailsText}>
                        {item?.inTotal}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfileDetails;

const styles = StyleSheet.create({
  userDataContainer: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 2,
    margin: 5,
    borderColor: COLORS.boxBorder,
    backgroundColor: COLORS.whiteColor,
  },
  detailsListContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 15,
    marginVertical: 5,
  },
  detailsTitle: {
    fontSize: 13,
    color: COLORS.blackColor,
    fontFamily: Medium,
    maxWidth: "30%",
    textAlign: "left",
  },
  detailsText: {
    fontSize: 15,
    color: COLORS.blackColor,
    fontFamily: Bold,
    maxWidth: "70%",
    textAlign: "right",
  },
  submitButton: {
    padding: 5,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: COLORS.failure,
    borderRadius: 5,
    marginVertical: 10,
  },
  submitButtonText: {
    fontFamily: Bold_Italic,
    fontSize: 15,
    color: COLORS.whiteColor,
  },
  tradeHeader: {
    padding: 5,
    marginHorizontal: 10,
    alignSelf: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  tradeHeaderRight: {
    justifyContent: "space-around",
    flexDirection: "row",
  },
  tradeSymbolHeaderText: {
    fontSize: 15,
    color: COLORS.blackColor,
    fontFamily: Bold,
  },
  tradeSymbolDetailsText: {
    fontSize: 15,
    color: COLORS.blackColor,
    fontFamily: Medium,
  },
});
