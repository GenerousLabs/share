import { SCROLLVIEW_INNER_BOTTOM_PADDING } from "./shared.constants";

export const sharedStyles = {
  ScollViewInner: {
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
} as const;
