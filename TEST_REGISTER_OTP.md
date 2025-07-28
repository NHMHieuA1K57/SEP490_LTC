# Test Register OTP - Debug Guide

## Vấn đề: "Dữ liệu không hợp lệ"

### Nguyên nhân có thể:

1. **Validation Error**: Name field validation quá strict
2. **Missing Parameters**: Thiếu tham số name
3. **OTP Format**: OTP không đúng format (6 chữ số)
4. **Email Format**: Email không hợp lệ

### Debug Steps:

#### 1. Kiểm tra Console Logs (Frontend):

```javascript
// Mở Developer Tools (F12) và xem Console
// Tìm các log:
-"Calling registerWithOtp with: ..." -
  "Request body: ..." -
  "Response status: ..." -
  "registerWithOtp response: ...";
```

#### 2. Kiểm tra Server Logs (Backend):

```bash
# Tìm các log:
- "Validation errors: ..."
- "Request body: ..."
- "registerWithOtp called with: ..."
```

#### 3. Test Cases:

##### Test Case 1: OTP đúng format

- Email: test@example.com
- OTP: 123456 (6 chữ số)
- Name: "" (empty)

##### Test Case 2: Test Mode

- Sử dụng OTP: 123456
- Bypass API call

##### Test Case 3: OTP sai format

- Email: test@example.com
- OTP: 12345 (5 chữ số)
- Expected: Validation error

### Các sửa đổi đã thực hiện:

1. **Frontend**: Thêm name parameter khi gọi registerWithOtp
2. **Backend**: Cải thiện name validation
3. **Logging**: Thêm detailed logging
4. **Error Handling**: Cải thiện error messages

### Test Instructions:

1. **Mở Developer Tools** (F12)
2. **Vào Console tab**
3. **Thực hiện đăng ký** với email mới
4. **Nhập OTP** (123456 cho test mode)
5. **Kiểm tra logs** để xem lỗi cụ thể

### Expected Results:

#### Success Case:

```javascript
// Console logs:
"Calling registerWithOtp with: {email: 'test@example.com', otp: '123456', name: ''}";
"Request body: {email: 'test@example.com', otp: '123456', name: ''}";
"Response status: 201";
"registerWithOtp response: {success: true, ...}";
```

#### Error Case:

```javascript
// Console logs:
"Validation errors: [...]";
"Request body: {...}";
// Response: {success: false, message: "Dữ liệu không hợp lệ", errors: [...]}
```
