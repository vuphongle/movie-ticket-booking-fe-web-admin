const priceManagement = {
  // Navigation & Breadcrumb
  PRICE_MANAGEMENT: "Price Management",
  PRICE_LIST_MANAGEMENT: "Price List Management",
  PRICE_LIST_MANAGEMENT_TITLE: "Price List Management",
  PRICE_ITEM_MANAGEMENT: "Price Item Management", 
  PRICE_ITEM_MANAGEMENT_TITLE: "Price Item Management",
  
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
  TIMELINE_VIEW: "Timeline View",
  PRICE_SIMULATION: "Price Simulation",
  PRICE: "Price",
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
  OK_TEXT: "Delete",
  CANCEL_TEXT: "Cancel",
};

export default priceManagement;