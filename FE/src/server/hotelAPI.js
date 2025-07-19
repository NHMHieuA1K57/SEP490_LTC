// Lấy danh sách tất cả khách sạn từ backend
export async function fetchAllHotels() {
  try {
    const res = await fetch("http://localhost:9999/api/hotel/all");
    if (!res.ok) throw new Error("Lỗi khi fetch khách sạn");
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("Lỗi fetchAllHotels:", err);
    return [];
  }
}

// Lấy chi tiết 1 khách sạn theo ID
export async function fetchHotelById(hotelId) {
  try {
    const res = await fetch(`http://localhost:9999/api/hotel/${hotelId}`);
    if (!res.ok) throw new Error("Lỗi khi fetch chi tiết khách sạn");
    const data = await res.json();
    // Có thể trả về data.data hoặc data tuỳ theo backend
    return data.data || data;
  } catch (err) {
    console.error("Lỗi fetchHotelById:", err);
    return null;
  }
}
