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
import ticketPrice from "./ticketPrice";
import priceManagement from "./priceManagement";
import additionalService from "./additionalService";

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
  ...ticketPrice,
  ...priceManagement,
  ...additionalService,
};

export default en;
