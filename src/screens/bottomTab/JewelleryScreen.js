import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
  Linking,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import ImagePlaceholder from "react-native-image-placeholder";
import { useSelector } from "react-redux";
import { COLORS } from "../../../constants/Colors";
import { navigate } from "../../navigations/RootNavigation";
import { HEIGHT, WIDTH } from "../../../constants/Styles";
import { FONTS } from "../../../constants/Fonts";
import { postAPI } from "../../../constants/APIs";
import { Images } from "../../../constants/Images";
import EmptyListComponent from "../../components/emptyListComponent/EmptyListComponent";
import { OpenSnackbar } from "../../../constants/Functions";
import { GLOBALS } from "../../../constants/GLOBALS";

const {
  primaryColor,
  whiteColor,
  blackColor,
  whiteColorLight,
  greyColor,
  linearGradient2,
} = COLORS;
const { Medium, Semi_Bold } = FONTS;
const JewelleryScreen = () => {
  const isFocused = useIsFocused();
  // const getCartCounts = getItemCount();
  const handleSnackBar = OpenSnackbar();

  const user = useSelector((store) => store.user);

  const [productType, setProductType] = useState([]);
  const [listType, setListType] = useState("C"); // C for Category and S for Sub-Category

  const [currentProductType, setCurrentProductType] = useState(null);
  const [currentProductTypeIndex, setCurrentProductTypeIndex] = useState(0);
  const [productList, setProductList] = useState([]);

  const [productTypeLoading, setProductTypeLoading] = useState(false);
  const [productListLoading, setProductListLoading] = useState(false);
  const flashListRef = useRef(null);
  const backAction = async () => {
    if (listType == "C") {
      BackHandler.exitApp();
    } else {
      setListType("C");
    }
  };
  // useFocusEffect(
  //   useCallback(() => {
  //     const backHandler = BackHandler.addEventListener(
  //       "hardwareBackPress",
  //       backAction
  //     );

  //     return () => backHandler.remove();
  //   }, [listType])
  // );
  useEffect(() => {
    if (isFocused) {
      fetchProductTypes();
    }
  }, [isFocused]);
  // useEffect(() => {
  //   if (currentProductType != null) {
  //     if (listType == "C") {
  //     } else if (listType == "S") {
  //     }
  //   }
  // }, [currentProductType]);

  const fetchProductTypes = async () => {
    try {
      setProductTypeLoading(true);
      setProductListLoading(true);
      let response = await postAPI("GetCategoriesJewelleryMobile", {
        ClientID: GLOBALS.ClientId.toString(),
      });
      if (response) {
        let data = JSON.parse(response[0]?.data);
        if (data.length > 0) {
          setProductType(data);
          handleProductCategoryChange(data, 0);
        } else {
          setProductType([]);
        }
      }
      setTimeout(() => {
        setProductTypeLoading(false);
        setProductListLoading(false);
      }, 200);
    } catch (e) {
      console.log("error in fetchProductTypes");
      setTimeout(() => {
        setProductTypeLoading(false);
        setProductListLoading(false);
      }, 200);
    }
  };

  const scrollToIndex = (index) => {
    flashListRef.current.scrollToIndex({
      animated: true,
      index: index,
      viewPosition: 0.5,
    });
  };

  const handleProductCategoryChange = (productType, catIndex) => {
    try {
      setListType("S");
      setCurrentProductType(productType[catIndex]);
      if (productType[catIndex]?.Subcategories?.length != 0) {
        setProductList(productType[catIndex]?.Subcategories);
      } else {
        setProductList([]);
      }
    } catch (error) {
      console.log("handleProductCategoryChange error :", error);
    }
  };
  const handleProductSubCategoryChange = async (item) => {
    try {
      setListType("P");
      setProductListLoading(true);

      let fetchProdObj = {
        Sid: item?.SC_ID?.toString(),
        ClientID: GLOBALS.ClientId?.toString(),
      };
      let response = await postAPI("GetProductsFront", fetchProdObj);
      if (response) {
        setProductList(response);
      } else {
        setProductList([]);
      }
      setProductListLoading(false);
    } catch (error) {
      console.log("handleProductSubCategoryChange error :", error);
      setProductListLoading(false);
    }
  };
  return (
    <>
      <ScrollView
        style={styles.container}
        stickyHeaderIndices={[0]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View style={{ minHeight: 5 }}>
            {productTypeLoading ? (
              <View style={styles.loadingStyle}>
                <ActivityIndicator
                  color={COLORS.linearGradient1}
                  size={"small"}
                />
              </View>
            ) : (
              <FlashList
                data={productType}
                extraData={[1, 2]}
                ref={flashListRef}
                estimatedItemSize={150}
                horizontal
                contentContainerStyle={{ backgroundColor: whiteColor }}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  let isSelected = item.C_ID == currentProductType?.C_ID;
                  return (
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => {
                        scrollToIndex(index);
                        handleProductCategoryChange(productType, index);
                      }}
                      key={`productType_${index}`}
                      style={[
                        styles.productTypeButton,
                        isSelected && { backgroundColor: primaryColor },
                      ]}
                    >
                      {/* {item.P_id == currentProductType?.P_id && (
                      <StaticBackground />
                    )} */}
                      <Text
                        style={{
                          fontFamily: Medium,
                          color: whiteColor,
                        }}
                      >
                        {item?.C_Name}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={() => {
                  return (
                    <EmptyListComponent
                      height={50}
                      displayText={"No Product Type Available"}
                    />
                  );
                }}
              />
            )}
          </View>
          {/* <ScrollView
          ref={scrollViewRef}
          style={{ height: 60, backgroundColor: whiteColor }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
         
          {productTypeLoading ? (
            <View style={styles.loadingStyle}>
              <ActivityIndicator
                color={COLORS.linearGradient1}
                size={"small"}
              />
            </View>
          ) : (
            <>
              {productType?.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      if (item != currentProductType) {
                        setCurrentProductType(item), setListType("C");
                      }
                    }}
                    key={index}
                    style={styles.productTypeButton}
                  >
                    {item.P_id == currentProductType?.P_id && (
                      <LinearBackground />
                    )}
                    <Text
                      style={{
                        fontFamily: Medium,
                        color:
                          item.P_id == currentProductType?.P_id
                            ? whiteColor
                            : greyColor,
                      }}
                    >
                      {item?.ProductType}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </>
          )}
        </ScrollView> */}
        </View>
        {productListLoading || productTypeLoading ? (
          <View style={[styles.loadingStyle, { height: HEIGHT * 0.8 }]}>
            <ActivityIndicator color={linearGradient2} size={"large"} />
          </View>
        ) : (
          <>
            {/* {listType == ""}
          <BackButton
            onPress={() => {
              setListType("C");
              fetchCategories();
            }}
          /> */}

            <View
              style={{
                minHeight: 5,
                backgroundColor: whiteColor,
                marginBottom: 80,
              }}
            >
              <FlashList
                data={productList}
                extraData={[1, 2]}
                estimatedItemSize={150}
                numColumns={2}
                key={2}
                renderItem={({ item, index }) => {
                  let imageLink = item?.Image;
                  // imageLink = imageLink?.includes("https")
                  //   ? imageLink
                  //   : imageLink?.replace("http", "https");
                  let name =
                    listType == "S"
                      ? item?.SC_Name
                      : listType == "P"
                      ? item?.ImageName
                      : "";
                  // imageLink = `${imageLink}`;

                  const productURL = item?.link;
                  return (
                    <View
                      style={[
                        listType == "P"
                          ? styles.productList
                          : {
                              height: 100,
                              width: WIDTH * 0.5,
                              // padding: 10,
                              alignItems: "center",
                              justifyContent: "center",
                            },
                      ]}
                    >
                      <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                          if (listType == "S") {
                            handleProductSubCategoryChange(item);
                          } else if (listType == "P") {
                            if (
                              productURL != null &&
                              productURL != undefined &&
                              productURL?.trim() != ""
                            ) {
                              Linking.canOpenURL(productURL).then(
                                (supported) => {
                                  if (supported) {
                                    Linking.openURL(productURL);
                                  }
                                }
                              );
                            }
                          }
                        }}
                        style={[
                          listType == "P"
                            ? styles.productListButton
                            : {
                                height: "95%",
                                width: "95%",
                                backgroundColor: primaryColor + 50,
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden",
                                borderRadius: 8,
                              },
                        ]}
                      >
                        {listType == "P" && (
                          <View style={styles.productImageView}>
                            <ImagePlaceholder
                              style={[styles.productImage]}
                              placeholderSource={Images.logo}
                              placeholderStyle={[
                                styles.productImage,
                                { tintColor: "rgba(0,0,0,0.2)" },
                              ]}
                              loadingStyle={{
                                size: 30,
                                color: COLORS.linearGradient1,
                                unfilledColor: COLORS.linearGradient2,
                              }}
                              source={
                                imageLink != undefined &&
                                imageLink.trim() != "  "
                                  ? { uri: imageLink }
                                  : Images.logo
                              }
                              resizeMode={"contain"}
                            />
                          </View>
                        )}

                        <Text style={styles.productName}>{name}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }}
                ListEmptyComponent={() => {
                  return (
                    <EmptyListComponent displayText={"No Products Available"} />
                  );
                }}
              />
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
};

export default JewelleryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor,
  },
  loadingStyle: {
    width: WIDTH,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  productTypeButton: {
    minWidth: WIDTH * 0.35,
    borderRadius: 30,
    overflow: "hidden",
    height: 40,
    paddingHorizontal: 15,
    margin: 5,
    marginTop: 10,
    backgroundColor: primaryColor + 50,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  productList: {
    height: HEIGHT * 0.3,
    width: WIDTH * 0.5,
    // padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  productListButton: {
    height: "95%",
    width: "95%",
    backgroundColor: whiteColor,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  productImageView: {
    height: "85%",
    width: "85%",
    borderRadius: 20,
    borderColor: whiteColorLight,
    borderWidth: 2,
    overflow: "hidden",
  },
  productImage: {
    height: "100%",
    width: "100%",

    resizeMode: "contain",
  },
  productName: {
    color: blackColor,
    fontFamily: Medium,
    fontSize: 13,
    marginTop: 5,
    textAlign: "center",
  },
  emptyList: {
    height: HEIGHT * 0.8,
    width: WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListText: {
    fontFamily: Semi_Bold,
    color: greyColor,
    fontSize: 20,
    textAlign: "center",
  },
});
