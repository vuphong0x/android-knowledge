# Kotlin

## val và const val
### val
- Là read-only variable (immutable reference)
- Giá trị được xác định tại runtime

### const val
- Là compile-time constant
- Giá trị được xác định lúc compile
- Ex:
```
const val BASE_URL = "https://api.example.com"
```
- Khi compile không còn biến BASE_URL, chỉ còn string literal

## Collections
### 1. List: 
- Là tập hợp có thứ tự (ordered)
- Cho phép trùng lặp (duplicate)
- Truy cập phần tử bằng index (O(1))
- ArrayList (nhanh khi get/set, chậm khi add/remove), LinkedList (ngược lại)
#### 1.1. Khi nào dùng?
- Hiển thị UI: RecyclerView, LazyColumn
- API trả về danh sách dữ liệu (posts, users…)
- Data pagination (Paging 3)

### 2. Set:
- Là tập hợp không có thứ tự (unordered)
- Không cho phép trùng lặp (duplicate)
- Truy cập phần tử bằng giá trị (O(1))
- HashSet (nhanh nhất), LinkedHashSet (giữ thứ tự insert), TreeSet (tự sort)
#### 2.1. Khi nào dùng?
- Loại bỏ duplicate data (IDs, tags)
- Kiểm tra tồn tại nhanh (contains O(1))
### 3. Map:
- Lưu trữ dưới dạng key-value
- Key là unique
- HashMap, LinkedHashMap (giữ thứ tự), TreeMap (sort theo key)
#### 3.1. Khi nào dùng?
- Cache dữ liệu theo ID
- Mapping response → UI model
- Lưu state nhanh

## Coroutines


## 2. Khi nào dùng
- Viết app Android mới
- Thay thế dần Java trong project cũ

## 3. Điểm quan trọng
- Null safety
- Extension functions
- Coroutines support

## 5. Tại sao chúng ta cần inline function? Khi nào thì một hàm inline lại gây hại cho hiệu năng (code bloat)? Phân biệt noinline và crossinline trong trường hợp thực tế.
