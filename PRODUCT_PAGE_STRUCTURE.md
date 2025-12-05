# Cấu trúc Trang Sản phẩm (Product Pages)

## 📄 1. TRANG DANH SÁCH SẢN PHẨM (`/san-pham`)

```
┌─────────────────────────────────────────────────────────────────┐
│                    san-pham/page.tsx                            │
│                    (Server Component)                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  <div className="mt-10">                                        │
│    ┌─────────────────────────────────────────────────────────┐ │
│    │  {page > 1 ? "Trang X" : ""}                            │ │
│    └─────────────────────────────────────────────────────────┘ │
│    ┌─────────────────────────────────────────────────────────┐ │
│    │  <h1>Sản phẩm mới nhất</h1>                              │ │
│    │  (text-2xl md:text-3xl, center, px-5)                    │ │
│    └─────────────────────────────────────────────────────────┘ │
│  </div>                                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  <React.Suspense>                                                │
│    <SearchProvider>                                             │
│      <ProductsList />                                           │
│    </SearchProvider>                                            │
│  </React.Suspense>                                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              ProductsList Component                              │
│              (Client Component)                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ SEARCH AREA   │  │ PRODUCTS GRID    │  │ PAGINATION       │
│ (if enabled)  │  │                  │  │                  │
└───────────────┘  └──────────────────┘  └──────────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Container     │  │ Container        │  │ Container        │
│ max-w-[1400px]│  │ max-w-[1400px]   │  │ max-w-[1400px]   │
│ px-5          │  │ px-5             │  │ px-5             │
│               │  │ mt-10            │  │ mt-10            │
└───────────────┘  └──────────────────┘  └──────────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ SearchInput   │  │ Grid Layout:     │  │ "Trang X trên Y" │
│               │  │ - 2 cols (mobile)│  │                  │
│               │  │ - 3 cols (md)    │  │ [← Trước]       │
│ Search Result │  │ - 4 cols (lg)    │  │ [Sau →]          │
│ (if search)   │  │ - 5 cols (xl)     │  │                  │
│               │  │                  │  │                  │
│               │  │ ProductCard[]   │  │                  │
│               │  │ (20 items/page)  │  │                  │
└───────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 📄 2. TRANG CHI TIẾT SẢN PHẨM (`/san-pham/[slug]`)

```
┌─────────────────────────────────────────────────────────────────┐
│              san-pham/[slug]/page.tsx                            │
│              (Server Component)                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  generateMetadata()                                             │
│  generateStaticParams()                                          │
│  getPublishedProductBySlug(slug)                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Product Component                             │
│                    (Server Component)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 1. BREADCRUMB                                            │  │
│  │    Container: max-w-5xl, px-5                           │  │
│  │    [Sản phẩm] > [Tên sản phẩm]                          │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 2. PRODUCT HEADER (lg:flex)                               │  │
│  │    Container: max-w-5xl, px-5                             │  │
│  │    ┌──────────────┐  ┌──────────────────────────────┐   │  │
│  │    │ LEFT: Images │  │ RIGHT: Info                   │   │  │
│  │    │              │  │                               │   │  │
│  │    │ ProductSlide │  │ - Title (h1)                  │   │  │
│  │    │ Images       │  │ - Price (red, large)          │   │  │
│  │    │ w-full       │  │ - Fake Price (strikethrough)  │   │  │
│  │    │ lg:max-w-    │  │ - Discount Badge              │   │  │
│  │    │ [28rem]      │  │ - Description                 │   │  │
│  │    │              │  │ - [Mua ngay] Button           │   │  │
│  │    │              │  │   (opens Dialog)              │   │  │
│  │    └──────────────┘  └──────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 3. PRODUCT CONTENT                                        │  │
│  │    Container: max-w-3xl, mx-auto, mb-8                   │  │
│  │    ┌──────────────────────────────────────────────────┐   │  │
│  │    │ ProductBody (white/dark card, p-5)                │   │  │
│  │    │ - Full product description/content                 │   │  │
│  │    └──────────────────────────────────────────────────┘   │  │
│  │    ┌──────────────────────────────────────────────────┐   │  │
│  │    │ Tags Section                                      │   │  │
│  │    │ "Tags:" + [Tag badges]                            │   │  │
│  │    │ (indigo-100/dark:indigo-600)                      │   │  │
│  │    └──────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 4. SHARE BUTTONS                                          │  │
│  │    ProductShareButtons                                    │  │
│  │    - Facebook, Twitter, Instagram, Pinterest              │  │
│  │    - Copy Link button                                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 5. RELATED PRODUCTS                                       │  │
│  │    RelatedProducts (10 random products)                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ 6. BACK BUTTON                                           │  │
│  │    [← Tất cả sản phẩm]                                   │  │
│  │    (mt-20, center)                                       │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎨 CHI TIẾT KHOẢNG CÁCH (Spacing)

### Trang Danh sách:
```
┌─────────────────────────────────────────┐
│ Header Section                          │
│ mt-10                                   │
│   - Text "Trang X" (nếu page > 1)      │
│   - H1 "Sản phẩm mới nhất"              │
└─────────────────────────────────────────┘
              │
              │ (khoảng cách tự động)
              ▼
┌─────────────────────────────────────────┐
│ Search Area (nếu enabled)               │
│ Container: max-w-[1400px], px-5         │
│   - SearchInput                         │
│   - Search Result Text (mt-4)           │
└─────────────────────────────────────────┘
              │
              │ mt-10
              ▼
┌─────────────────────────────────────────┐
│ Products Grid                           │
│ Container: max-w-[1400px], px-5, mt-10  │
│   - Grid: 2/3/4/5 columns               │
│   - gap-3 lg:gap-5                      │
│   - ProductCard[] (20 items)            │
└─────────────────────────────────────────┘
              │
              │ mt-10
              ▼
┌─────────────────────────────────────────┐
│ Pagination                              │
│ Container: max-w-[1400px], px-5, mt-10  │
│   - "Trang X trên Y" (mb-4)             │
│   - [← Trước] [Sau →]                   │
│   - gap-7                               │
└─────────────────────────────────────────┘
```

### Trang Chi tiết:
```
┌─────────────────────────────────────────┐
│ Breadcrumb                              │
│ Container: max-w-5xl, px-5              │
└─────────────────────────────────────────┘
              │
              │ (khoảng cách tự động)
              ▼
┌─────────────────────────────────────────┐
│ Product Header (lg:flex, gap-8)          │
│ Container: max-w-5xl, px-5               │
│   [Images] [Info]                        │
└─────────────────────────────────────────┘
              │
              │ (khoảng cách tự động)
              ▼
┌─────────────────────────────────────────┐
│ Product Content                         │
│ Container: max-w-3xl, mx-auto, mb-8     │
│   - ProductBody (gap-5)                  │
│   - Tags Section                        │
└─────────────────────────────────────────┘
              │
              │ (khoảng cách tự động)
              ▼
┌─────────────────────────────────────────┐
│ Share Buttons                           │
│ ProductShareButtons                     │
└─────────────────────────────────────────┘
              │
              │ (khoảng cách tự động)
              ▼
┌─────────────────────────────────────────┐
│ Related Products                        │
│ RelatedProducts                         │
└─────────────────────────────────────────┘
              │
              │ mt-20
              ▼
┌─────────────────────────────────────────┐
│ Back Button                            │
│ [← Tất cả sản phẩm]                     │
└─────────────────────────────────────────┘
```

---

## 📦 COMPONENTS TREE

```
san-pham/page.tsx
└── SearchProvider
    └── ProductsList
        ├── SearchProductInput (nếu enabled)
        ├── ProductCard[] (grid)
        └── Pagination Buttons

san-pham/[slug]/page.tsx
└── Product
    ├── BreadCrumb
    ├── ProductSlideImages
    ├── Dialog (Mua ngay)
    ├── ProductBody
    ├── ProductShareButtons
    ├── RelatedProducts
    └── Back Button
```

---

## 🎯 RESPONSIVE BREAKPOINTS

### Products Grid:
- Mobile: `grid-cols-2` (2 cột)
- Tablet (md): `grid-cols-3` (3 cột)
- Desktop (lg): `grid-cols-4` (4 cột)
- Large (xl): `grid-cols-5` (5 cột)

### Product Detail:
- Mobile: Stacked layout (images trên, info dưới)
- Desktop (lg): Side-by-side (`lg:flex`)

---

## 🔧 KEY FEATURES

✅ Dark mode support
✅ Share buttons (Facebook, Twitter, Instagram, Pinterest, Copy link)
✅ Search functionality
✅ Pagination
✅ Related products
✅ Breadcrumb navigation
✅ Responsive design
✅ SEO optimized (metadata, static params)











