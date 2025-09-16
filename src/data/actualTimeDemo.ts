/**
 * 🆕 DEMO: Thời gian thực tế vs Thời gian blocking
 * 
 * Logic mới:
 * - API gửi slot boundaries (để blocking)  
 * - UI hiển thị thời gian thực tế (runtime + 20')
 */

import { 
  calculateSlotSpans,
  getPreviewTimeRange,
  getActualTimeRange,
  slotToApiTimes,
  calculateActualEndTime
} from "@/data/showtimeSlots";

console.log("🎬 DEMO: THỜI GIAN THỰC TẾ vs BLOCKING");
console.log("=".repeat(60));

// Example: Phim 150 phút, chọn Ca 1
const movie150 = 150;
const slotId = 1;
const spans = calculateSlotSpans(movie150);

console.log(`📽️ Movie: ${movie150} phút → spans: ${spans} ca`);
console.log("");

// 1. Thời gian blocking (gửi BE để tránh conflict)
const blockingTime = getPreviewTimeRange(slotId, spans);
const apiPayload = slotToApiTimes(slotId, movie150);

console.log("🔒 BLOCKING TIME (gửi BE):");
console.log(`   Slot boundaries: ${blockingTime?.startTime} - ${blockingTime?.endTime}`);
console.log(`   API payload:`, apiPayload);
console.log(`   → DB sẽ block cả slot 1 & 2 (08:00-13:00)`);
console.log("");

// 2. Thời gian thực tế (hiển thị UI)
const actualTime = getActualTimeRange(slotId, movie150);
const actualEndFromStart = calculateActualEndTime("08:00", movie150);

console.log("👁️ ACTUAL TIME (hiển thị UI):");
console.log(`   Real runtime: ${actualTime?.startTime} - ${actualTime?.endTime}`);
console.log(`   Calculated end: 08:00 → ${actualEndFromStart}`);
console.log(`   → Admin thấy thời gian thực: 08:00-10:50`);
console.log("");

console.log("💡 BENEFIT:");
console.log("✅ DB vẫn block 2 ca (08:00-13:00) → tránh conflict");
console.log("✅ UI hiển thị thời gian thật (08:00-10:50) → admin rõ ràng");
console.log("✅ Không có phim nào chen vào slot 2 dù chỉ chiếu đến 10:50");

console.log("");
console.log("🧪 EXAMPLES:");

// Test các cases khác
const testCases = [
  { duration: 90, slot: 1, name: "Phim ngắn 90'" },
  { duration: 120, slot: 3, name: "Phim trung 120'" }, 
  { duration: 150, slot: 5, name: "Phim dài 150'" },
  { duration: 180, slot: 2, name: "Phim rất dài 180'" }
];

testCases.forEach(test => {
  const testSpans = calculateSlotSpans(test.duration);
  const testBlocking = getPreviewTimeRange(test.slot, testSpans);
  const testActual = getActualTimeRange(test.slot, test.duration);
  
  console.log(`📋 ${test.name} (slot ${test.slot}):`);
  console.log(`   Blocking: ${testBlocking?.startTime}-${testBlocking?.endTime} (${testSpans} ca)`);
  console.log(`   Display:  ${testActual?.startTime}-${testActual?.endTime} (thực tế)`);
  console.log("");
});

/**
 * 🎯 SUMMARY:
 * 
 * Before: Phim 150' → hiển thị 08:00-13:00 (slot boundary)
 * After:  Phim 150' → hiển thị 08:00-10:50 (thời gian thật)
 * 
 * DB logic không đổi: vẫn block đủ slots cần thiết
 * UI improvement: hiển thị thời gian thực tế cho admin
 */