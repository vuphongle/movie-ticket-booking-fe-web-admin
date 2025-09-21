const priceManagement = {
  // Navigation & Breadcrumb
  PRICE_MANAGEMENT: "Quản lý giá",
  PRICE_LIST_MANAGEMENT: "Quản lý bảng giá",
  PRICE_LIST_MANAGEMENT_TITLE: "Quản lý bảng giá",
  PRICE_ITEM_MANAGEMENT: "Quản lý mục giá",
  PRICE_ITEM_MANAGEMENT_TITLE: "Quản lý mục giá",
  
  // Buttons
  CREATE_PRICE_LIST_BUTTON: "Tạo bảng giá",
  CREATE_PRICE_ITEM_BUTTON: "Tạo mục giá",
  CREATE_PRICE_LIST: "Tạo bảng giá",
  CREATE_PRICE_ITEM: "Tạo mục giá",
  UPDATE_PRICE_LIST: "Cập nhật bảng giá",
  UPDATE_PRICE_ITEM: "Cập nhật mục giá",
  SAVE_BUTTON: "Lưu",
  CANCEL_BUTTON: "Hủy",
  REFRESH_BUTTON: "Làm mới",
  VIEW_DETAILS: "Xem chi tiết",
  
  // PriceList Fields
  PRICE_LIST_NAME: "Tên bảng giá",
  PRIORITY: "Độ ưu tiên",
  VALIDITY_PERIOD: "Thời gian hiệu lực",
  STATUS: "Trạng thái",
  NAME: "Tên",
  VALID_FROM: "Có hiệu lực từ",
  VALID_TO: "Có hiệu lực đến",
  FROM: "Từ",
  TO: "Đến",
  
  // PriceItem Fields
  TARGET_TYPE: "Loại đối tượng",
  TARGET_ID: "ID đối tượng",
  TARGET_NAME: "Tên đối tượng",
  PRICE_LIST_DETAIL: "Chi tiết bảng giá",
  DELETE_PRICE_LIST: "Xóa bảng giá",
  PRICE_ITEMS_FOR_LIST: "Mục giá cho {{name}}",
  TIMELINE_VIEW: "Xem theo thời gian",
  PRICE_SIMULATION: "Mô phỏng giá",
  PRICE: "Giá",
  MIN_QUANTITY: "Số lượng tối thiểu",
  EFFECTIVE_FROM: "Hiệu lực từ",
  EFFECTIVE_TO: "Hiệu lực đến",
  
  // Ticket-specific fields (reuse from ticketPrice.ts)
  SEAT_TYPE: "Loại ghế",
  GRAPHICS_TYPE: "Hình thức chiếu", 
  SCREENING_TIME_TYPE: "Loại suất chiếu",
  DAY_TYPE: "Loại ngày",
  AUDITORIUM_TYPE: "Loại phòng chiếu",
  
  // Target Types
  TARGET_TYPE_PRODUCT: "Sản phẩm",
  TARGET_TYPE_ADDITIONAL_SERVICE: "Dịch vụ bổ sung",
  TARGET_TYPE_TICKET: "Vé xem phim",
  
  // Status Tags
  ACTIVE: "Hoạt động",
  INACTIVE: "Không hoạt động",
  PENDING: "Chờ hiệu lực",
  EXPIRED: "Hết hạn",
  NO_TIME_LIMIT: "Không giới hạn thời gian",
  
  // Table Columns
  PRICE_ITEMS_COUNT: "Số mục giá",
  ITEMS: "mục",
  CREATED_AT: "Ngày tạo",
  UPDATED_AT: "Ngày cập nhật",
  ACTIONS: "Thao tác",
  OF: "của",
  
  // Placeholders
  ENTER_PRICE_LIST_NAME: "Nhập tên bảng giá",
  ENTER_PRIORITY: "Nhập độ ưu tiên",
  ENTER_PRICE: "Nhập giá",
  ENTER_MIN_QUANTITY: "Nhập số lượng tối thiểu",
  SELECT_TARGET_TYPE: "Chọn loại đối tượng",
  SELECT_STATUS: "Chọn trạng thái",
  
  // Validation Messages
  PRICE_LIST_NAME_REQUIRED: "Tên bảng giá không được để trống!",
  PRICE_LIST_NAME_MIN_LENGTH: "Tên bảng giá phải có ít nhất 3 ký tự!",
  PRIORITY_REQUIRED: "Độ ưu tiên không được để trống!",
  PRIORITY_RANGE: "Độ ưu tiên phải từ 1 đến 999!",
  PRICE_REQUIRED: "Giá không được để trống!",
  PRICE_MUST_GREATER_THAN_ZERO: "Giá phải lớn hơn 0!",
  TARGET_TYPE_REQUIRED: "Loại đối tượng không được để trống!",
  
  // Tooltips
  PRIORITY_TOOLTIP: "Số càng cao thì độ ưu tiên càng cao khi tính giá",
  VALIDITY_PERIOD_TOOLTIP: "Để trống nếu muốn bảng giá có hiệu lực vô thời hạn",
  
  // Messages
  UPDATE_STATUS_SUCCESS: "Cập nhật trạng thái thành công!",
  REFRESH_SUCCESS: "Làm mới thành công!",
  CREATE_ERROR: "Tạo thất bại!",
  UPDATE_ERROR: "Cập nhật thất bại!",
  DELETE_ERROR: "Xóa thất bại!",
  UPDATE_STATUS_ERROR: "Cập nhật trạng thái thất bại!",
  
  // Confirm Messages
  DELETE_CONFIRM_TITLE: "Bạn có chắc chắn muốn xóa?",
  DELETE_CONFIRM_CONTENT: "Hành động này không thể hoàn tác!",
  OK_TEXT: "Xóa",
  CANCEL_TEXT: "Hủy",
};

export default priceManagement;