import { montserratBold } from "./root.theme";
import { SCROLLVIEW_INNER_BOTTOM_PADDING } from "./shared.constants";

export const sharedStyles = {
  ScrollViewInner: {
    paddingBottom: SCROLLVIEW_INNER_BOTTOM_PADDING,
  },
  container: {
    display: "flex",
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    display: "flex",
    flex: 1,
  },
  FlatListWrapper: {
    flexGrow: 1,
  },
  bold: {
    fontFamily: montserratBold,
    fontWeight: "normal",
  },
} as const;
