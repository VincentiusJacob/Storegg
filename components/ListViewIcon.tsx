import * as React from "react";
import { StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const ListViewIcon = (props: any) => {
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const iconColor = themeMode === "dark" ? "white" : "black";

  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      style={styles.icon}
      viewBox="0 0 48 48"
      {...props}
    >
      <Path
        d="M6 38V10h36v28Zm3-19.65h5.3V13H9Zm8.3 0H39V13H17.3Zm0 8.3H39v-5.3H17.3Zm0 8.35H39v-5.35H17.3ZM9 35h5.3v-5.35H9Zm0-8.35h5.3v-5.3H9Z"
        fill={iconColor}
      />
    </Svg>
  );
};

export default ListViewIcon;

const styles = StyleSheet.create({
  icon: {
    height: 35,
    width: 35,
  },
});
