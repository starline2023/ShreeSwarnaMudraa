import React, { memo } from "react";
import {
    TouchableOpacity,
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
} from "react-native";

import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";

const TradeActionButton = ({
    title,
    backgroundColor,
    loading,
    disabled,
    skeleton = false,
    onPress,
}) => {
    if (skeleton) {
        return (
            <View
                style={[
                    styles.button,
                    {
                        backgroundColor,
                        padding: 16,
                    },
                ]}
            >
                <View style={styles.skeleton} />
            </View>
        );
    }

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.button,
                {
                    backgroundColor,
                    opacity: disabled ? 0.5 : 1,
                },
            ]}
        >
            {loading ? (
                <ActivityIndicator
                    size="large"
                    color={COLORS.whiteColor}
                />
            ) : (
                <Text style={styles.buttonText}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

export default memo(TradeActionButton);

const styles = StyleSheet.create({
    button: {
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        borderRadius: 5,
    },

    buttonText: {
        fontFamily: FONTS.Bold,
        fontSize: 16,
        color: COLORS.whiteColor,
    },

    skeleton: {
        backgroundColor: COLORS.whiteColor,
        height: 10,
        width: "30%",
        borderRadius: 5,
    },
});