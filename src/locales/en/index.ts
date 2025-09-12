import common from "./common";
import menu from "./menu";
import login from "./login";
import forgotPassword from "./forgotPassword";
import changePassword from "./changePassword";
import showtimes from "./showTimes";
import schedule from "./schedule";
import coupon from "./coupon";

const en = {
  ...common,
  ...menu,
  ...login,
  ...showtimes,
  ...changePassword,
  ...forgotPassword,
  ...schedule,
  ...coupon,
};

export default en;
