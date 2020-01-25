import { ATTACHED_COLOR } from "../PolygonSystem/getOptions"

const K_CIRCLE_SIZE = 34
const K_STICK_SIZE = 10
const K_STICK_WIDTH = 3
const K_BORDER_WIDTH = 4

const K_POP_UP_ANIMATION = {
  transform: "perspective(1px) translate3d(0, 0, 0) scale3d(1.5, 1.5, 1)",
  transition: "-webkit-transform 0.3s cubic-bezier(0.485, 1.65, 0.545, 0.835)",
  willChange: "transform",
  backgroundRepeat: "no-repeat",
  backfaceVisibility: "hidden",
  WebkitFontSmoothing: "subpixel-antialiased"
}

const markerStyle = {
  position: "absolute",
  width: K_CIRCLE_SIZE,
  height: K_CIRCLE_SIZE + K_STICK_SIZE,
  top: -(K_CIRCLE_SIZE + K_STICK_SIZE),
  left: -K_CIRCLE_SIZE / 2
}

const locationCircleStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: K_CIRCLE_SIZE,
  height: K_CIRCLE_SIZE,
  border: `${K_BORDER_WIDTH}px solid ${ATTACHED_COLOR}`,
  borderRadius: K_CIRCLE_SIZE,
  color: `${ATTACHED_COLOR}`,
  backgroundColor: "white",
  // boxShadow:
  //   '0px 1px 5px 0px 0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
  cursor: "pointer",
  fontSize: K_CIRCLE_SIZE,
  fontWeight: 900,
  display: "flex",
  textAlign: "center",
  alignItems: "center",
  alignContent: "center",
  justifyContent: "center",
  verticalAlign: "middle",
  flexWrap: "wrap",
  zIndex: 999
}

const locationCircleStyleHover = {
  ...locationCircleStyle,
  color: `${ATTACHED_COLOR}`,
  transform: "perspective(1px) translate3d(0, 0, 0) scale3d(1.1, 1.1, 1)",
  transition: "-webkit-transform 0.25s cubic-bezier(0.485, 1.65, 0.545, 0.835)",
  willChange: "transform",
  backgroundRepeat: "no-repeat",
  backfaceVisibility: "hidden",
  WebkitFontSmoothing: "subpixel-antialiased",
  transformOrigin: "15px 60px 0px",
  zIndex: 1000,
  boxShadow:
    "0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)"
}

const locationStickStyle = {
  position: "absolute",
  left: K_CIRCLE_SIZE / 2 - 14,
  top: K_CIRCLE_SIZE - 8,
  width: 0,
  height: 0,
  border: "14px solid transparent",
  borderTop: `18px solid ${ATTACHED_COLOR}`,
  zIndex: 998
}

const locationStickStyleHover = {
  ...locationStickStyle,
  willChange: "transform",
  transition: "-webkit-transform 1s cubic-bezier(0.485, 1.65, 0.545, 0.835)"
}

export {
  markerStyle,
  locationCircleStyle,
  locationCircleStyleHover,
  locationStickStyle,
  locationStickStyleHover,
  K_CIRCLE_SIZE,
  K_STICK_SIZE,
  K_POP_UP_ANIMATION
}
