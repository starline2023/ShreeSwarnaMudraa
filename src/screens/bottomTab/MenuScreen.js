import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Linking,
} from "react-native";
import React, { useState } from "react";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";
import { IS_ANDROID, WIDTH } from "../../../constants/Styles";
import { Images } from "../../../constants/Images";
import { AntDesign } from "../../../constants/Icons";
import { useDispatch, useSelector } from "react-redux";
import { GLOBALS } from "../../../constants/GLOBALS";
import { navigate } from "../../navigations/RootNavigation";
import { OpenSnackbar } from "../../../constants/Functions";
import { AlertClose, AlertOpen, logoutAction } from "../../redux/action";
import StaticImageBackground from "../../components/background/StaticImageBackground";
import BankInfoModal from "../../components/customModals/BankInfoModal";
import StaticBackground from "../../components/background/StaticBackground";

const { Bold } = FONTS;

const iconsColor = COLORS.blackColor;
const iconsBGColor = COLORS.secondaryColor;

const MenuScreen = () => {
  const dispatch = useDispatch();
  const handleSnackBar = OpenSnackbar();
  const user = useSelector((store) => store?.user);
  const clientDetails = useSelector((store) => store.clientInfo);

  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const profileOptions = [
    GLOBALS.isTerminal
      ? {
          name: "Profile",
          icon: (
            <Image source={Images.profileIcon} style={styles.optionsImages} />
          ),
          onPress: () => {
            if (user?.isLoggedIn == false) {
              handleSnackBar("Please Login to access Profile Details", false);
              return;
            } else {
              navigate("ProfileDetails");
            }
          },
        }
      : null,
    {
      name: "Contact Details",
      icon: <Image source={Images.contact} style={styles.optionsImages} />,
      onPress: () => {
        navigate("ContactDetails");
      },
    },
    GLOBALS.hasCalc
      ? {
          name: "TDS Calculator",
          icon: (
            <Image source={Images.calculator} style={styles.optionsImages} />
          ),
          onPress: () => {
            navigate("Calculator");
          },
        }
      : null,

    {
      name: "Bank Details",
      icon: <Image source={Images.bank} style={styles.optionsImages} />,
      onPress: () => {
        navigate("BankDetails");
        // setIsBankModalOpen(true);
      },
    },

    GLOBALS.aboutUs
      ? {
          name: "About Us",
          icon: <Image source={Images.kyc} style={styles.optionsImages} />,
          onPress: () => {
            navigate("KYC");
          },
        }
      : null,
    GLOBALS.hasEcomCal
      ? {
          name: "Economic Calendar",
          icon: <Image source={Images.calendar} style={styles.optionsImages} />,
          onPress: () => {
            navigate("EconomicCalendar");
          },
        }
      : null,
    // {
    //   name: "Enquiry",
    //   icon: <Image source={Images.enquiry} style={styles.optionsImages} />,
    //   onPress: () => {
    //     navigate("Enquiry");
    //   },
    // },
    {
      name: "Share our App",
      icon: (
        <Image
          source={Images.share}
          style={[styles.optionsImages, { height: 20, width: 20 }]}
        />
      ),
      onPress: () => {
        rateShareApp("Share");
      },
    },
    {
      name: "Rate Our App",
      icon: <Image source={Images.rating} style={styles.optionsImages} />,
      onPress: () => {
        rateShareApp("Rate");
      },
    },
    GLOBALS.isTerminal
      ? user?.isLoggedIn
        ? {
            name: "Log Out",
            icon: <AntDesign name="logout" size={20} color={iconsColor} />,
            onPress: () => {
              let alertObj = {
                description: "Are you sure you Want to Logout ?",
                title: "",
                yesText: "Yes",
                noText: "No",
                onYesPress: () => {
                  dispatch(AlertClose());
                  dispatch(logoutAction());
                  setTimeout(() => {
                    navigate("Login");
                  }, 300);
                },
                onNoPress: () => {
                  dispatch(AlertClose());
                },
              };
              dispatch(AlertOpen(alertObj));
            },
          }
        : {
            name: "Log In",
            icon: <AntDesign name="login" size={20} color={iconsColor} />,
            onPress: () => navigate("Login"),
          }
      : null,
  ];
  const rateShareApp = (type) => {
    let URL = IS_ANDROID ? GLOBALS.PlayStoreURL : GLOBALS.AppStoreURL;
    if (type == "Rate") {
      Linking.openURL(URL).catch((err) =>
        console.error("An error occurred", err),
      );
    } else if (type == "Share") {
      Share.share({
        url: URL,
        title: GLOBALS.AppName,
        message: URL,
      });
    }
  };
  const openSocialMedia = (url, isOpenApp = false) => {
    try {
      if (isOpenApp) {
        Linking.canOpenURL(url)
          .then((supported) => {
            if (supported) {
              Linking.openURL(url).catch(() =>
                handleSnackBar(
                  `Something went wrong, redirecting failed!`,
                  false,
                ),
              );
            } else {
              handleSnackBar(`WhatsApp is not installed`, false);
            }
          })
          .catch((e) => {
            console.log("e:", e);
            handleSnackBar(`Oops, Something went wrong`, false);
          });
      } else {
        Linking.openURL(url);
      }
    } catch (error) {
      console.log("openSocialMedia error :", error);
    }
  };
  const socialMediaHandles = [
    // {
    //   platform: "Instagram",
    //   onPress: () => openSocialMedia(GLOBALS.instagram),
    //   isVisible: GLOBALS.instagram.trim() != "",
    //   image: Images.instagram,
    // },
    // {
    //   platform: "Youtube",
    //   onPress: () => openSocialMedia(GLOBALS.youtube),
    //   isVisible: GLOBALS.youtube.trim() != "",
    //   image: Images.youtube,
    // },
    clientDetails.WhatsAppNumber != null
      ? {
          platform: "Whatsapp",
          onPress: () =>
            openSocialMedia(
              `whatsapp://send?phone=${clientDetails.WhatsAppNumber}`,
              true,
            ),
          image: Images.whatsapp,
        }
      : null,
    // {
    //   platform: "Facebook",
    //   onPress: () => openSocialMedia(GLOBALS.facebook),
    //   isVisible: GLOBALS.facebook.trim() != "",
    //   image: Images.facebook,
    // },
  ].filter(Boolean);

  return (
    <View style={{ flex: 1 }}>
      <StaticBackground isBGImage />
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.optionsContainer}>
          {profileOptions?.map((item, index) => {
            if (item == null) {
              return;
            }
            return (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => item.onPress()}
                key={index}
                style={styles.options}
              >
                <View
                  style={[
                    styles.optionsIcon,
                    { backgroundColor: iconsBGColor },
                  ]}
                >
                  {item.icon}
                </View>
                <Text style={styles.optionsText}>{item.name}</Text>
              </TouchableOpacity>
            );
          })}

          {socialMediaHandles.length && (
            <View style={styles.socialMediaContainer}>
              {socialMediaHandles.map((item) => {
                // if (!item.isVisible) return;
                return (
                  <TouchableOpacity
                    key={`${item.platform}`}
                    activeOpacity={0.9}
                    onPress={() => {
                      item.onPress();
                    }}
                    style={styles.socialMediaButtons}
                  >
                    <Image
                      source={item.image}
                      style={styles.socialMediaImages}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
        {/* <View style={{ height: 30 }} /> */}
        {isBankModalOpen && (
          <View>
            <BankInfoModal
              visible={isBankModalOpen}
              onClose={() => setIsBankModalOpen(false)}
            />
          </View>
        )}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  optionsContainer: {
    width: WIDTH * 0.9,
    borderRadius: 20,
    alignSelf: "center",
    marginTop: 15,
    overflow: "hidden",
    paddingVertical: 10,
    backgroundColor: COLORS.whiteColor + 99,
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
  },
  options: {
    height: 50,
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    // backgroundColor: primaryColor,
    margin: 5,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
  },
  optionsImages: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    tintColor: iconsColor,
  },
  optionsIcon: {
    height: 35,
    width: 35,
    // backgroundColor: primaryColor + 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  optionsText: {
    fontSize: 14,
    fontFamily: Bold,
    color: COLORS.blackColor,
    marginHorizontal: 15,
  },

  socialMediaContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginVertical: 20,
  },
  socialMediaButtons: {
    height: 45,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    backgroundColor: COLORS.success,
  },
  socialMediaImages: {
    height: 25,
    width: 25,
    resizeMode: "contain",
    tintColor: COLORS.whiteColor,
  },
});
