# Nagare Travel — Frontend

Frontend cho hệ thống quản trị lữ hành Nagare, xây bằng Next.js 15 (App Router) +
TypeScript, theo đúng bản thiết kế `khung-he-thong-nagare-v1.1.html` (tham khảo
tại `D:\Dự án của Anh Thư\Document\khung-he-thong-nagare-v1.1.html`) và các quyết
định đã chốt trong `CLAUDE.md` cùng thư mục.

Một web app duy nhất:
- Khách vào thẳng domain gốc để xem/đặt tour (route group `(public)`).
- Nội bộ 7 chức danh vào `/admin` — một dashboard chung, menu ẩn/hiện theo quyền
  (route group `(admin)`), không dựng 7 trang riêng.

## Chạy dự án

```bash
npm install
cp .env.local.example .env.local   # rồi chỉnh NEXT_PUBLIC_API_URL nếu cần
npm run dev
```

Mở http://localhost:3000 — middleware sẽ tự chuyển hướng sang `/vi` (mặc định)
hoặc `/ja`.

```bash
npm run build   # kiểm tra build production (đã xác nhận pass, xem báo cáo bàn giao)
npm run lint
```

## Biến môi trường

| Biến | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Base URL của backend Spring Boot (Render khi lên production) |

## Cấu trúc thư mục

```
src/
  app/
    [locale]/                 # segment locale bắt buộc: /vi hoặc /ja (next-intl)
      layout.tsx               # root layout: NextIntlClientProvider, QueryProvider, AuthProvider
      (public)/                 # route group công khai — có SiteHeader/SiteFooter
        page.tsx                 # trang chủ
        tours/page.tsx            # danh mục tour (Server Component, revalidate 600)
        tours/[slug]/page.tsx      # chi tiết tour + <DepartureList /> (Client, no-cache)
        login/ register/ change-password/
        booking/[departureId]/page.tsx   # luồng giữ chỗ tour ghép (multi-step)
        tour-requests/new/page.tsx        # yêu cầu tour riêng, không cần đăng nhập
        my-bookings/page.tsx               # đơn của khách
      (admin)/admin/             # route group nội bộ — sidebar lọc theo quyền
        layout.tsx, page.tsx (dashboard), tours/, departures/, bookings/,
        customers/, tour-requests/, assignments/, tour-logs/, visa-cases/,
        employees/, attendance/, leave-requests/, reports/
  components/
    ui/            # shadcn/ui
    layout/        # SiteHeader, SiteFooter, LocaleSwitcher
    admin/         # AdminSidebar, AdminHeader, DataTable (TanStack Table)
    public/        # TourCard, DepartureList
    providers/     # AuthProvider (access token in memory), QueryProvider (TanStack Query)
  hooks/           # useTours, useBookings, useDepartures, use-admin-data.ts, ...
  lib/
    api-client.ts   # fetch wrapper: in-memory access token, 401 -> /api/auth/refresh -> retry once
    public-api.ts   # server-side fetch helpers for /api/public/* (revalidate: 600)
    permissions.ts  # client-side mirror of muc 04 permission matrix (UX only)
    format.ts, utils.ts
  types/index.ts   # TypeScript types mirroring the MongoDB schema (muc 05) & API contract (muc 07)
  i18n/            # next-intl routing/navigation/request config
  middleware.ts    # locale routing + UX-only /admin session-hint gate
messages/
  vi.json, ja.json  # next-intl message catalogs
```

## Ghi chú kiến trúc quan trọng

- **Access token nằm trong bộ nhớ (biến module trong `api-client.ts`), KHÔNG
  bao giờ ghi vào `localStorage`.** Refresh token là cookie `httpOnly` do
  backend set trên cùng tên miền gốc; frontend không tự đọc/ghi cookie đó, chỉ
  gọi `POST /api/auth/refresh` (kèm `credentials: "include"`) khi gặp 401, rồi
  retry lại request gốc đúng một lần.
- **Middleware chỉ là UX gate**, không phải bảo mật thật: nó kiểm tra một
  cookie không nhạy cảm (`nagare_session`) để tránh nháy giao diện `/admin`
  cho khách chưa đăng nhập. Toàn bộ kiểm quyền thật nằm ở backend
  (`@PreAuthorize` + lọc theo phạm vi ngay trong câu truy vấn Mongo).
- **Ẩn nút trong menu (`src/lib/permissions.ts`) không phải là bảo mật** — đây
  chỉ là bản sao phía client của ma trận phân quyền ở mục 04 thiết kế, dùng để
  dựng menu. Mọi request vẫn phải qua kiểm tra thật ở backend.
- **Trang tour công khai** dùng Server Components + `fetch(..., { next: {
  revalidate: 600 } })`. Riêng số chỗ còn lại (`<DepartureList />`) luôn là
  Client Component gọi API tươi (`staleTime: 0`), có loading state và cảnh báo
  "Hệ thống đang khởi động..." nếu quá 3 giây (Render free tier có thể đang ngủ).
- **Song ngữ** dùng `next-intl` với segment `/vi` và `/ja` bắt buộc trong URL
  (`localePrefix: "always"`).
- **Form** dùng `react-hook-form` + `zod`; danh sách hành khách động trong
  luồng giữ chỗ dùng `useFieldArray`.
- Types trong `src/types/index.ts` bám theo đúng schema MongoDB (mục 05) và API
  contract (mục 07) của thiết kế để khi backend (`D:\Dự án của Anh
  Thư\BE`) sẵn sàng thì khớp ngay, hạn chế phải sửa lại.

## Thiết kế tham khảo

- `D:\Dự án của Anh Thư\Document\khung-he-thong-nagare-v1.1.html`
- `D:\Dự án của Anh Thư\Document\CLAUDE.md`
