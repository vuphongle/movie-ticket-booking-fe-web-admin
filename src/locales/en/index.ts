import common from "./common";
import menu from "./menu";
import login from "./login";
import forgotPassword from "./forgotPassword";
import changePassword from "./changePassword";
import showtimes from "./showTimes";
import schedule from "./schedule";
import coupon from "./coupon";
import movie from "./movie";

const en = {
  ...common,
  ...menu,
  ...login,
  ...showtimes,
  ...changePassword,
  ...forgotPassword,
  ...schedule,
  ...coupon,
  ...movie,
};

export default en;
