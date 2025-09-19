const common = {
  SUCCESS: "Thành công",
  ERROR: "Lỗi",
  LOADING: "Đang tải...",
  SAVE: "Lưu",
  CANCEL: "Hủy",
  CONFIRM: "Xác nhận",
  DELETE: "Xóa",
  EDIT: "Chỉnh sửa",
  REFRESH: "Làm mới",
  CLOSE: "Đóng",
  BACK: "Quay lại",
  NEXT: "Tiếp theo",
  DONE: "Hoàn thành",
  RETRY: "Thử lại",
  LOGOUT: "Đăng xuất",
  LOGOUT_SUCCESS: "Đăng xuất thành công",
  BACK_TO_HOME: "Quay lại trang chủ",
  LANGUAGE_CHANGED: "Đổi ngôn ngữ thành công",

  PROFILE: "Hồ sơ",
  CHANGE_PASSWORD: "Đổi mật khẩu",

  USER_NOT_FOUND: "Người dùng không tồn tại.",

  // Error Page
  ERROR_PAGE_DEFAULT_SUBTITLE: "Xin lỗi, trang bạn truy cập không tồn tại.",
  ERROR_PAGE_BACK_HOME: "Quay lại trang chủ",
  FORBIDDEN: "Truy cập bị cấm",

  SEARCH: "Tìm kiếm",
  SELECT_DATE: "Chọn ngày",
  SELECT_PRODUCT: "Chọn sản phẩm",
  LOADING_PRODUCTS: "Đang tải sản phẩm...",
  ERROR_LOADING_PRODUCTS: "Lỗi tải danh sách sản phẩm",
  NO_PRODUCTS_AVAILABLE: "Không có sản phẩm nào",
  NO_MATCHING_PRODUCTS: "Không tìm thấy sản phẩm phù hợp",
  
  // Image upload messages
  IMAGE_COMPRESSED: "Ảnh đã được nén từ {{originalSize}} xuống {{newSize}}",
  UPLOAD_FAILED: "Tải lên thất bại",
  UPLOAD_SUCCESS: "Tải lên thành công",
  CHOOSE_IMAGE: "Chọn hình ảnh",
  UPLOAD_IMAGE: "Tải lên hình ảnh",
  SELECT_IMAGE: "Chọn hình ảnh",
  DELETE_IMAGE: "Xóa hình ảnh", 
  DELETE_IMAGE_SUCCESS: "Xóa hình ảnh thành công",
  CHANGE_THUMBNAIL: "Thay đổi ảnh đại diện",
  SELECT_THUMBNAIL: "Chọn ảnh đại diện",

  // Product management
  PRODUCT_LIST: "Danh sách sản phẩm",
  UPDATE_PRODUCT: "Cập nhật sản phẩm",
  DELETE_PRODUCT: "Xóa sản phẩm",
  PRODUCT_DETAIL: "Chi tiết sản phẩm",
  PRODUCT_INFORMATION: "Thông tin sản phẩm",
  EDIT_PRODUCT: "Chỉnh sửa sản phẩm",
  PRODUCT_NOT_FOUND: "Không tìm thấy sản phẩm",
  
  // Product fields
  PRODUCT_SKU: "Mã SKU",
  PRODUCT_NAME: "Tên sản phẩm",
  DESCRIPTION: "Mô tả",
  UNIT: "Đơn vị",
  QUANTITY: "Số lượng",
  THUMBNAIL: "Ảnh đại diện",
  STATUS: "Trạng thái",
  ACTIVE: "Hoạt động",
  INACTIVE: "Không hoạt động",
  CREATED_AT: "Ngày tạo",
  UPDATED_AT: "Ngày cập nhật",
  ACTIONS: "Thao tác",
  
  // Units
  PIECE: "Cái",
  BOX: "Hộp", 
  BOTTLE: "Chai",
  CAN: "Lon",
  PACK: "Gói",
  CUP: "Cốc",
  BAG: "Túi",
  SET: "Bộ",
  
  // Form placeholders and messages
  ENTER_SKU: "Nhập mã SKU",
  ENTER_PRODUCT_NAME: "Nhập tên sản phẩm",
  ENTER_DESCRIPTION: "Nhập mô tả",
  ENTER_QUANTITY: "Nhập số lượng",
  ENTER_THUMBNAIL_URL: "Nhập URL ảnh đại diện",
  SELECT_UNIT: "Chọn đơn vị",
  SELECT_STATUS: "Chọn trạng thái",
  
  // Validation messages
  SKU_REQUIRED: "Mã SKU là bắt buộc",
  PRODUCT_NAME_REQUIRED: "Tên sản phẩm là bắt buộc",
  STATUS_REQUIRED: "Trạng thái là bắt buộc",
  QUANTITY_MIN_ERROR: "Số lượng phải lớn hơn hoặc bằng 0",
  SKU_ALREADY_EXISTS: "Mã SKU đã tồn tại",
  CANNOT_DEACTIVATE_PRODUCT: "Không thể vô hiệu hóa sản phẩm",
  PRODUCT_IN_USE_MESSAGE: "Sản phẩm này hiện đang được sử dụng trong các chương trình khuyến mãi hoặc dịch vụ bổ sung đang hoạt động. Vui lòng vô hiệu hóa những phần đó trước khi thay đổi trạng thái của sản phẩm này.",
  
  // Success/Error messages
  CREATE_SUCCESS: "Tạo thành công",
  CREATE_FAILED: "Tạo thất bại",
  UPDATE_SUCCESS: "Cập nhật thành công", 
  UPDATE_FAILED: "Cập nhật thất bại",
  DELETE_SUCCESS: "Xóa thành công",
  DELETE_FAILED: "Xóa thất bại",
  
  // Confirmations
  DELETE_PRODUCT_CONFIRM: "Bạn có chắc chắn muốn xóa sản phẩm này?",
  ACTION_CANNOT_UNDONE: "Hành động này không thể hoàn tác",
  
  // Actions
  VIEW_DETAIL: "Xem chi tiết",
  UPDATE: "Cập nhật",

  // Status Values
  DRAFT: "Bản nháp",
  PUBLIC: "Công khai",
};

export default common;
