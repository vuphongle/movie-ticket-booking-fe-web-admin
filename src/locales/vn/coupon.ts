const coupon = {
  // Page titles and navigation
  COUPON_LIST_TITLE: "Danh sách khuyến mại",
  COUPON_LIST_BREADCRUMB: "Danh sách khuyến mại",
  COUPON_DETAIL_TITLE: "Chi tiết khuyến mại",

  // Buttons
  COUPON_CREATE_BTN: "Tạo khuyến mại",
  COUPON_UPDATE_BTN: "Cập nhật",
  COUPON_DELETE_BTN: "Xóa",
  COUPON_REFRESH_BTN: "Làm mới",
  COUPON_CANCEL_BTN: "Hủy",
  ADD_COUPON_DETAIL: "Thêm quy tắc",
  BACK_TO_LIST: "Quay lại danh sách",
  EDIT_COUPON: "Chỉnh sửa khuyến mại",
  COUPON_DEACTIVATE: "Vô hiệu hóa",

  // Modal titles
  COUPON_CREATE_MODAL_TITLE: "Tạo khuyến mại",
  COUPON_UPDATE_MODAL_TITLE: "Cập nhật khuyến mại",
  CREATE_COUPON_DETAIL: "Tạo quy tắc khuyến mại",
  EDIT_COUPON_DETAIL: "Sửa quy tắc khuyến mại",
  COUPON_DETAIL_LIST_TITLE: "Danh sách chi tiết khuyến mại",
  ADD_COUPON_DETAIL_BTN: "Thêm chi tiết",
  COUPON_CREATE_ALERT_TITLE: "Khuyến mại mới tạo sẽ ở trạng thái ẩn",
  COUPON_CREATE_ALERT_DESCRIPTION:
    "Bạn cần thêm ít nhất một điều kiện chi tiết trước khi có thể kích hoạt khuyến mại.",
  COUPON_KIND_LABEL: "Loại khuyến mại",
  COUPON_KIND_VOUCHER: "Voucher",
  COUPON_NEW_INACTIVE_NOTE: "Khuyến mại mới tạo sẽ ở trạng thái ẩn.",
  COUPON_DATE_RANGE_LABEL: "Khoảng thời gian áp dụng",
  COUPON_DETAIL_TARGET_PRODUCT_LABEL: "Sản phẩm",
  COUPON_DETAIL_TARGET_SERVICE_LABEL: "Dịch vụ bổ sung",

  // Form labels
  COUPON_CODE_LABEL: "Mã khuyến mại",
  COUPON_NAME_LABEL: "Tên khuyến mại",
  COUPON_DESCRIPTION_LABEL: "Mô tả",
  COUPON_DISCOUNT_LABEL: "Phần trăm giảm giá (%)",
  COUPON_MAX_DISCOUNT_LABEL: "Giảm tối đa (VND)",
  COUPON_QUANTITY_LABEL: "Số lượng",
  COUPON_STATUS_LABEL: "Trạng thái",
  COUPON_START_DATE_LABEL: "Ngày bắt đầu",
  COUPON_END_DATE_LABEL: "Ngày kết thúc",

  // Form placeholders
  SELECT_DATE: "Chọn ngày",
  SELECT_START_DATE: "Chọn ngày bắt đầu",
  SELECT_END_DATE: "Chọn ngày kết thúc",

  // Table columns
  COUPON_TABLE_CODE: "Mã khuyến mại",
  COUPON_TABLE_STATUS: "Trạng thái",
  COUPON_TABLE_VALIDITY_PERIOD: "Thời gian áp dụng",
  COUPON_TABLE_ACTIONS: "Thao tác",
  COUPON_TABLE_NAME: "Tên khuyến mại",
  COUPON_TABLE_KIND: "Loại",
  COUPON_KIND_DISPLAY: "Hiển thị",

  // Status options
  COUPON_STATUS_ACTIVE: "Kích hoạt",
  COUPON_STATUS_INACTIVE: "Ẩn",
  COUPON_STATUS_UPCOMING: "Sắp có hiệu lực",
  COUPON_STATUS_EXPIRED: "Hết hạn",

  // Alert messages
  NOTE: "Lưu ý",
  COUPON_DEACTIVATE_CONFIRM_TITLE: "Xác nhận vô hiệu hóa",
  COUPON_DEACTIVATE_CONFIRM_MESSAGE:
    "Vô hiệu hóa coupon sẽ tắt tất cả các chi tiết liên quan. Bạn có chắc chắn muốn tiếp tục?",

  // Validation messages
  COUPON_CODE_REQUIRED: "Mã khuyến mại không được để trống!",
  COUPON_CODE_MIN_LENGTH: "Mã khuyến mại phải có ít nhất 3 ký tự!",
  COUPON_CODE_MAX_LENGTH: "Mã khuyến mại không được quá 50 ký tự!",
  COUPON_CODE_PATTERN: "Mã chỉ chứa chữ hoa, số, dấu gạch dưới và gạch ngang!",
  COUPON_NAME_REQUIRED: "Tên khuyến mại không được để trống!",
  COUPON_NAME_MAX_LENGTH: "Tên khuyến mại không được quá 200 ký tự!",
  COUPON_DESCRIPTION_MAX_LENGTH: "Mô tả không được quá 1000 ký tự!",

  // Success messages
  COUPON_CREATE_SUCCESS: "Tạo khuyến mại thành công!",
  COUPON_UPDATE_SUCCESS: "Cập nhật khuyến mại thành công!",
  COUPON_DELETE_SUCCESS: "Xóa khuyến mại thành công!",
  COUPON_DEACTIVATE_SUCCESS: "Vô hiệu hóa khuyến mại thành công!",

  // Confirmation messages
  COUPON_DELETE_CONFIRM_TITLE: "Bạn có chắc chắn muốn xóa khuyến mại này?",
  COUPON_DELETE_CONFIRM_CONTENT: "Hành động này không thể hoàn tác!",

  // Error messages
  COUPON_CREATE_ERROR: "Tạo khuyến mại thất bại",
  COUPON_UPDATE_ERROR: "Cập nhật khuyến mại thất bại",
  COUPON_DELETE_ERROR: "Không thể xóa coupon",
  COUPON_FETCH_ERROR: "Không thể tải dữ liệu coupon",

  // Success messages for coupon detail
  COUPON_DETAIL_DISABLE_SUCCESS: "Đã tắt chi tiết khuyến mại thành công",
  COUPON_DETAIL_ENABLE_SUCCESS: "Đã bật chi tiết khuyến mại thành công",
  COUPON_DETAIL_DELETE_SUCCESS: "Xóa chi tiết khuyến mại thành công",
  COUPON_DETAIL_UPDATE_SUCCESS: "Cập nhật chi tiết khuyến mại thành công!",
  COUPON_DETAIL_CREATE_SUCCESS: "Tạo chi tiết khuyến mại thành công!",

  // Error messages for coupon detail
  COUPON_DETAIL_ERROR: "Có lỗi xảy ra",

  // Placeholders for coupon detail
  SELECT_DETAIL_START_DATE: "Chọn ngày bắt đầu",
  SELECT_DETAIL_END_DATE: "Chọn ngày kết thúc",

  // Modal titles and buttons
  COUPON_DETAIL_EDIT_TITLE: "Chỉnh sửa chi tiết coupon",
  COUPON_DETAIL_ADD_TITLE: "Thêm chi tiết coupon",
  COUPON_DETAIL_UPDATE_BTN: "Cập nhật",
  COUPON_DETAIL_CREATE_BTN: "Tạo",
  COUPON_DETAIL_CANCEL_BTN: "Hủy",

  // Form labels for coupon detail
  COUPON_DETAIL_ENABLED_LABEL: "Kích hoạt",
  COUPON_DETAIL_PRIORITY_LABEL: "Ưu tiên",
  COUPON_DETAIL_TARGET_TYPE_LABEL: "Đối tượng áp dụng",
  COUPON_DETAIL_REF_ID_LABEL: "ID tham chiếu",
  COUPON_DETAIL_BENEFIT_TYPE_LABEL: "Loại lợi ích",
  COUPON_DETAIL_PERCENT_LABEL: "Phần trăm giảm",
  COUPON_DETAIL_AMOUNT_LABEL: "Số tiền giảm",
  COUPON_DETAIL_GIFT_PRODUCT_LABEL: "Sản phẩm tặng",
  COUPON_DETAIL_FREE_SERVICE_LABEL: "Dịch vụ tặng",
  COUPON_DETAIL_GIFT_QUANTITY_LABEL: "Số lượng tặng",
  COUPON_DETAIL_BENEFIT_SECTION_TITLE: "Thiết lập lợi ích",
  COUPON_DETAIL_LINE_MAX_DISCOUNT_LABEL: "Giảm tối đa mỗi dòng",
  COUPON_DETAIL_MIN_QUANTITY_LABEL: "Số lượng tối thiểu",
  COUPON_DETAIL_LIMIT_QUANTITY_LABEL: "Giới hạn số lượng áp dụng",
  COUPON_DETAIL_MIN_ORDER_TOTAL_LABEL: "Giá trị đơn hàng tối thiểu",
  COUPON_DETAIL_USAGE_LIMIT_LABEL: "Giới hạn sử dụng",
  COUPON_DETAIL_SELECTION_STRATEGY_LABEL: "Chiến lược chọn",
  COUPON_DETAIL_NOTES_LABEL: "Ghi chú",
  COUPON_DETAIL_START_DATE_LABEL: "Ngày bắt đầu",
  COUPON_DETAIL_END_DATE_LABEL: "Ngày kết thúc",
  COUPON_DETAIL_TARGET_SECTION_TITLE: "Thiết lập đối tượng",
  COUPON_DETAIL_STATUS_SECTION_TITLE: "Thiết lập trạng thái",

  // Table column headers
  COUPON_DETAIL_STATUS_COLUMN: "Trạng thái",
  COUPON_DETAIL_PRIORITY_COLUMN: "Ưu tiên",
  COUPON_DETAIL_TARGET_COLUMN: "Đối tượng áp dụng",
  COUPON_DETAIL_BENEFIT_COLUMN: "Lợi ích",
  COUPON_DETAIL_CONDITIONS_COLUMN: "Điều kiện",
  COUPON_DETAIL_USAGE_COLUMN: "Sử dụng",
  COUPON_DETAIL_STRATEGY_COLUMN: "Chiến lược",
  COUPON_DETAIL_DATE_RANGE_COLUMN: "Thời gian hiệu lực",
  COUPON_DETAIL_NOTES_COLUMN: "Ghi chú",
  COUPON_DETAIL_ACTIONS_COLUMN: "Thao tác",

  // Menu items
  COUPON_DETAIL_EDIT_MENU: "Chỉnh sửa",
  COUPON_DETAIL_DELETE_MENU: "Xóa",

  // Confirmation dialog
  COUPON_DETAIL_DELETE_CONFIRM_TITLE: "Xác nhận xóa",
  COUPON_DETAIL_DELETE_CONFIRM_CONTENT:
    "Bạn có chắc chắn muốn xóa chi tiết khuyến mại này?",
  COUPON_DETAIL_DELETE_OK: "Xóa",
  COUPON_DETAIL_DELETE_CANCEL: "Hủy",

  // Target type options
  TARGET_ORDER: "Tổng đơn hàng",
  TARGET_SEAT_TYPE: "Loại ghế cụ thể",
  TARGET_SERVICE: "Dịch vụ bổ sung",
  COUPON_TARGET_TICKET: "Vé",
  COUPON_TARGET_PRODUCT: "Sản phẩm",
  COUPON_TARGET_SERVICE: "Dịch vụ bổ sung",

  // Benefit type options
  BENEFIT_DISCOUNT_PERCENT: "Giảm theo %",
  BENEFIT_DISCOUNT_AMOUNT: "Giảm số tiền",
  BENEFIT_FREE_PRODUCT: "Tặng sản phẩm",

  // Selection strategy options
  STRATEGY_HIGHEST_PRICE_FIRST: "Giá cao nhất trước",
  STRATEGY_LOWEST_PRICE_FIRST: "Giá thấp nhất trước",
  STRATEGY_FIFO: "Theo thứ tự",

  // Placeholders and tooltips
  SELECT_TARGET_PLACEHOLDER: "Chọn đối tượng",
  SELECT_BENEFIT_TYPE_PLACEHOLDER: "Chọn loại lợi ích",
  SELECT_SEAT_TYPE_PLACEHOLDER: "Chọn loại ghế",
  SELECT_SERVICE_PLACEHOLDER: "Chọn dịch vụ bổ sung",
  SELECT_GIFT_PRODUCT_PLACEHOLDER: "Chọn sản phẩm tặng",
  COUPON_DETAIL_LIMIT_QUANTITY_PLACEHOLDER: "Để trống nếu không giới hạn",
  NOTES_PLACEHOLDER: "Nhập ghi chú...",

  // Validation messages
  PRIORITY_REQUIRED: "Vui lòng nhập độ ưu tiên!",
  TARGET_TYPE_REQUIRED: "Vui lòng chọn đối tượng!",
  BENEFIT_TYPE_REQUIRED: "Vui lòng chọn loại lợi ích!",
  PERCENT_REQUIRED: "Vui lòng nhập phần trăm!",
  PERCENT_RANGE_MESSAGE: "Phần trăm phải từ 0.01 đến 100!",
  AMOUNT_REQUIRED: "Vui lòng nhập số tiền!",
  AMOUNT_MIN_MESSAGE: "Số tiền phải lớn hơn 0!",
  GIFT_PRODUCT_REQUIRED: "Vui lòng chọn sản phẩm tặng!",
  GIFT_QUANTITY_REQUIRED: "Vui lòng nhập số lượng!",
  GIFT_QUANTITY_MIN_MESSAGE: "Số lượng phải lớn hơn 0!",
  SEAT_TYPE_REQUIRED: "Vui lòng chọn loại ghế cụ thể!",
  SERVICE_REQUIRED: "Vui lòng chọn dịch vụ bổ sung cụ thể!",

  // Tooltips
  REF_ID_TOOLTIP_ORDER: "Không cần thiết cho đơn hàng",
  REF_ID_TOOLTIP_SEAT_TYPE: "Chọn loại ghế cụ thể",
  REF_ID_TOOLTIP_SERVICE: "Chọn dịch vụ bổ sung cụ thể",
  LINE_MAX_DISCOUNT_TOOLTIP: "Số tiền giảm tối đa cho mỗi dòng sản phẩm",
  MIN_QUANTITY_TOOLTIP: "Số lượng sản phẩm tối thiểu để áp dụng",
  LIMIT_QUANTITY_TOOLTIP: "Số lượng sản phẩm tối đa được áp dụng giảm giá",
  COUPON_DETAIL_LIMIT_QUANTITY_EXTRA: "Số lượng tối đa được áp dụng (tùy chọn)",
  MIN_ORDER_TOTAL_TOOLTIP: "Tổng giá trị đơn hàng tối thiểu để áp dụng",
  USAGE_LIMIT_TOOLTIP: "Số lần tối đa chi tiết này có thể được sử dụng",
  SELECTION_STRATEGY_TOOLTIP: "Cách chọn sản phẩm khi áp dụng giảm giá",
  START_DATE_TOOLTIP: "Ngày bắt đầu hiệu lực của chi tiết coupon này",
  END_DATE_TOOLTIP: "Ngày kết thúc hiệu lực của chi tiết coupon này",

  // Condition texts
  MIN_ORDER_CONDITION: "Đơn tối thiểu",
  MIN_QUANTITY_CONDITION: "SL tối thiểu",
  LIMIT_APPLIED_CONDITION: "Giới hạn áp dụng",

  // Seat type names
  SEAT_TYPE_REGULAR: "Ghế thường",
  SEAT_TYPE_VIP: "Ghế VIP",
  SEAT_TYPE_COUPLE: "Ghế đôi",
  SEAT_TYPE_DEFAULT: "Ghế loại",

  // Usage statistics
  COUPON_DETAIL_USAGE_STATS_LABEL: "Thống kê sử dụng",
  COUPON_DETAIL_USAGE_TIMES_LABEL: "Số lần sử dụng",
  COUPON_DETAIL_USAGE_NOT_USED: "Chưa sử dụng",
  COUPON_DETAIL_USAGE_TOTAL: "Tổng số lần sử dụng",
  COUPON_DETAIL_USAGE_TIMES_SUFFIX: "lần",

  // Pagination
  PAGINATION_TOTAL: "của",
  PAGINATION_ITEMS: "mục",

  // Input placeholders
  ENTER_PERCENTAGE: "Nhập phần trăm",
  ENTER_AMOUNT: "Nhập số tiền",

  COUPON_DETAIL_ENABLED_EXTRA: "Bật hoặc tắt chi tiết khuyến mại này",
  COUPON_DETAIL_ENABLED_TOOLTIP:
    "Khi tắt, chi tiết khuyến mại này sẽ không khả dụng",
  COUPON_DETAIL_SERVICE_TYPE_LABEL: "Loại: {{type}}",
  COUPON_DETAIL_REF_ID_PLACEHOLDER_TICKET: "Không bắt buộc cho vé",
  COUPON_DETAIL_VALIDITY_LABEL: "Thời gian hiệu lực",
  COUPON_DETAIL_VALIDITY_TOOLTIP:
    "Chọn khoảng thời gian chi tiết khuyến mại có hiệu lực",
  COUPON_DETAIL_VALIDITY_REQUIRED: "Vui lòng chọn thời gian hiệu lực",
  COUPON_DETAIL_DUPLICATE_MENU: "Nhân bản",
  COUPON_DETAIL_DUPLICATE_SUCCESS: "Nhân bản chi tiết khuyến mại thành công",
  COUPON_DETAIL_DUPLICATE_ERROR: "Không thể nhân bản chi tiết khuyến mại",

  // Status update error
  STATUS_UPDATE_ERROR: "Lỗi khi cập nhật trạng thái",
  DELETE_DETAIL_ERROR: "Lỗi khi xóa chi tiết khuyến mại",
  COUPON_CODE_AUTO_UPPERCASE: "Mã khuyến mại sẽ tự động chuyển thành chữ hoa",

  COUPON_ACTIVATE_CONFIRM_TITLE: "Xác nhận kích hoạt",
  COUPON_ACTIVATE_CONFIRM_MESSAGE:
    "Kích hoạt khuyến mại sẽ bật tất cả các chi tiết liên quan. Bạn có chắc chắn muốn tiếp tục?",
  COUPON_ACTIVATE: "Kích hoạt",
  COUPON_ACTIVATE_ERROR:
    "Kích hoạt khuyến mại thất bại. Cần ít nhất một chi tiết hoạt động.",
  COUPON_ACTIVATE_SUCCESS: "Kích hoạt khuyến mại thành công!",
  COUPON_NAME_PLACEHOLDER: "Nhập tên khuyến mại",
  COUPON_DESCRIPTION_PLACEHOLDER: "Nhập mô tả",
  COUPON_CODE_PLACEHOLDER_EXAMPLE: "VD: SUMMER2024",

  // Coupon Statistics Page
  COUPON_STATISTICS_TITLE: "Thống kê hiệu suất khuyến mại",
  COUPON_STATISTICS_BREADCRUMB_REPORT: "Báo cáo",
  COUPON_STATISTICS_BREADCRUMB_TITLE: "Thống kê khuyến mại",
  COUPON_STATISTICS_DATE_FROM: "Từ ngày",
  COUPON_STATISTICS_DATE_TO: "Đến ngày",
  COUPON_STATISTICS_EXPORT_BUTTON: "Xuất báo cáo",
  COUPON_STATISTICS_EXPORT_SUCCESS: "Xuất báo cáo thành công!",
  COUPON_STATISTICS_EXPORT_ERROR: "Xuất báo cáo thất bại!",
  COUPON_STATISTICS_DETAIL_TITLE: "Chi tiết hiệu suất khuyến mại",

  // Statistics Cards
  COUPON_STATISTICS_TOTAL_COUPONS: "Tổng số khuyến mại",
  COUPON_STATISTICS_ACTIVE_COUPONS: "Đang kích hoạt",
  COUPON_STATISTICS_UPCOMING_COUPONS: "Sắp diễn ra",
  COUPON_STATISTICS_EXPIRED_COUPONS: "Đã hết hạn",
  COUPON_STATISTICS_TOTAL_REDEMPTIONS: "Tổng lượt sử dụng",
  COUPON_STATISTICS_UNIQUE_CUSTOMERS: "Khách hàng duy nhất",
  COUPON_STATISTICS_ORDERS_WITH_COUPONS: "Đơn có khuyến mại",
  COUPON_STATISTICS_TOTAL_DISCOUNT_AMOUNT: "Tổng giá trị giảm giá",
  COUPON_STATISTICS_REVENUE_BEFORE_DISCOUNT: "DT trước giảm giá",
  COUPON_STATISTICS_REVENUE_AFTER_DISCOUNT: "DT sau giảm giá",
  COUPON_STATISTICS_COUPON_USAGE_RATE: "Tỷ lệ sử dụng khuyến mại",
  COUPON_STATISTICS_ORDER_CONVERSION_RATE: "Tỷ lệ đơn hàng có KM",
  COUPON_STATISTICS_AVERAGE_DISCOUNT_PER_ORDER: "Giảm giá TB/đơn",

  // Performance Table Columns
  COUPON_STATISTICS_TABLE_STT: "STT",
  COUPON_STATISTICS_TABLE_CODE: "Mã KM",
  COUPON_STATISTICS_TABLE_NAME: "Tên khuyến mại",
  COUPON_STATISTICS_TABLE_KIND: "Loại",
  COUPON_STATISTICS_TABLE_VALIDITY: "Thời gian HĐ",
  COUPON_STATISTICS_TABLE_USAGE_COUNT: "Số lần SD",
  COUPON_STATISTICS_TABLE_UNIQUE_CUSTOMERS: "Số KH",
  COUPON_STATISTICS_TABLE_TOTAL_DISCOUNT: "Tổng giảm giá",
  COUPON_STATISTICS_TABLE_REVENUE_BEFORE: "DT trước CK",
  COUPON_STATISTICS_TABLE_REVENUE_AFTER: "DT sau CK",
  COUPON_STATISTICS_TABLE_DISCOUNT_PERCENTAGE: "Tỷ lệ giảm",
  COUPON_STATISTICS_TABLE_STATUS: "Trạng thái",
  COUPON_STATISTICS_TABLE_TOTAL: "Tổng {{total}} khuyến mại",

  // Performance Table Filter Values
  COUPON_STATISTICS_FILTER_ACTIVE: "Kích hoạt",
  COUPON_STATISTICS_FILTER_INACTIVE: "Ẩn",
  COUPON_STATISTICS_FILTER_UPCOMING: "Sắp có hiệu lực",
  COUPON_STATISTICS_FILTER_EXPIRED: "Hết hạn",
};

export default coupon;
