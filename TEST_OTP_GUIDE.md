# Hướng dẫn Test OTP Đăng ký

## Các bước test:

### 1. Test Mode (Development)

- Trong môi trường development, sử dụng OTP: **123456**
- OTP này sẽ bypass API call và trả về success ngay lập tức

### 2. Test với Backend thật

- Đảm bảo backend server đang chạy
- Kiểm tra console logs để debug

### 3. Debug Steps:

#### Frontend Debug:

1. Mở Developer Tools (F12)
2. Vào tab Console
3. Thực hiện đăng ký và nhập OTP
4. Kiểm tra các log messages:
   - "Submitting OTP: ..."
   - "OTP response: ..."
   - "AccessToken saved: ..."
   - "User saved: ..."
   - "Calling onSuccess callback"

#### Backend Debug:

1. Kiểm tra server logs
2. Tìm các messages:
   - "OTP sent for registration: ..."
   - "registerWithOtp called with: ..."
   - "OTP saved for ..."
   - "Verifying OTP for ..."
   - "OTP verification result: ..."

### 4. Các vấn đề thường gặp:

#### OTP không được gửi:

- Kiểm tra cấu hình email trong .env
- Kiểm tra EMAIL_USER và EMAIL_PASS

#### OTP không đúng:

- Kiểm tra OTP cache
- Kiểm tra thời gian hết hạn

#### Không chuyển trang:

- Kiểm tra onSuccess callback
- Kiểm tra navigate function
- Kiểm tra localStorage

### 5. Test Cases:

#### Test Case 1: Đăng ký mới

1. Nhập email mới
2. Nhận OTP
3. Nhập OTP đúng
4. Kiểm tra chuyển về trang chủ

#### Test Case 2: Email đã tồn tại

1. Nhập email đã đăng ký
2. Kiểm tra thông báo lỗi

#### Test Case 3: OTP sai

1. Nhập OTP sai
2. Kiểm tra thông báo lỗi

#### Test Case 4: OTP hết hạn

1. Đợi OTP hết hạn (10 phút)
2. Nhập OTP
3. Kiểm tra thông báo hết hạn
