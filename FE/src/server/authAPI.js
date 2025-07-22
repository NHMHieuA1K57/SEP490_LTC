// Gửi OTP về email để đăng ký
export async function requestOtpRegister(email) {
  try {
    const res = await fetch("http://localhost:9999/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Lỗi requestOtpRegister:", err);
    return { success: false, message: "Lỗi gửi OTP" };
  }
}

// Xác thực OTP và tạo tài khoản
export async function registerWithOtp(email, otp, name = "") {
  try {
    const res = await fetch("http://localhost:9999/api/auth/register-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, name }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Lỗi registerWithOtp:", err);
    return { success: false, message: "Lỗi xác thực OTP" };
  }
}

// Gửi OTP về email để đăng nhập
export async function requestOtpLogin(email) {
  try {
    const res = await fetch(
      "http://localhost:9999/api/auth/request-otp-login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }
    );
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Lỗi requestOtpLogin:", err);
    return { success: false, message: "Lỗi gửi OTP đăng nhập" };
  }
}

// Xác thực OTP để đăng nhập
export async function loginWithOtp(email, otp) {
  try {
    const res = await fetch("http://localhost:9999/api/auth/login-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Lỗi loginWithOtp:", err);
    return { success: false, message: "Lỗi xác thực OTP đăng nhập" };
  }
}
