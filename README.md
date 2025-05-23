# ⏰ Todo App Pro

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

Một ứng dụng quản lý công việc hiện đại với giao diện đẹp mắt và nhiều tính năng thông minh. Được xây dựng bằng React, Vite và TailwindCSS.

## ✨ Tính năng nổi bật

- 🎯 **Quản lý task thông minh**
  - Phân loại theo danh mục (Cá nhân, Công việc, Mua sắm, Sức khỏe, Học tập)
  - Đặt độ ưu tiên (Cao, Trung bình, Thấp)
  - Thời hạn và nhắc nhở tự động
  - Tìm kiếm và lọc task linh hoạt

- 📊 **Thống kê trực quan**
  - Dashboard hiển thị tổng quan
  - Thống kê theo danh mục
  - Theo dõi tiến độ hoàn thành
  - Danh sách task hôm nay và sắp tới

- 🔔 **Hệ thống nhắc nhở**
  - Nhắc nhở tự động theo thời gian
  - Thông báo trực quan
  - Tùy chỉnh thời gian nhắc nhở
  - Gia hạn task nhanh chóng

- 🌓 **Giao diện hiện đại**
  - Thiết kế responsive
  - Chế độ tối/sáng
  - Hiệu ứng mượt mà
  - Tương thích đa thiết bị

- 💾 **Quản lý dữ liệu**
  - Lưu trữ local
  - Xuất/nhập dữ liệu
  - Sao lưu tự động
  - Khôi phục dữ liệu

## 🚀 Bắt đầu

### Yêu cầu hệ thống

- Node.js 16.0.0 trở lên
- npm hoặc yarn

### Cài đặt

1. Clone repository:
```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app
```

2. Cài đặt dependencies:
```bash
npm install
# hoặc
yarn install
```

3. Chạy ứng dụng ở môi trường development:
```bash
npm run dev
# hoặc
yarn dev
```

4. Build cho production:
```bash
npm run build
# hoặc
yarn build
```

## 🛠️ Công nghệ sử dụng

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **Date Handling**: Native JavaScript Date API
- **Storage**: LocalStorage

## 📁 Cấu trúc dự án

```
todo-app/
├── src/
│   ├── components/
│   │   ├── todo/          # Components liên quan đến todo
│   │   └── ui/            # UI components tái sử dụng
│   ├── contexts/          # React contexts
│   ├── hooks/             # Custom hooks
│   ├── utils/             # Utility functions
│   ├── constants/         # Constants và configurations
│   └── App.jsx           # Root component
├── public/               # Static files
└── package.json         # Dependencies và scripts
```

## 🎨 Tùy chỉnh

### Thêm danh mục mới

1. Mở file `src/constants/index.js`
2. Thêm danh mục mới vào `CATEGORIES`
3. Thêm label tương ứng vào `CATEGORY_LABELS`
4. Thêm màu sắc vào `CATEGORY_COLORS`

### Tùy chỉnh thời gian nhắc nhở

1. Mở file `src/constants/index.js`
2. Chỉnh sửa mảng `REMINDER_OPTIONS`

## 🤝 Đóng góp

Mọi đóng góp đều được hoan nghênh! Hãy tạo một issue hoặc pull request để đóng góp.

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Dự án này được cấp phép theo MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 👏 Tác giả

- **Bùi Quốc Huy** - *Initial work* - [GitHub](https://github.com/anhhuy112233/todo-app)

## 🙏 Cảm ơn

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [Heroicons](https://heroicons.com/) 