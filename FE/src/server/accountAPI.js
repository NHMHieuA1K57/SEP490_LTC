// Gọi API cập nhật thông tin user (ví dụ: tên, địa chỉ, ...)
export async function updateProfile({
  name,
  phone,
  address,
  dateOfBirth,
  avatar,
}) {
  const token = localStorage.getItem("accessToken");
  const form = new FormData();
  if (name) form.append("name", name);
  if (phone) form.append("phone", phone);
  if (address) form.append("address", address);
  if (dateOfBirth) form.append("dateOfBirth", dateOfBirth);
  if (avatar) form.append("avatar", avatar);
  const res = await fetch("http://localhost:9999/api/auth/update-profile", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: form,
  });
  return await res.json();
}
