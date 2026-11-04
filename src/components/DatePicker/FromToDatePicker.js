import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { COLORS } from "../../../constants/Colors";
import { FONTS } from "../../../constants/Fonts";
import { convertDateFormat } from "../../../constants/Functions";
import StaticBackground from "../background/StaticBackground";

const defaultDatePickerModal = { visible: false, type: null, date: new Date() };
const FromToDatePicker = ({
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  onSearch,
}) => {
  const [datepickerModal, setDatepickerModal] = useState({
    ...defaultDatePickerModal,
  });

  const openDatePicker = (type) => {
    let openModal = {
      visible: true,
      type: type,
      date: type == "Start" ? startDate : endDate,
    };
    setDatepickerModal(openModal);
  };
  const closeDatePicker = () => {
    setDatepickerModal({ ...defaultDatePickerModal });
  };
  const onChangeDate = (selectedDate) => {
    closeDatePicker();
    if (datepickerModal.type == "Start") {
      if (selectedDate > endDate) {
        handleSnackBar(`Start Date can't be greater than End Date`, false);
        return;
      }
      setStartDate(selectedDate);
    } else {
      if (selectedDate < startDate) {
        handleSnackBar(`End Date can't be Less than Start Date`, false);
        return;
      }
      setEndDate(selectedDate);
    }
  };
  return (
    <>
      <View style={styles.dateContainer}>
        <Text style={[styles.dateText, { color: COLORS.blackColor }]}>
          From
        </Text>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.dateButton}
          onPress={() => openDatePicker("Start")}
        >
          <StaticBackground isGradient />
          <Text style={styles.dateText}>{convertDateFormat(startDate)}</Text>
        </TouchableOpacity>
        <Text style={[styles.dateText, { color: COLORS.blackColor }]}>To</Text>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.dateButton}
          onPress={() => openDatePicker("End")}
        >
          <StaticBackground isGradient />
          <Text style={styles.dateText}>{convertDateFormat(endDate)}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.dateButton]}
          onPress={onSearch}
        >
          <StaticBackground isGradient />
          <Text style={styles.dateText}>Search</Text>
        </TouchableOpacity>
      </View>
      {datepickerModal.visible && (
        <DateTimePickerModal
          isVisible={datepickerModal.visible}
          mode="date"
          date={datepickerModal.date || new Date()}
          onConfirm={onChangeDate}
          onCancel={closeDatePicker}
          textColor={COLORS.blackColor}
          maximumDate={datepickerModal.type == "Start" ? endDate : new Date()}
          minimumDate={datepickerModal.type == "End" ? startDate : new Date(0)}
        />
      )}
    </>
  );
};

export default FromToDatePicker;

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: "row",
    width: "98%",
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-evenly",
    marginVertical: 8,
    backgroundColor: COLORS.whiteColor,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.boxBorder,
  },
  dateButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    paddingHorizontal: 5,
    backgroundColor: COLORS.primaryColor,
    borderRadius: 5,
    marginHorizontal: 3,
    overflow: "hidden",
  },
  dateText: {
    fontFamily: FONTS.Medium,
    fontSize: 15,
    color: COLORS.whiteColor,
  },
});
