// Lấy danh sách tất cả khách sạn từ backend
export async function fetchAllHotels() {
  try {
    console.log("Fetching all hotels...");
    const res = await fetch("http://localhost:9999/api/hotel/all");

    if (!res.ok) {
      console.error("HTTP Error:", res.status, res.statusText);
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Hotels response:", data);

    if (data.success) {
      return data.data || [];
    } else {
      console.error("API Error:", data.message);
      throw new Error(data.message || "Lỗi khi fetch khách sạn");
    }
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

// Lấy chi tiết 1 khách sạn theo ID và tất cả phòng của khách sạn đó
