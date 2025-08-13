export const updateProfile = async (payload) => {
  try {
    const token = localStorage.getItem("accessToken"); // Lấy token từ localStorage
    const res = await fetch("http://localhost:9999/api/auth/update-profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Gửi kèm token
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data; // { success: true, data: {...} }
  } catch (error) {
    console.error("Lỗi updateProfile:", error);
    return { success: false, error: error.message };
  }
};

// Lấy profile người dùng đang đăng nhập
export async function fetchProfile() {
  const token = localStorage.getItem("accessToken");
  const res = await fetch("http://localhost:9999/api/auth/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await res.json();
}
