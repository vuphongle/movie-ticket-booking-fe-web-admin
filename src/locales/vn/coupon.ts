const coupon = {
  // Page titles and navigation
  COUPON_LIST_TITLE: "Danh sách khuyến mại",
  COUPON_LIST_BREADCRUMB: "Danh sách khuyến mại",
  COUPON_DETAIL_TITLE: "Chi tiết khuyến mại",

  // Buttons
  COUPON_CREATE_BTN: "Tạo khuyến mại",
  COUPON_UPDATE_BTN: "Cập nhật",
  COUPON_SAVE_BTN: "Lưu",
  COUPON_DELETE_BTN: "Xóa",
  COUPON_REFRESH_BTN: "Refresh",
  COUPON_CANCEL_BTN: "Hủy",
  ADD_COUPON_DETAIL: "Thêm quy tắc",
  BACK_TO_LIST: "Quay lại danh sách",

  // Modal titles
  COUPON_CREATE_MODAL_TITLE: "Tạo khuyến mại",
  COUPON_UPDATE_MODAL_TITLE: "Cập nhật khuyến mại",
  CREATE_COUPON_DETAIL: "Tạo quy tắc khuyến mại",
  EDIT_COUPON_DETAIL: "Sửa quy tắc khuyến mại",
  COUPON_DETAIL_LIST_TITLE: "Danh sách chi tiết khuyến mại",
  ADD_COUPON_DETAIL_BTN: "Thêm chi tiết",

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
  COUPON_CODE_PLACEHOLDER: "Nhập mã khuyến mại",
  COUPON_NAME_PLACEHOLDER: "Nhập tên khuyến mại",
  COUPON_DESCRIPTION_PLACEHOLDER: "Nhập mô tả khuyến mại...",
  COUPON_DISCOUNT_PLACEHOLDER: "Nhập phần trăm giảm giá",
  COUPON_MAX_DISCOUNT_PLACEHOLDER:
    "Nhập số tiền giảm tối đa (để trống nếu không giới hạn)",
  COUPON_QUANTITY_PLACEHOLDER: "Nhập số lượng",
  COUPON_STATUS_PLACEHOLDER: "Chọn trạng thái",
  SELECT_DATE: "Chọn ngày",
  SELECT_START_DATE: "Chọn ngày bắt đầu",
  SELECT_END_DATE: "Chọn ngày kết thúc",

  // Table columns
  COUPON_TABLE_CODE: "Mã khuyến mại",
  COUPON_TABLE_DISCOUNT: "Phần trăm giảm giá",
  COUPON_TABLE_MAX_DISCOUNT: "Giảm tối đa",
  COUPON_TABLE_QUANTITY: "Số lượng",
  COUPON_TABLE_USED: "Đã sử dụng",
  COUPON_TABLE_STATUS: "Trạng thái",
  COUPON_TABLE_VALIDITY_PERIOD: "Thời gian áp dụng",
  COUPON_TABLE_ACTIONS: "Thao tác",

  // Status options
  COUPON_STATUS_ACTIVE: "Kích hoạt",
  COUPON_STATUS_INACTIVE: "Ẩn",
  COUPON_STATUS_UPCOMING: "Sắp có hiệu lực",
  COUPON_STATUS_EXPIRED: "Hết hạn",

  // Common texts
  COUPON_UNLIMITED: "Không giới hạn",
  COUPON_CODE_EXTRA: "Mã duy nhất để xác định khuyến mại",
  COUPON_NAME_EXTRA: "Tên hiển thị cho khách hàng",
  COUPON_DESCRIPTION_EXTRA: "Mô tả chi tiết về ưu đãi (tùy chọn)",
  COUPON_STATUS_EXTRA_EDIT: "Chế độ hiển thị của coupon",
  COUPON_STATUS_EXTRA_CREATE: "Coupon mới tạo sẽ ở trạng thái ẩn",
  COUPON_STATUS_ACTIVE_EXTRA: "Hiển thị và có thể sử dụng",
  COUPON_STATUS_INACTIVE_EXTRA: "Không hiển thị cho khách hàng",

  // Alert messages
  NEXT_STEP: "Bước tiếp theo",
  NEXT_STEP_EDIT_DESC:
    "Sau khi cập nhật, bạn có thể quản lý thông tin chi tiết khuyến mại.",
  NEXT_STEP_CREATE_DESC:
    "Coupon mới tạo sẽ ở trạng thái ẩn. Sau khi tạo, bạn cần thêm điều kiện chi tiết trước khi có thể kích hoạt khuyến mại.",
  NOTE: "Lưu ý",
  NOTE_CREATE_DESC:
    "Coupon mới tạo luôn có trạng thái ẩn để đảm bảo an toàn. Bạn cần thêm ít nhất một điều kiện chi tiết trước khi có thể kích hoạt.",

  // Validation messages
  COUPON_CODE_REQUIRED: "Mã khuyến mại không được để trống!",
  COUPON_CODE_MIN_LENGTH: "Mã khuyến mại phải có ít nhất 3 ký tự!",
  COUPON_CODE_MAX_LENGTH: "Mã khuyến mại không được quá 50 ký tự!",
  COUPON_CODE_PATTERN: "Mã chỉ chứa chữ hoa, số, dấu gạch dưới và gạch ngang!",
  COUPON_NAME_REQUIRED: "Tên khuyến mại không được để trống!",
  COUPON_NAME_MIN_LENGTH: "Tên khuyến mại phải có ít nhất 3 ký tự!",
  COUPON_NAME_MAX_LENGTH: "Tên khuyến mại không được quá 200 ký tự!",
  COUPON_DESCRIPTION_MAX_LENGTH: "Mô tả không được quá 1000 ký tự!",
  COUPON_DISCOUNT_REQUIRED: "Phần trăm giảm giá không được để trống!",
  COUPON_DISCOUNT_RANGE_ERROR: "Phần trăm phải nằm trong khoảng 0 - 100",
  COUPON_MAX_DISCOUNT_MIN_ERROR: "Giảm tối đa phải lớn hơn 0",
  COUPON_QUANTITY_REQUIRED: "Số lượng không được để trống!",
  COUPON_QUANTITY_MIN_ERROR: "Số lượng phải lớn hơn 0",
  COUPON_STATUS_REQUIRED: "Trạng thái không được để trống!",
  COUPON_START_DATE_REQUIRED: "Ngày bắt đầu không được để trống!",
  COUPON_END_DATE_REQUIRED: "Ngày kết thúc không được để trống!",
  COUPON_END_DATE_AFTER_START: "Ngày kết thúc phải sau ngày bắt đầu!",

  // Success messages
  COUPON_CREATE_SUCCESS: "Tạo khuyến mại thành công!",
  COUPON_UPDATE_SUCCESS: "Cập nhật khuyến mại thành công!",
  COUPON_DELETE_SUCCESS: "Xóa khuyến mại thành công!",
  CREATE_COUPON_DETAIL_SUCCESS: "Tạo quy tắc khuyến mại thành công!",
  UPDATE_COUPON_DETAIL_SUCCESS: "Cập nhật quy tắc khuyến mại thành công!",

  // Confirmation messages
  COUPON_DELETE_CONFIRM_TITLE: "Bạn có chắc chắn muốn xóa khuyến mại này?",
  COUPON_DELETE_CONFIRM_CONTENT: "Hành động này không thể hoàn tác!",

  // Error messages
  COUPON_CREATE_ERROR: "Tạo khuyến mại thất bại",
  COUPON_UPDATE_ERROR: "Cập nhật khuyến mại thất bại",
  COUPON_DELETE_ERROR: "Không thể xóa coupon",
  COUPON_FETCH_ERROR: "Không thể tải dữ liệu coupon",

  // Success messages for coupon detail
  COUPON_DETAIL_DISABLE_SUCCESS: "Đã tắt khuyến mại detail thành công",
  COUPON_DETAIL_ENABLE_SUCCESS: "Đã bật khuyến mại detail thành công",
  COUPON_DETAIL_DELETE_SUCCESS: "Xóa chi tiết khuyến mại thành công",
  COUPON_DETAIL_UPDATE_SUCCESS: "Cập nhật chi tiết coupon thành công!",
  COUPON_DETAIL_CREATE_SUCCESS: "Tạo chi tiết coupon thành công!",

  // Error messages for coupon detail
  COUPON_DETAIL_ERROR: "Có lỗi xảy ra",

  // Validation messages for coupon detail
  COUPON_DETAIL_START_DATE_REQUIRED: "Vui lòng chọn ngày bắt đầu!",
  COUPON_DETAIL_END_DATE_REQUIRED: "Vui lòng chọn ngày kết thúc!",
  COUPON_DETAIL_START_DATE_AFTER_PARENT_START:
    "Ngày bắt đầu không thể trước ngày bắt đầu của coupon cha",
  COUPON_DETAIL_START_DATE_BEFORE_PARENT_END:
    "Ngày bắt đầu không thể sau ngày kết thúc của coupon cha",
  COUPON_DETAIL_END_DATE_AFTER_PARENT_START:
    "Ngày kết thúc không thể trước ngày bắt đầu của coupon cha",
  COUPON_DETAIL_END_DATE_BEFORE_PARENT_END:
    "Ngày kết thúc không thể sau ngày kết thúc của coupon cha",

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
  COUPON_DETAIL_GIFT_QUANTITY_LABEL: "Số lượng tặng",
  COUPON_DETAIL_LINE_MAX_DISCOUNT_LABEL: "Giảm tối đa mỗi dòng",
  COUPON_DETAIL_MIN_QUANTITY_LABEL: "Số lượng tối thiểu",
  COUPON_DETAIL_LIMIT_QUANTITY_LABEL: "Giới hạn số lượng áp dụng",
  COUPON_DETAIL_MIN_ORDER_TOTAL_LABEL: "Giá trị đơn hàng tối thiểu",
  COUPON_DETAIL_USAGE_LIMIT_LABEL: "Giới hạn sử dụng",
  COUPON_DETAIL_SELECTION_STRATEGY_LABEL: "Chiến lược chọn",
  COUPON_DETAIL_NOTES_LABEL: "Ghi chú",
  COUPON_DETAIL_START_DATE_LABEL: "Ngày bắt đầu",
  COUPON_DETAIL_END_DATE_LABEL: "Ngày kết thúc",

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

  // Target display texts
  TARGET_FULL_ORDER: "Toàn đơn hàng",
  TARGET_ALL_SEAT_TYPES: "Tất cả loại ghế",
  TARGET_ALL_SERVICES: "Tất cả dịch vụ",
  TARGET_SERVICE_PREFIX: "Dịch vụ",

  // Benefit display texts
  BENEFIT_DISCOUNT_TEXT: "Giảm",
  BENEFIT_MAX_TEXT: "tối đa",
  BENEFIT_GIFT_TEXT: "Tặng",
  BENEFIT_PRODUCT_TEXT: "sản phẩm",

  // Pagination
  PAGINATION_TOTAL: "của",
  PAGINATION_ITEMS: "mục",

  // Input placeholders
  NOT_REQUIRED_FOR_ORDER: "Không cần thiết cho đơn hàng",

  // Date validation messages
  START_DATE_BEFORE_END_DATE:
    "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc!",
  END_DATE_AFTER_START_DATE: "Ngày kết thúc phải sau hoặc bằng ngày bắt đầu!",

  // Status update error
  STATUS_UPDATE_ERROR: "Lỗi khi cập nhật trạng thái",
  DELETE_DETAIL_ERROR: "Lỗi khi xóa chi tiết khuyến mại",
};

export default coupon;
