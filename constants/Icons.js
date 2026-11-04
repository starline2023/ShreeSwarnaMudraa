import AntDesign from '@react-native-vector-icons/ant-design';
import Entypo from '@react-native-vector-icons/entypo';
import Feather from '@react-native-vector-icons/feather';
import Ionicons from '@react-native-vector-icons/ionicons';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import { COLORS } from './Colors';

export { AntDesign, Entypo, Feather, Ionicons, MaterialIcons };

export const SnackbarIcons = (status, color = COLORS.whiteColor, size) => {
  return status ? (
    <Feather name="check-circle" size={size || 25} color={color} />
  ) : (
    <MaterialIcons
      name="report-gmailerrorred"
      size={size || 30}
      color={color}
    />
  );
};
