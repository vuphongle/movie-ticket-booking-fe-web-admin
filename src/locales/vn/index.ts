import common from "./common";
import menu from "./menu";
import login from "./login";
import forgotPassword from "./forgotPassword";
import changePassword from "./changPassword";

const vn = {
  ...common,
  ...menu,
  ...login,
  ...changePassword,
  ...forgotPassword,
};

export default vn;
