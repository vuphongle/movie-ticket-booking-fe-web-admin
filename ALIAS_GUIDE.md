# Alias Configuration Guide

Dự án này đã được cấu hình để sử dụng path aliases để import các module một cách dễ dàng và rõ ràng.

## Các Alias Đã Cấu Hình

| Alias         | Đường dẫn thực tế | Mô tả                        |
| ------------- | ----------------- | ---------------------------- |
| `@`           | `src/`            | Root của source code         |
| `@components` | `src/components/` | Các React components         |
| `@pages`      | `src/pages/`      | Các trang của ứng dụng       |
| `@utils`      | `src/utils/`      | Các utility functions        |
| `@hooks`      | `src/hooks/`      | Các custom React hooks       |
| `@app`        | `src/app/`        | Redux store và các services  |
| `@assets`     | `src/assets/`     | Hình ảnh, icon, static files |
| `@contexts`   | `src/contexts/`   | React contexts               |
| `@types`      | `src/types/`      | TypeScript type definitions  |
| `@lib`        | `src/lib/`        | Thư viện và cấu hình         |
| `@locales`    | `src/locales/`    | Internationalization files   |
| `@data`       | `src/data/`       | Static data và configuration |

## Cách Sử Dụng

### Thay vì sử dụng relative imports:

```typescript
import { Store } from "../../app/Store";
import { logout } from "../../app/slices/auth.slice";
import { getMenuData } from "../../data/routes";
```

### Sử dụng alias imports:

```typescript
import { Store } from "@app/Store";
import { logout } from "@app/slices/auth.slice";
import { getMenuData } from "@data/routes";
```

## Ví Dụ Import

### Components

```typescript
import AppLayoutHeader from "@components/layout/AppLayoutHeader";
import Loading from "@components/loading/Loading";
```

### Types

```typescript
import type { User, AuthState } from "@/types";
// hoặc
import type { User } from "@/types/auth.types";
```

### Utils

```typescript
import { setDataToLocalStorage } from "@utils/localStorageUtils";
```

### Assets

```typescript
import { flags, logo } from "@assets/index";
```

### App (Redux/Services)

```typescript
import { Store } from "@app/Store";
import { authService } from "@app/services/auth.service";
import { logout } from "@app/slices/auth.slice";
```

## Lợi Ích

1. **Dễ đọc**: Imports rõ ràng hơn, không cần đếm `../`
2. **Dễ refactor**: Không cần update relative paths khi move files
3. **Auto-complete tốt hơn**: IDE hiểu rõ cấu trúc dự án
4. **Consistency**: Tất cả imports đều theo một pattern nhất quán

## Cấu Hình

Alias đã được cấu hình trong:

- `vite.config.ts`: Cho Vite bundler
- `tsconfig.json`: Cho TypeScript compiler

## Test Alias

Chạy lệnh sau để test alias hoạt động:

```bash
npm run build
npx tsc --noEmit
```

Cả hai lệnh đều thành công nghĩa là alias đã hoạt động đúng.
