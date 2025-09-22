const priceManagement = {
  // Common
  ANY: "Bất kỳ",
  
  // Buttons
  CREATE_PRICE_LIST_BUTTON: "Tạo danh sách giá",
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
  TICKET_CONDITIONS: "Điều kiện vé",
  TIMELINE_VIEW: "Xem theo thời gian",
  PRICE_SIMULATION: "Mô phỏng giá",
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
  SELECT_SEAT_TYPE: "Chọn loại ghế",
  SELECT_GRAPHICS_TYPE: "Chọn hình thức chiếu",
  SELECT_ADDITIONAL_SERVICE: "Chọn dịch vụ bổ sung",
  SIMULATE_AT: "Mô phỏng tại",
  
  // Seat Types  
  SEAT_TYPE_NORMAL: "Thường",
  SEAT_TYPE_STANDARD: "Tiêu chuẩn", 
  SEAT_TYPE_COUPLE: "Đôi",
  
  // Graphics Types
  GRAPHICS_TYPE_2D: "2D",
  GRAPHICS_TYPE_3D: "3D", 
  GRAPHICS_TYPE_IMAX: "IMAX",
  
  // Day Types
  DAY_TYPE_WEEKDAY: "Ngày thường",
  DAY_TYPE_WEEKEND: "Cuối tuần",
  DAY_TYPE_HOLIDAY: "Ngày lễ",
  
  // Screening Time Types
  SELECT_SCREENING_TIME_TYPE: "Chọn loại suất chiếu",
  SCREENING_TIME_MORNING: "Buổi sáng",
  SCREENING_TIME_AFTERNOON: "Buổi chiều", 
  SCREENING_TIME_EVENING: "Buổi tối",
  SCREENING_TIME_NIGHT: "Buổi đêm",
  SCREENING_TIME_EARLY: "Suất sớm",
  SCREENING_TIME_REGULAR: "Suất thường",
  
  // Auditorium Types
  AUDITORIUM_TYPE_STANDARD: "Tiêu chuẩn",
  AUDITORIUM_TYPE_VIP: "VIP",
  AUDITORIUM_TYPE_IMAX: "IMAX", 
  AUDITORIUM_TYPE_4DX: "4DX",
  AUDITORIUM_TYPE_GOLDCLASS: "Gold Class",
  
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
  SEAT_TYPE_TOOLTIP: "Chọn loại ghế mà giá này áp dụng. Để trống để áp dụng cho tất cả loại ghế",
  GRAPHICS_TYPE_TOOLTIP: "Chọn định dạng phim mà giá này áp dụng (2D, 3D, v.v.). Để trống để áp dụng cho tất cả định dạng",
  SCREENING_TIME_TYPE_TOOLTIP: "Chọn khung thời gian mà giá này áp dụng (sáng, chiều, tối). Để trống để áp dụng cho tất cả khung giờ",
  DAY_TYPE_TOOLTIP: "Chọn loại ngày mà giá này áp dụng (ngày thường, cuối tuần, lễ). Để trống để áp dụng cho tất cả ngày",
  AUDITORIUM_TYPE_TOOLTIP: "Chọn loại phòng chiếu mà giá này áp dụng (tiêu chuẩn, IMAX, v.v.). Để trống để áp dụng cho tất cả loại phòng",
  MIN_QUANTITY_TOOLTIP: "Số lượng tối thiểu cần thiết để áp dụng giá này. Để trống nếu không có yêu cầu tối thiểu",
  SIMULATE_AT_TOOLTIP: "Đặt ngày và giờ để mô phỏng giá nhằm kiểm tra cách thức hoạt động của quy tắc tính giá tại các thời điểm khác nhau",
  
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
  CLONE_CONFIRM_TITLE: "Nhân bản bảng giá",
  CLONE_CONFIRM_CONTENT: "Bạn có chắc chắn muốn nhân bản '{{name}}'? Việc này sẽ tạo một bản sao của bảng giá và tất cả các mục giá bên trong.",
  CLONE_SUCCESS: "Nhân bản bảng giá thành công!",
  CLONE_ERROR: "Nhân bản bảng giá thất bại!",
  CAN_ACTIVATE_LATER: "có thể kích hoạt sau",
  OK_TEXT: "Xóa",
  CANCEL_TEXT: "Hủy",

  TARGET: "Đối tượng",
  TARGET_REQUIRED: "Đối tượng không được để trống!",

  //Tab
  ALL_PRICE_ITEMS: "Tất cả mục giá",
  TICKET_PRICES: "Giá vé",
  PRODUCT_PRICES: "Giá sản phẩm",
  ADDITIONAL_SERVICE_PRICES: "Giá dịch vụ bổ sung",
};

export default priceManagement;