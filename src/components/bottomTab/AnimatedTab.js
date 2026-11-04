import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { COLORS } from "../../../constants/Colors";
import { Images } from "../../../constants/Images";
import { SHADOW } from "../../../constants/Styles";
import CustomHeader from "../header/CustomHeader";
import { SafeAreaView } from "react-native-safe-area-context";
// import * as Animatable from "react-native-animatable";

import LiverateScreen from "../../screens/bottomTab/LiverateScreen";
import JewelleryScreen from "../../screens/bottomTab/JewelleryScreen";
import TradeScreen from "../../screens/bottomTab/TradeScreen";
import MenuScreen from "../../screens/bottomTab/MenuScreen";
import News from "../../screens/stack/News/News";
import CustomTabBar from "./CustomTabBar";
import { GLOBALS } from "../../../constants/GLOBALS";
import CoinRatesScreen from "../../screens/bottomTab/CoinRatesScreen";
import CoinTradeScreen from "../../screens/bottomTab/CoinTradeScreen";
import Marquee from "../Marquee/Marquee";

const Tab = createBottomTabNavigator();

const activeTabColor = COLORS.secondaryColor;
const inActiveTabColor = COLORS.whiteColor;

const AnimatedTab = () => {
  const TabArr = [
    {
      route: "Liverate",
      label: "Liverate",
      activeIcon: (
        <Image source={Images.activeLiverate} style={styles.activeIcons} />
      ),
      inActiveIcon: (
        <Image source={Images.inActiveLiverate} style={styles.inActiveIcons} />
      ),
      component: LiverateScreen,
    },
    GLOBALS.isTerminal
      ? {
          route: "Trades",
          label: "Trades",
          activeIcon: (
            <Image source={Images.activeTrade} style={styles.activeIcons} />
          ),
          inActiveIcon: (
            <Image source={Images.inActiveTrade} style={styles.inActiveIcons} />
          ),
          component: TradeScreen,
        }
      : null,
    GLOBALS.hasCoin
      ? {
          route: "Coin Rates",
          label: "Coin Rates",
          activeIcon: (
            <Image source={Images.activeCoin} style={styles.activeIcons} />
          ),
          inActiveIcon: (
            <Image source={Images.inActiveCoin} style={styles.inActiveIcons} />
          ),
          component: CoinRatesScreen,
        }
      : {
          route: "News",
          label: "News",
          activeIcon: (
            <Image source={Images.activeNews} style={styles.activeIcons} />
          ),
          inActiveIcon: (
            <Image source={Images.inActiveNews} style={styles.inActiveIcons} />
          ),
          component: News,
        },
    ,
    GLOBALS.hasCoinTrade
      ? {
          route: "CoinTrade",
          label: "Coin Trade",
          activeIcon: (
            <Image source={Images.activeCoinTrade} style={styles.activeIcons} />
          ),
          inActiveIcon: (
            <Image
              source={Images.inActiveCoinTrade}
              style={styles.inActiveIcons}
            />
          ),
          component: CoinTradeScreen,
        }
      : null,
    GLOBALS.hasJewellery
      ? {
          route: "Jewellery",
          label: "Jewellery",
          activeIcon: (
            <Image source={Images.activeJewellery} style={styles.activeIcons} />
          ),
          inActiveIcon: (
            <Image
              source={Images.inActiveJewellery}
              style={styles.activeIcons}
            />
          ),
          component: JewelleryScreen,
        }
      : null,
    {
      route: "Menu",
      label: "Menu",
      activeIcon: (
        <Image source={Images.activeMenu} style={styles.activeIcons} />
      ),
      inActiveIcon: (
        <Image source={Images.inActiveMenu} style={styles.inActiveIcons} />
      ),
      component: MenuScreen,
    },
  ];
  return (
    <Tab.Navigator
      initialRouteName="Liverate"
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        tabBarHideOnKeyboard: true,
        header: (props) => {
          return (
            <View>
              <CustomHeader {...props} />
              <Marquee position={"Top"} />
            </View>
          );
        },
      }}
    >
      {TabArr.map((item, index) => {
        if (item == null) {
          return;
        }
        return (
          <Tab.Screen
            key={index}
            name={item.route}
            component={item.component}
            options={{
              tabBarShowLabel: false,
              tabBarLabel: item?.label,
              tabBarIcon: ({ focused }) =>
                focused ? item.activeIcon : item.inActiveIcon,
              // tabBarButton: (props) => <TabButton {...props} item={item} />,
            }}
          />
        );
      })}
    </Tab.Navigator>
  );
};

export default AnimatedTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 60,
  },
  activeIcons: {
    height: 30,
    width: 30,
    tintColor: activeTabColor,
    resizeMode: "contain",
  },
  inActiveIcons: {
    height: 30,
    width: 30,
    tintColor: inActiveTabColor,
    resizeMode: "contain",
  },
  inActiveElevatedIcon: {
    bottom: 30,
    height: 65,
    width: 65,
    borderRadius: 100,
    backgroundColor: COLORS.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW,
    elevation: 10,
    shadowColor: COLORS.whiteColor,
  },
  activeElevatedIcon: {
    bottom: 30,
    height: 65,
    width: 65,
    borderRadius: 100,
    backgroundColor: COLORS.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    ...SHADOW,
    elevation: 10,
    shadowColor: COLORS.whiteColor,
  },
});
