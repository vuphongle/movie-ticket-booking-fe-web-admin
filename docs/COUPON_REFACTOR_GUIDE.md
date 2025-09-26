# Hướng dẫn Refactor hệ thống Coupon

## 📋 Tổng quan

**Mục tiêu:** Chuyển đổi từ mô hình 2 bảng sang mô hình 3 bảng để tách biệt rõ ràng giữa thông tin cơ bản và điều kiện áp dụng.

**Thời gian ước tính:** 5-7 ngày làm việc

**Branch:** `feature/refactor-coupon-to-3-tables`

## 🔄 So sánh mô hình

### Hiện tại (2 bảng)

```
coupons (header)
└── coupon_details (chứa tất cả thông tin + điều kiện)
```

### Mục tiêu (3 bảng)

```
coupons (header + thêm field 'kind')
└── coupon_details (thông tin cơ bản)
    └── coupon_detail_terms (điều kiện/tham số, quan hệ 1-1)
```

## 🚀 Kế hoạch triển khai

### Phase 1: Chuẩn bị

**Backend Dev:**

- [ ] Tạo branch mới từ `dev`

**Frontend Dev:**

- [ ] Review code hiện tại trong folder `src/pages/coupon/`

### Phase 2: Database Migration

**Backend Dev tạo 3 migration files:**

**File 1:** `V2025_01_01__add_coupon_kind_and_nullable_code.sql`

```sql
-- Thêm field 'kind' enum (DISPLAY, VOUCHER) vào bảng coupons
-- Cho phép field 'code' nullable
-- Tạo bảng coupon_detail_terms với FK là id = coupon_details.id
```

**File 2:** `V2025_01_02__migrate_data_to_terms_table.sql`

```sql
-- Di chuyển data từ coupon_details sang coupon_detail_terms:
-- percent, amount, gift_service_id, gift_quantity, limit_quantity_applied, detail_used_count
```

**File 3:** `V2025_01_03__cleanup_coupon_details.sql`

```sql
-- Xóa các cột đã migrate khỏi coupon_details
-- Thêm indexes cho performance
```

### Phase 3: Backend Refactor

#### Ngày 1: Entity và Repository

**Tạo mới:**

- [ ] `CouponKind.java` enum (DISPLAY, VOUCHER)
- [ ] `CouponDetailTerms.java` entity
- [ ] `CouponDetailTermsRepository.java`

**Cập nhật:**

- [ ] `Coupon.java`: thêm field `kind`, `code` nullable
- [ ] `CouponDetail.java`: xóa các field đã chuyển, thêm relation `terms`

#### Ngày 2: Service và Controller

**Service Layer:**

- [ ] Cập nhật `CouponService`: validate code theo kind
- [ ] Cập nhật `CouponDetailService`: xử lý terms riêng biệt
- [ ] Thêm validation: VOUCHER phải có code, DISPLAY không cần code

**DTO Updates:**

- [ ] `UpsertCouponRequest`: thêm `kind`, `code` optional
- [ ] `UpsertCouponDetailRequest`: embed terms data

**Controller:**

- [ ] Cập nhật validation logic
- [ ] Test API endpoints

### Phase 4: Frontend Refactor

#### Ngày 1: Types và Services

**File cần cập nhật:**

- [ ] `src/types/coupon.types.ts`: thêm `CouponKind` enum, cập nhật interfaces
- [ ] `src/app/services/coupons.service.ts`: handle new structure

**Thay đổi chính:**

```typescript
// Coupon interface: thêm kind, code optional
// CouponDetail: loại bỏ terms fields, thêm terms relation
// CouponDetailTerms: interface mới
```

#### Ngày 2: Components

**Components cần cập nhật:**

- [ ] `CouponForm.tsx`: thêm kind selector, conditional code input
- [ ] `CouponTable.tsx`: hiển thị kind column
- [ ] `CouponDetailForm.tsx`: tách terms section

**Logic updates:**

- Khi kind = DISPLAY: disable code input
- Khi kind = VOUCHER: require code input
- Terms form conditional theo benefitType

### Phase 5: Testing (1 ngày)

**Backend Testing:**

- [ ] Unit tests cho CouponService với new validation
- [ ] Integration tests cho API endpoints
- [ ] Database integrity tests

**Frontend Testing:**

- [ ] Component tests cho form validation
- [ ] API integration tests
- [ ] E2E testing cho coupon lifecycle

**Test Cases chính:**

- Tạo VOUCHER coupon với code
- Tạo DISPLAY coupon không cần code
- Cập nhật coupon detail với terms
- Migration data không bị mất

### Phase 6: Deployment (0.5 ngày)

**Pre-deployment:**

- [ ] Code review completed
- [ ] All tests passing
- [ ] Database backup created
- [ ] Rollback plan ready

**Deployment steps:**

1. Deploy backend với migration
2. Verify database migration success
3. Deploy frontend
4. Smoke testing trên production
5. Monitor error logs và performance

## ⚠️ Lưu ý quan trọng

### Backend

- **VOUCHER type:** Bắt buộc phải có code
- **DISPLAY type:** Code có thể null, dùng cho marketing display
- **Backward compatibility:** Existing API clients vẫn hoạt động
- **Data migration:** Không được mất data trong quá trình chuyển đổi

### Frontend

- **Form validation:** Dynamic theo coupon kind
- **Table display:** Hiển thị rõ loại coupon
- **User experience:** Intuitive cho người dùng hiểu sự khác biệt

## 🔄 Rollback Plan

**Database rollback:**

```sql
-- Restore from backup hoặc
-- Reverse migration: add columns back to coupon_details
-- Copy data from coupon_detail_terms
-- Drop coupon_detail_terms table
```

**Code rollback:**

```bash
git revert <commit-hash>
# Redeploy previous version
```

## ✅ Verification Checklist

**Database:**

- [ ] All data migrated successfully
- [ ] No referential integrity violations
- [ ] Query performance acceptable

**Backend:**

- [ ] API endpoints return correct data structure
- [ ] Validation works for both coupon kinds
- [ ] No breaking changes for existing clients

**Frontend:**

- [ ] Forms handle both coupon types correctly
- [ ] Tables display new data properly
- [ ] No JavaScript errors
