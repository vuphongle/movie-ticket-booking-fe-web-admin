const coupon = {
  // Page titles and navigation
  COUPON_LIST_TITLE: "Coupon List",
  COUPON_LIST_BREADCRUMB: "Coupon List",
  COUPON_DETAIL_TITLE: "Coupon Details",

  // Buttons
  COUPON_CREATE_BTN: "Create Coupon",
  COUPON_UPDATE_BTN: "Update",
  COUPON_SAVE_BTN: "Save",
  COUPON_DELETE_BTN: "Delete",
  COUPON_REFRESH_BTN: "Refresh",
  COUPON_CANCEL_BTN: "Cancel",
  ADD_COUPON_DETAIL: "Add Detail",
  BACK_TO_LIST: "Back to List",

  // Modal titles
  COUPON_CREATE_MODAL_TITLE: "Create Coupon",
  COUPON_UPDATE_MODAL_TITLE: "Update Coupon",
  CREATE_COUPON_DETAIL: "Create Coupon Detail",
  EDIT_COUPON_DETAIL: "Edit Coupon Detail",
  COUPON_DETAIL_LIST_TITLE: "Coupon Detail List",
  ADD_COUPON_DETAIL_BTN: "Add Detail",

  // Form labels
  COUPON_CODE_LABEL: "Coupon Code",
  COUPON_NAME_LABEL: "Coupon Name",
  COUPON_DESCRIPTION_LABEL: "Description",
  COUPON_DISCOUNT_LABEL: "Discount Percentage (%)",
  COUPON_MAX_DISCOUNT_LABEL: "Maximum Discount (VND)",
  COUPON_QUANTITY_LABEL: "Quantity",
  COUPON_STATUS_LABEL: "Status",
  COUPON_START_DATE_LABEL: "Start Date",
  COUPON_END_DATE_LABEL: "End Date",

  // Form placeholders
  COUPON_CODE_PLACEHOLDER: "Enter coupon code",
  COUPON_NAME_PLACEHOLDER: "Enter coupon name",
  COUPON_DESCRIPTION_PLACEHOLDER: "Enter coupon description...",
  COUPON_DISCOUNT_PLACEHOLDER: "Enter discount percentage",
  COUPON_MAX_DISCOUNT_PLACEHOLDER:
    "Enter maximum discount amount (leave blank for unlimited)",
  COUPON_QUANTITY_PLACEHOLDER: "Enter quantity",
  COUPON_STATUS_PLACEHOLDER: "Select a status",
  SELECT_DATE: "Select date",
  SELECT_START_DATE: "Select start date",
  SELECT_END_DATE: "Select end date",

  // Table columns
  COUPON_TABLE_CODE: "Coupon Code",
  COUPON_TABLE_DISCOUNT: "Discount Percentage",
  COUPON_TABLE_MAX_DISCOUNT: "Maximum Discount",
  COUPON_TABLE_QUANTITY: "Quantity",
  COUPON_TABLE_USED: "Used",
  COUPON_TABLE_STATUS: "Status",
  COUPON_TABLE_VALIDITY_PERIOD: "Validity Period",
  COUPON_TABLE_ACTIONS: "Actions",

  // Status options
  COUPON_STATUS_ACTIVE: "Active",
  COUPON_STATUS_INACTIVE: "Inactive",
  COUPON_STATUS_UPCOMING: "Upcoming",
  COUPON_STATUS_EXPIRED: "Expired",

  // Common texts
  COUPON_UNLIMITED: "Unlimited",
  COUPON_CODE_EXTRA: "Unique code to identify the promotion",
  COUPON_NAME_EXTRA: "Display name for customers",
  COUPON_DESCRIPTION_EXTRA: "Detailed description of the offer (optional)",
  COUPON_STATUS_EXTRA_EDIT: "Display mode of the coupon",
  COUPON_STATUS_EXTRA_CREATE: "New coupons will be hidden",
  COUPON_STATUS_ACTIVE_EXTRA: "Visible and can be used",
  COUPON_STATUS_INACTIVE_EXTRA: "Not visible to customers",

  // Alert messages
  NEXT_STEP: "Next Step",
  NEXT_STEP_EDIT_DESC:
    "After updating, you can manage detailed promotion information.",
  NEXT_STEP_CREATE_DESC:
    "New coupons will be hidden. After creation, you need to add detailed conditions before activating the promotion.",
  NOTE: "Note",
  NOTE_CREATE_DESC:
    "New coupons are always hidden for safety. You need to add at least one detailed condition before activation.",

  // Validation messages
  COUPON_CODE_REQUIRED: "Coupon code is required!",
  COUPON_CODE_MIN_LENGTH: "Coupon code must be at least 3 characters!",
  COUPON_CODE_MAX_LENGTH: "Coupon code must not exceed 50 characters!",
  COUPON_CODE_PATTERN:
    "Code only contains uppercase letters, numbers, underscores and dashes!",
  COUPON_NAME_REQUIRED: "Coupon name is required!",
  COUPON_NAME_MIN_LENGTH: "Coupon name must be at least 3 characters!",
  COUPON_NAME_MAX_LENGTH: "Coupon name must not exceed 200 characters!",
  COUPON_DESCRIPTION_MAX_LENGTH: "Description must not exceed 1000 characters!",
  COUPON_DISCOUNT_REQUIRED: "Discount percentage is required!",
  COUPON_DISCOUNT_RANGE_ERROR: "Discount percentage must be between 0 and 100",
  COUPON_MAX_DISCOUNT_MIN_ERROR: "Maximum discount must be greater than 0",
  COUPON_QUANTITY_REQUIRED: "Quantity is required!",
  COUPON_QUANTITY_MIN_ERROR: "Quantity must be greater than 0",
  COUPON_STATUS_REQUIRED: "Status is required!",
  COUPON_START_DATE_REQUIRED: "Start date is required!",
  COUPON_END_DATE_REQUIRED: "End date is required!",
  COUPON_END_DATE_AFTER_START: "End date must be after start date!",

  // Success messages
  COUPON_CREATE_SUCCESS: "Coupon created successfully!",
  COUPON_UPDATE_SUCCESS: "Coupon updated successfully!",
  COUPON_DELETE_SUCCESS: "Coupon deleted successfully!",
  CREATE_COUPON_DETAIL_SUCCESS: "Coupon detail created successfully!",
  UPDATE_COUPON_DETAIL_SUCCESS: "Coupon detail updated successfully!",

  // Confirmation messages
  COUPON_DELETE_CONFIRM_TITLE: "Are you sure you want to delete this coupon?",
  COUPON_DELETE_CONFIRM_CONTENT: "This action cannot be undone!",

  // Error messages
  COUPON_CREATE_ERROR: "Failed to create coupon",
  COUPON_UPDATE_ERROR: "Failed to update coupon",
  COUPON_DELETE_ERROR: "Failed to delete coupon",
  COUPON_FETCH_ERROR: "Failed to fetch coupons",

  // Success messages for coupon detail
  COUPON_DETAIL_DISABLE_SUCCESS: "Coupon detail disabled successfully",
  COUPON_DETAIL_ENABLE_SUCCESS: "Coupon detail enabled successfully",
  COUPON_DETAIL_DELETE_SUCCESS: "Coupon detail deleted successfully",
  COUPON_DETAIL_UPDATE_SUCCESS: "Coupon detail updated successfully!",
  COUPON_DETAIL_CREATE_SUCCESS: "Coupon detail created successfully!",

  // Error messages for coupon detail
  COUPON_DETAIL_ERROR: "An error occurred",

  // Validation messages for coupon detail
  COUPON_DETAIL_START_DATE_REQUIRED: "Please select start date!",
  COUPON_DETAIL_END_DATE_REQUIRED: "Please select end date!",
  COUPON_DETAIL_START_DATE_AFTER_PARENT_START:
    "Start date cannot be before parent coupon start date",
  COUPON_DETAIL_START_DATE_BEFORE_PARENT_END:
    "Start date cannot be after parent coupon end date",
  COUPON_DETAIL_END_DATE_AFTER_PARENT_START:
    "End date cannot be before parent coupon start date",
  COUPON_DETAIL_END_DATE_BEFORE_PARENT_END:
    "End date cannot be after parent coupon end date",

  // Placeholders for coupon detail
  SELECT_DETAIL_START_DATE: "Select start date",
  SELECT_DETAIL_END_DATE: "Select end date",

  // Modal titles and buttons
  COUPON_DETAIL_EDIT_TITLE: "Edit coupon detail",
  COUPON_DETAIL_ADD_TITLE: "Add coupon detail",
  COUPON_DETAIL_UPDATE_BTN: "Update",
  COUPON_DETAIL_CREATE_BTN: "Create",
  COUPON_DETAIL_CANCEL_BTN: "Cancel",

  // Form labels for coupon detail
  COUPON_DETAIL_ENABLED_LABEL: "Enable",
  COUPON_DETAIL_PRIORITY_LABEL: "Priority",
  COUPON_DETAIL_TARGET_TYPE_LABEL: "Target Type",
  COUPON_DETAIL_REF_ID_LABEL: "Reference ID",
  COUPON_DETAIL_BENEFIT_TYPE_LABEL: "Benefit Type",
  COUPON_DETAIL_PERCENT_LABEL: "Discount Percent",
  COUPON_DETAIL_AMOUNT_LABEL: "Discount Amount",
  COUPON_DETAIL_GIFT_PRODUCT_LABEL: "Gift Product",
  COUPON_DETAIL_GIFT_QUANTITY_LABEL: "Gift Quantity",
  COUPON_DETAIL_LINE_MAX_DISCOUNT_LABEL: "Max Discount Per Line",
  COUPON_DETAIL_MIN_QUANTITY_LABEL: "Minimum Quantity",
  COUPON_DETAIL_LIMIT_QUANTITY_LABEL: "Limit Quantity Applied",
  COUPON_DETAIL_MIN_ORDER_TOTAL_LABEL: "Minimum Order Total",
  COUPON_DETAIL_USAGE_LIMIT_LABEL: "Usage Limit",
  COUPON_DETAIL_SELECTION_STRATEGY_LABEL: "Selection Strategy",
  COUPON_DETAIL_NOTES_LABEL: "Notes",
  COUPON_DETAIL_START_DATE_LABEL: "Start Date",
  COUPON_DETAIL_END_DATE_LABEL: "End Date",

  // Table column headers
  COUPON_DETAIL_STATUS_COLUMN: "Status",
  COUPON_DETAIL_PRIORITY_COLUMN: "Priority",
  COUPON_DETAIL_TARGET_COLUMN: "Target",
  COUPON_DETAIL_BENEFIT_COLUMN: "Benefit",
  COUPON_DETAIL_CONDITIONS_COLUMN: "Conditions",
  COUPON_DETAIL_USAGE_COLUMN: "Usage",
  COUPON_DETAIL_STRATEGY_COLUMN: "Strategy",
  COUPON_DETAIL_DATE_RANGE_COLUMN: "Valid Period",
  COUPON_DETAIL_NOTES_COLUMN: "Notes",
  COUPON_DETAIL_ACTIONS_COLUMN: "Actions",

  // Menu items
  COUPON_DETAIL_EDIT_MENU: "Edit",
  COUPON_DETAIL_DELETE_MENU: "Delete",

  // Confirmation dialog
  COUPON_DETAIL_DELETE_CONFIRM_TITLE: "Confirm Delete",
  COUPON_DETAIL_DELETE_CONFIRM_CONTENT:
    "Are you sure you want to delete this coupon detail?",
  COUPON_DETAIL_DELETE_OK: "Delete",
  COUPON_DETAIL_DELETE_CANCEL: "Cancel",

  // Target type options
  TARGET_ORDER: "Total Order",
  TARGET_SEAT_TYPE: "Specific Seat Type",
  TARGET_SERVICE: "Additional Service",

  // Benefit type options
  BENEFIT_DISCOUNT_PERCENT: "Discount by %",
  BENEFIT_DISCOUNT_AMOUNT: "Discount Amount",
  BENEFIT_FREE_PRODUCT: "Gift Product",

  // Selection strategy options
  STRATEGY_HIGHEST_PRICE_FIRST: "Highest Price First",
  STRATEGY_LOWEST_PRICE_FIRST: "Lowest Price First",
  STRATEGY_FIFO: "First In First Out",

  // Placeholders and tooltips
  SELECT_TARGET_PLACEHOLDER: "Select target",
  SELECT_BENEFIT_TYPE_PLACEHOLDER: "Select benefit type",
  SELECT_SEAT_TYPE_PLACEHOLDER: "Select seat type",
  SELECT_SERVICE_PLACEHOLDER: "Select additional service",
  SELECT_GIFT_PRODUCT_PLACEHOLDER: "Select gift product",
  NOTES_PLACEHOLDER: "Enter notes...",

  // Validation messages
  PRIORITY_REQUIRED: "Please enter priority!",
  TARGET_TYPE_REQUIRED: "Please select target!",
  BENEFIT_TYPE_REQUIRED: "Please select benefit type!",
  PERCENT_REQUIRED: "Please enter percentage!",
  PERCENT_RANGE_MESSAGE: "Percentage must be between 0.01 and 100!",
  AMOUNT_REQUIRED: "Please enter amount!",
  AMOUNT_MIN_MESSAGE: "Amount must be greater than 0!",
  GIFT_PRODUCT_REQUIRED: "Please select gift product!",
  GIFT_QUANTITY_REQUIRED: "Please enter quantity!",
  GIFT_QUANTITY_MIN_MESSAGE: "Quantity must be greater than 0!",
  SEAT_TYPE_REQUIRED: "Please select specific seat type!",
  SERVICE_REQUIRED: "Please select specific additional service!",

  // Tooltips
  REF_ID_TOOLTIP_ORDER: "Not required for order",
  REF_ID_TOOLTIP_SEAT_TYPE: "Select specific seat type",
  REF_ID_TOOLTIP_SERVICE: "Select specific additional service",
  LINE_MAX_DISCOUNT_TOOLTIP: "Maximum discount amount per product line",
  MIN_QUANTITY_TOOLTIP: "Minimum product quantity to apply",
  LIMIT_QUANTITY_TOOLTIP: "Maximum product quantity to apply discount",
  MIN_ORDER_TOTAL_TOOLTIP: "Minimum order total to apply",
  USAGE_LIMIT_TOOLTIP: "Maximum times this detail can be used",
  SELECTION_STRATEGY_TOOLTIP: "How to select products when applying discount",
  START_DATE_TOOLTIP: "Start date of this coupon detail",
  END_DATE_TOOLTIP: "End date of this coupon detail",

  // Condition texts
  MIN_ORDER_CONDITION: "Min order",
  MIN_QUANTITY_CONDITION: "Min qty",
  LIMIT_APPLIED_CONDITION: "Apply limit",

  // Seat type names
  SEAT_TYPE_REGULAR: "Regular Seat",
  SEAT_TYPE_VIP: "VIP Seat",
  SEAT_TYPE_COUPLE: "Couple Seat",
  SEAT_TYPE_DEFAULT: "Seat Type",

  // Target display texts
  TARGET_FULL_ORDER: "Full Order",
  TARGET_ALL_SEAT_TYPES: "All Seat Types",
  TARGET_ALL_SERVICES: "All Services",
  TARGET_SERVICE_PREFIX: "Service",

  // Benefit display texts
  BENEFIT_DISCOUNT_TEXT: "Discount",
  BENEFIT_MAX_TEXT: "max",
  BENEFIT_GIFT_TEXT: "Gift",
  BENEFIT_PRODUCT_TEXT: "product",

  // Pagination
  PAGINATION_TOTAL: "of",
  PAGINATION_ITEMS: "items",

  // Input placeholders
  NOT_REQUIRED_FOR_ORDER: "Not required for order",

  // Date validation messages
  START_DATE_BEFORE_END_DATE: "Start date must be before or equal to end date!",
  END_DATE_AFTER_START_DATE: "End date must be after or equal to start date!",

  // Status update error
  STATUS_UPDATE_ERROR: "Error updating status",
  DELETE_DETAIL_ERROR: "Error deleting coupon detail",
};

export default coupon;
