# Test Hotel API - Debug Guide

## Vấn đề: API gọi all hotel bị lỗi

### Nguyên nhân đã sửa:

1. **Missing Route**: Route `/api/hotel/all` không tồn tại
2. **Missing Controller**: Function `getAllHotels` không có trong controller
3. **Missing Service**: Function `getAllHotelsService` không có trong service

### Các sửa đổi đã thực hiện:

#### 1. **Backend Routes (BE/routes/hotelRoutes.js):**

```javascript
// Thêm route mới
router.get("/all", hotelController.getAllHotels);
```

#### 2. **Backend Controller (BE/controllers/hotelController.js):**

```javascript
// Thêm controller function
const getAllHotels = async (req, res) => {
  try {
    const response = await hotelService.getAllHotelsService();
    return res.status(200).json(response);
  } catch (error) {
    console.error("Lỗi khi lấy tất cả khách sạn:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
```

#### 3. **Backend Service (BE/services/hotelService.js):**

```javascript
// Thêm service function
const getAllHotelsService = async () => {
  try {
    const hotels = await hotelRepository.getAllHotels();
    const formattedHotels = hotels.map((hotel) => ({
      _id: hotel._id,
      name: hotel.name,
      address: hotel.address,
      images: hotel.images || [],
      rating: hotel.rating || 0,
      reviewCount: hotel.reviewCount || 0,
      rooms: hotel.rooms || [],
      amenities: hotel.amenities || [],
    }));
    return {
      success: true,
      message: "Lấy danh sách khách sạn thành công",
      data: formattedHotels,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy danh sách khách sạn");
  }
};
```

#### 4. **Backend Repository (BE/repositories/hotelRepository.js):**

```javascript
// Cải thiện getAllHotels function
getAllHotels: async () =>
  await Hotel.find({ status: 'active' })
    .populate({ path: 'rooms', select: 'price roomType maxPeople' })
    .select('name images address rating reviewCount amenities status')
    .lean(),
```

#### 5. **Frontend API (FE/src/server/hotelAPI.js):**

```javascript
// Cải thiện error handling
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
      throw new Error(data.message || "Lỗi khi fetch khách sạn");
    }
  } catch (err) {
    console.error("Lỗi fetchAllHotels:", err);
    return [];
  }
}
```

### Test Instructions:

#### 1. **Test Backend API:**

```bash
# Test API endpoint
curl http://localhost:9999/api/hotel/all
```

#### 2. **Test Frontend:**

1. Mở Developer Tools (F12)
2. Vào Console tab
3. Kiểm tra logs:
   - "Fetching all hotels..."
   - "Hotels response: ..."

#### 3. **Expected Results:**

##### Success Case:

```javascript
// Console logs:
"Fetching all hotels...";
"Hotels response: {success: true, message: 'Lấy danh sách khách sạn thành công', data: [...]}";
```

##### Error Case:

```javascript
// Console logs:
"Fetching all hotels...";
"HTTP Error: 404 Not Found";
// hoặc
"API Error: Lỗi khi lấy danh sách khách sạn";
```

### Debug Steps:

1. **Kiểm tra Backend Server:**

   - Đảm bảo server đang chạy
   - Kiểm tra server logs

2. **Kiểm tra Database:**

   - Đảm bảo có dữ liệu hotel trong database
   - Kiểm tra status của hotels

3. **Kiểm tra Network:**

   - Mở Network tab trong Developer Tools
   - Kiểm tra request/response

4. **Kiểm tra Console:**
   - Xem error messages
   - Kiểm tra API response format
