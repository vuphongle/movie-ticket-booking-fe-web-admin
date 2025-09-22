const priceManagement = {
  // Common
  ANY: "Any",
  
  // Buttons
  CREATE_PRICE_LIST_BUTTON: "Create Price List",
  CREATE_PRICE_ITEM_BUTTON: "Create Price Item",
  CREATE_PRICE_LIST: "Create Price List",
  CREATE_PRICE_ITEM: "Create Price Item",
  UPDATE_PRICE_LIST: "Update Price List",
  UPDATE_PRICE_ITEM: "Update Price Item",
  SAVE_BUTTON: "Save",
  CANCEL_BUTTON: "Cancel",
  REFRESH_BUTTON: "Refresh",
  VIEW_DETAILS: "View Details",
  
  // PriceList Fields
  PRICE_LIST_NAME: "Price List Name",
  PRIORITY: "Priority",
  VALIDITY_PERIOD: "Validity Period",
  STATUS: "Status",
  NAME: "Name",
  VALID_FROM: "Valid From",
  VALID_TO: "Valid To",
  FROM: "From",
  TO: "To",
  
  // PriceItem Fields
  TARGET_TYPE: "Target Type",
  TARGET_ID: "Target ID",
  TARGET_NAME: "Target Name",
  PRICE_LIST_DETAIL: "Price List Detail",
  DELETE_PRICE_LIST: "Delete Price List",
  PRICE_ITEMS_FOR_LIST: "Price Items for {{name}}",
  // Table Headers
  TICKET_CONDITIONS: "Ticket Conditions",
  TIMELINE_VIEW: "Timeline View",
  PRICE_SIMULATION: "Price Simulation",
  MIN_QUANTITY: "Minimum Quantity",
  EFFECTIVE_FROM: "Effective From",
  EFFECTIVE_TO: "Effective To",
  
  // Ticket-specific fields
  SEAT_TYPE: "Seat Type",
  GRAPHICS_TYPE: "Graphics Type",
  SCREENING_TIME_TYPE: "Screening Time Type",
  DAY_TYPE: "Day Type",
  AUDITORIUM_TYPE: "Auditorium Type",
  
  // Target Types
  TARGET_TYPE_PRODUCT: "Product",
  TARGET_TYPE_ADDITIONAL_SERVICE: "Additional Service",
  TARGET_TYPE_TICKET: "Ticket",
  
  // Status Tags
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  PENDING: "Pending",
  EXPIRED: "Expired",
  NO_TIME_LIMIT: "No Time Limit",
  
  // Table Columns
  PRICE_ITEMS_COUNT: "Price Items Count",
  ITEMS: "items",
  CREATED_AT: "Created At",
  UPDATED_AT: "Updated At",
  ACTIONS: "Actions",
  OF: "of",
  
  // Placeholders
  ENTER_PRICE_LIST_NAME: "Enter price list name",
  ENTER_PRIORITY: "Enter priority",
  ENTER_PRICE: "Enter price",
  ENTER_MIN_QUANTITY: "Enter minimum quantity",
  SELECT_TARGET_TYPE: "Select target type",
  SELECT_STATUS: "Select status",
  SELECT_SEAT_TYPE: "Select seat type",
  SELECT_GRAPHICS_TYPE: "Select graphics type",
  SELECT_ADDITIONAL_SERVICE: "Select additional service",
  SIMULATE_AT: "Simulate At",
  
  // Seat Types
  SEAT_TYPE_NORMAL: "Normal",
  SEAT_TYPE_STANDARD: "Standard",
  SEAT_TYPE_COUPLE: "Couple",
  
  // Graphics Types
  GRAPHICS_TYPE_2D: "2D",
  GRAPHICS_TYPE_3D: "3D",
  GRAPHICS_TYPE_IMAX: "IMAX",
  
  // Day Types
  DAY_TYPE_WEEKDAY: "Weekday",
  DAY_TYPE_WEEKEND: "Weekend", 
  DAY_TYPE_HOLIDAY: "Holiday",
  
  // Screening Time Types
  SELECT_SCREENING_TIME_TYPE: "Select screening time type",
  SCREENING_TIME_MORNING: "Morning",
  SCREENING_TIME_AFTERNOON: "Afternoon",
  SCREENING_TIME_EVENING: "Evening",
  SCREENING_TIME_NIGHT: "Night",
  SCREENING_TIME_EARLY: "Early",
  SCREENING_TIME_REGULAR: "Regular",
  
  // Auditorium Types
  AUDITORIUM_TYPE_STANDARD: "Standard",
  AUDITORIUM_TYPE_VIP: "VIP",
  AUDITORIUM_TYPE_IMAX: "IMAX",
  AUDITORIUM_TYPE_4DX: "4DX",
  AUDITORIUM_TYPE_GOLDCLASS: "Gold Class",
  
  // Validation Messages
  PRICE_LIST_NAME_REQUIRED: "Price list name is required!",
  PRICE_LIST_NAME_MIN_LENGTH: "Price list name must be at least 3 characters!",
  PRIORITY_REQUIRED: "Priority is required!",
  PRIORITY_RANGE: "Priority must be between 1 and 999!",
  PRICE_REQUIRED: "Price is required!",
  PRICE_MUST_GREATER_THAN_ZERO: "Price must be greater than 0!",
  TARGET_TYPE_REQUIRED: "Target type is required!",
  
  // Tooltips
  PRIORITY_TOOLTIP: "Higher number means higher priority when calculating prices",
  VALIDITY_PERIOD_TOOLTIP: "Leave empty for unlimited validity period",
  SEAT_TYPE_TOOLTIP: "Select the type of seat this price applies to. Leave empty to apply to all seat types",
  GRAPHICS_TYPE_TOOLTIP: "Select the movie format this price applies to (2D, 3D, etc.). Leave empty to apply to all formats", 
  SCREENING_TIME_TYPE_TOOLTIP: "Select the time period this price applies to (morning, afternoon, evening). Leave empty to apply to all times",
  DAY_TYPE_TOOLTIP: "Select the day type this price applies to (weekday, weekend, holiday). Leave empty to apply to all days",
  AUDITORIUM_TYPE_TOOLTIP: "Select the auditorium type this price applies to (standard, IMAX, etc.). Leave empty to apply to all auditorium types",
  MIN_QUANTITY_TOOLTIP: "Minimum quantity required to apply this price. Leave empty for no minimum requirement",
  SIMULATE_AT_TOOLTIP: "Set the date and time for price simulation to test how pricing rules work at different times",
  
  // Messages
  UPDATE_STATUS_SUCCESS: "Status updated successfully!",
  REFRESH_SUCCESS: "Refreshed successfully!",
  CREATE_ERROR: "Create failed!",
  UPDATE_ERROR: "Update failed!",
  DELETE_ERROR: "Delete failed!",
  UPDATE_STATUS_ERROR: "Status update failed!",
  
  // Confirm Messages
  DELETE_CONFIRM_TITLE: "Are you sure you want to delete?",
  DELETE_CONFIRM_CONTENT: "This action cannot be undone!",
  CLONE_CONFIRM_TITLE: "Clone Price List",
  CLONE_CONFIRM_CONTENT: "Are you sure you want to clone '{{name}}'? This will create a copy of the price list and all its price items.",
  CLONE_SUCCESS: "Price list cloned successfully!",
  CLONE_ERROR: "Failed to clone price list!",
  CAN_ACTIVATE_LATER: "can be activated later",
  OK_TEXT: "Delete",
  CANCEL_TEXT: "Cancel",

  TARGET: "Target",
  TARGET_REQUIRED: "Target is required!",

  //Tab
  ALL_PRICE_ITEMS: "All Price Items",
  TICKET_PRICES: "Ticket Prices",
  PRODUCT_PRICES: "Product Prices",
  ADDITIONAL_SERVICE_PRICES: "Additional Service Prices",
  
};

export default priceManagement;