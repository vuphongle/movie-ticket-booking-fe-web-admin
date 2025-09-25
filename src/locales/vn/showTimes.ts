const showtimes = {
  CINEMA: "Rạp chiếu",
  AUDITORIUM: "Phòng chiếu",
  SHOW_DATE: "Ngày chiếu",
  SHOW_DATE_REQUIRED: "Ngày chiếu không được để trống!",
  SELECT_CINEMA: "Chọn rạp chiếu",
  SELECT_AUDITORIUM: "Chọn phòng chiếu",
  ALL_AUDITORIUMS: "Tất cả phòng chiếu",

  SUBTITLING: "Phụ đề",
  DUBBING: "Lồng tiếng",
  GRAPHICS_2D: "2D",
  GRAPHICS_3D: "3D",
  MOVIE_SCREENING: "Phim chiếu",
  GRAPHICS_TYPE: "Hình thức chiếu",
  TRANSLATION_TYPE: "Hình thức dịch",
  SHOW_TIME: "Thời gian chiếu",
  SHOW_TYPE: "Loại suất chiếu",
  STATUS: "Trạng thái",
  UPCOMING: "Sắp chiếu",
  NOW_SHOWING: "Đang chiếu",
  ALREADY_SHOWN: "Đã chiếu",
  PREMIERE: "Chiếu sớm",
  SCHEDULED: "Theo lịch",
  CREATE_SHOWTIME_SUCCESS: "Tạo lịch chiếu thành công!",

  // Thông báo
  FEATURE_UNDER_DEVELOPMENT:
    "Tính năng đang trong quá trình phát triển!. Vui lòng thử lại sau.",
  ADD_SHOWTIME: "Thêm suất chiếu",
  ADD_SCREENINGS: "Thêm suất chiếu",
  MOVIE_SCREENING_REQUIRED: "Phim chiếu không được để trống!",
  SELECT_MOVIE: "Chọn phim",
  SELECT_GRAPHICS_TYPE: "Chọn hình thức chiếu",
  TRANSLATION_TYPE_REQUIRED: "Hình thức dịch không được để trống!",
  SELECT_TRANSLATION_TYPE: "Chọn hình thức dịch",
  SHOW_TIME_REQUIRED: "Thời gian chiếu không được để trống!",
  CREATE_SHOWTIME: "Tạo suất chiếu",
  START_TIME: "Thời gian bắt đầu",
  END_TIME: "Thời gian kết thúc",
  GRAPHICS_TYPE_REQUIRED: "Hình thức chiếu không được để trống!",
  SELECT_SHOW_DATE: "Chọn ngày",
  ALL_CINEMAS: "Tất cả rạp chiếu",

  // Slot system translations
  SHOW_TIME_SLOT: "Ca chiếu",
  SELECT_SLOT: "Chọn ca chiếu",
  SLOT_REQUIRED: "Vui lòng chọn ca chiếu",
  SLOT_1: "Ca 1 (08:00 - 10:30)",
  SLOT_2: "Ca 2 (10:30 - 13:00)",
  SLOT_3: "Ca 3 (13:00 - 15:30)",
  SLOT_4: "Ca 4 (15:30 - 18:00)",
  SLOT_5: "Ca 5 (18:00 - 20:30)",
  SLOT_6: "Ca 6 (20:30 - 23:00)",
  MULTIPLE_SLOTS_REQUIRED: "Phim này cần {count} ca liên tiếp",
  PREVIEW_TIME: "Thời gian dự kiến: {startTime} - {endTime}",
  SPANS_BADGE: "Chiếm {count} ca",
  SPANS_BADGE_PREFIX: "Chiếm",
  SPANS_BADGE_SUFFIX: "ca",

  // Error messages for slot system
  SLOT_CONFLICT_ERROR: "Xung đột lịch chiếu! Ca này đã được sử dụng.",
  INVALID_SLOT_ERROR: "Ca chiếu không hợp lệ. Vui lòng chọn ca khác.",
  SPAN_OVERFLOW_ERROR: "Suất chiếu vượt quá khung giờ cuối ngày.",
  MOVIE_TOO_LONG_ERROR: "Phim quá dài, vượt quá khả năng của hệ thống ca.",
  BAD_INPUT_ERROR: "Dữ liệu đầu vào không hợp lệ.",

  // Enhanced slot descriptions
  SLOT_DESCRIPTION_SINGLE: "Ca {slot}",
  SLOT_DESCRIPTION_MULTIPLE: "Ca {startSlot} đến {endSlot}",
  ACTUAL_SHOW_TIME: "Thời gian chiếu thực tế: {startTime} - {endTime}",
  ACTUAL_SHOW_TIME_PREFIX: "Thời gian chiếu thực tế",
  SLOT_OCCUPANCY_WARNING:
    "Phim này sẽ chiếm {count} ca liên tiếp (để tránh xung đột lịch chiếu)",
  SLOT_OCCUPANCY_WARNING_PREFIX: "Phim này sẽ chiếm",
  SLOT_OCCUPANCY_WARNING_SUFFIX: "ca liên tiếp (để tránh xung đột lịch chiếu)",

  // Bulk creation
  BULK_CREATE_SHOWTIME: "Tạo Nhiều Suất Chiếu",
  DATE_FROM: "Từ Ngày",
  DATE_TO: "Đến Ngày",
  DATE_FROM_REQUIRED: "Từ ngày không được để trống!",
  DATE_TO_REQUIRED: "Đến ngày không được để trống!",
  DAYS_OF_WEEK: "Ngày Trong Tuần",
  SELECT_DAYS_OF_WEEK: "Chọn ngày trong tuần",
  SELECT_ALL_DAYS: "Tất Cả",
  SELECT_WEEKDAYS: "Ngày Thường (T2-T6)",
  SELECT_WEEKENDS: "Cuối Tuần (T7-CN)",
  QUICK_SELECT: "Chọn Nhanh:",
  MONDAY: "Thứ Hai",
  TUESDAY: "Thứ Ba",
  WEDNESDAY: "Thứ Tư",
  THURSDAY: "Thứ Năm",
  FRIDAY: "Thứ Sáu",
  SATURDAY: "Thứ Bảy",
  SUNDAY: "Chủ Nhật",
  CONFLICT_POLICY: "Chính Sách Xung Đột",
  CONFLICT_POLICY_FAIL: "Dừng khi có xung đột",
  CONFLICT_POLICY_SKIP: "Bỏ qua ngày xung đột",
  CREATE_BULK_SHOWTIMES: "Tạo Nhiều Suất Chiếu",
  BULK_CREATION_MODE: "Chế Độ Tạo Hàng Loạt",
  SINGLE_DATE_MODE: "Chế Độ Một Ngày",
  CREATION_MODE: "Chế Độ Tạo",

  // Conflict handling
  CONFLICT_DETECTED_TITLE: "Phát Hiện Xung Đột Lịch Chiếu",
  CONFLICT_DETECTED_MESSAGE: "Các ngày sau có xung đột lịch chiếu:",
  SKIP_CONFLICTS_BUTTON: "Bỏ qua xung đột và tạo các ngày còn lại",
  CANCEL_CREATION_BUTTON: "Hủy bỏ",
  BULK_CREATION_SUCCESS:
    "Đã tạo thành công {{created}} trên {{total}} suất chiếu",
  BULK_CREATION_PARTIAL:
    "Đã tạo {{created}} suất chiếu, bỏ qua {{skipped}} do xung đột",
  BULK_CREATION_FAILED:
    "Không thể tạo suất chiếu nào. Vui lòng kiểm tra lại lịch chiếu.",

  // Validation messages
  DATE_RANGE_TOO_LARGE: "Khoảng ngày không được vượt quá 90 ngày",
  DATE_FROM_AFTER_DATE_TO: "Từ ngày không thể sau đến ngày",
  NO_DAYS_SELECTED: "Vui lòng chọn ít nhất một ngày trong tuần",

  // Additional conflict modal translations
  TOTAL_REQUESTED: "Tổng Yêu Cầu",
  CONFLICTS: "Xung Đột",
  CAN_CREATE: "Có Thể Tạo",
  CONFLICT: "Xung Đột",
  CONFLICTED_WITH: "Xung đột với",
  WILL_CREATE_SHOWTIMES: "Sẽ tạo {{count}} suất chiếu hợp lệ",
  NO_VALID_DATES_REMAINING: "Không còn ngày hợp lệ để tạo suất chiếu",
};

export default showtimes;
