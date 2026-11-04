import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS } from "../../../../constants/Colors";
import { FONTS } from "../../../../constants/Fonts";
import CustomHeader from "../../../components/header/CustomHeader";
import { Images } from "../../../../constants/Images";
import { FlashList } from "@shopify/flash-list";
import { HEIGHT, SHADOW, WIDTH } from "../../../../constants/Styles";
import EmptyListComponent from "../../../components/emptyListComponent/EmptyListComponent";
import { useSelector } from "react-redux";
import { postAPI_B2C } from "../../../../constants/APIs";
import { useIsFocused } from "@react-navigation/native";
import { listOfDetails } from "../../../../constants/Functions";
import Enquiry from "./Enquiry";
import { navigate } from "../../../navigations/RootNavigation";
import Heading from "../../../components/header/Heading";
import StaticImageBackground from "../../../components/background/StaticImageBackground";
import ContactInfoCard from "../../../components/card/ContactInfoCard";
import StaticBackground from "../../../components/background/StaticBackground";

const { primaryColor, blackColor, whiteColor, greyColor } = COLORS;
const { Bold, Bold_Italic, Medium, Regular } = FONTS;
const ContactDetails = () => {
  const isFocused = useIsFocused();
  const clientDetails = useSelector((store) => store.clientInfo);
  const contactInfo = [
    {
      type: "address",
      imageSRC: Images.map,
      title: "Address",
      info: clientDetails.Address,
      onPress: () => {},
    },
    {
      type: "phone",
      imageSRC: Images.phone,
      title: "Contact Number",
      info: clientDetails.BookingNumber,
      onPress: (num) => {
        Linking.openURL("tel:" + convertToValidPhoneNumber(num).match(/\d+/));
      },
    },
    {
      type: "mail",
      imageSRC: Images.email,
      title: "Contact Email",
      info: clientDetails.Email,
      onPress: (mail) => {
        Linking.openURL("mailto:", mail.match(/\d+/) + "?subject=&body=");
      },
    },
  ];
  const convertToValidPhoneNumber = (num) => {
    let phoneNumber = num.replace(/[^\d+]/g, "");
    if (phoneNumber.startsWith("+")) {
      phoneNumber = phoneNumber.replace(/^\+\d{0,2}/, "");
    }
    return phoneNumber;
  };

  const isInformationAvailable = contactInfo.reduce(
    (prev, curr) => prev + curr?.info?.length,
    0,
  );
  return (
    <View style={{ flex: 1 }}>
      <StaticBackground isBGImage />
      <CustomHeader />
      <ScrollView style={{ flex: 1 }}>
        {isInformationAvailable == 0 ? (
          <EmptyListComponent
            displayText={`No Contact Details Available at this time`}
            height={HEIGHT * 0.2}
          />
        ) : (
          <View style={{ minHeight: 5 }}>
            <Heading text={"Contact Details"} />
            <FlashList
              data={contactInfo}
              extraData={[1, 2]}
              estimatedItemSize={150}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) => {
                if (item.info.length == 0) {
                  return;
                }
                return <ContactInfoCard item={item} />;
              }}
              ListEmptyComponent={() => {
                return (
                  <EmptyListComponent
                    displayText={"No Contact Details Available"}
                  />
                );
              }}
            />
          </View>
        )}
        <Enquiry />
      </ScrollView>
    </View>
  );
};

export default ContactDetails;
