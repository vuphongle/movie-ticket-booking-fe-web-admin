import common from "./common";
import menu from "./menu";
import login from "./login";
import forgotPassword from "./forgotPassword";
import changePassword from "./changePassword";
import showtimes from "./showTimes";
import schedule from "./schedule";
import coupon from "./coupon";
import movie from "./movie";
import cinema from "./cinema";
import priceManagement from "./priceManagement";
import additionalService from "./additionalService";
import overview from "./overview";
import report from "./report";

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
  ...cinema,
  ...priceManagement,
  ...additionalService,
  ...overview,
  ...report,
};

export default en;
