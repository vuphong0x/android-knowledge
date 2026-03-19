# Kotlin Coroutines
Coroutine là một concurrency design pattern để đơn giản hóa code xử lý bất đồng bộ (asynchronous).

## Mức độ Nền tảng (Foundation)

### 1. Bản chất của "Lightweight Thread" và suspend function.
**a. Lightweight Thread:**
- `Thread`: 
    - Khi tạo một Thread mới, OS cần cấp phát một vùng nhớ stack riêng (thường khoảng 1MB) và việc chuyển ngữ cảnh (Context Switching) giữa các Thread sẽ rất tốn tài nguyên
- `Coroutine`:
    - Thực chất chỉ là một Object được cấp phát trên bộ nhớ Heap của JVM. Việc chuyển ngữ cảnh giữa các coroutine chỉ đơn giản là gọi hàm trong Kotlin, không cần OS can thiệp.

**b. suspend function:** 
- Bản chất của suspend function là CPS (Continuation-Passing Style) và State Machine.
- Khi viết hàm 
    ```
    suspend fun getUser(id: String): User
    ```
    Kotlin Compiler sẽ biến nó thành (decompile ra Java):

    ```
    fun getUser(id: String, continuation: Continuation<Any?>): Any?
    ```
- Nó thêm một tham số *Continuation* vào cuối hàm. Tham số này hoạt động như một 'callback' lưu trữ toàn bộ trạng thái hiện tại và các suspend point.
- Bên trong function, Compiler sinh ra một switch-case (State Machine) với các labels. Khi coroutine bị suspend, nó lưu trạng thái vào label hiện tại và return (trả lại Thread). Khi có kết quả, hệ thống sẽ gọi lại continuation.resumeWith() và nhảy vào label tiếp theo để chạy tiếp.
- Ví dụ:
    ```
        // 1. Một interface ẩn dùng để tiếp tục luồng thực thi
        interface Continuation<T> {
            fun resumeWith(result: Result<T>)
        }

        // 2. Hàm thực tế sau khi biên dịch (Mã giả)
        fun fetchData(completion: Continuation<Any?>): Any? {
            
            // Tạo một đối tượng State Machine để lưu trữ trạng thái hiện tại
            class FetchDataStateMachine(val completion: Continuation<Any?>) : Continuation<Any?> {
                var label = 0      // Trạng thái hiện tại
                var result: Any? = null
                var user: String? = null // Lưu biến cục bộ để dùng sau khi resume

                override fun resumeWith(res: Result<Any?>) {
                    this.result = res.getOrNull()
                    fetchData(this) // Gọi lại chính hàm này để chạy bước tiếp theo
                }
            }

            // Kiểm tra xem đã có state machine chưa, nếu chưa thì tạo mới
            val sm = completion as? FetchDataStateMachine ?: FetchDataStateMachine(completion)

            when (sm.label) {
                0 -> {
                    println("Bắt đầu")
                    sm.label = 1
                    // Gọi api.getUser và truyền state machine vào
                    val res = api.getUser(sm) 
                    if (res == COROUTINE_SUSPENDED) return COROUTINE_SUSPENDED 
                    // Nếu trả về kết quả ngay (không suspend), rơi xuống case 1
                }
                1 -> {
                    val user = sm.result as String
                    println("Đã có user: $user")
                    sm.user = user // Cất vào bộ nhớ của State Machine
                    sm.label = 2
                    val res = api.getFriends(user, sm)
                    if (res == COROUTINE_SUSPENDED) return COROUTINE_SUSPENDED
                }
                2 -> {
                    val friends = sm.result
                    return "Xong"
                }
            }
            return null
        }
    ```

## 2. Quản lý Context & Threading

### Q: Phân biệt các loại Dispatchers (`Main`, `IO`, `Default`, `Unconfined`) trong Android?
* `Dispatchers.Main`: Chạy trên Main UI Thread của Android. Dùng để tương tác với UI và thực hiện các công việc nhẹ (ví dụ: update View, call UI functions).
* `Dispatchers.IO`: Tối ưu hóa cho các thao tác disk hoặc network I/O nằm ngoài main thread (ví dụ: gọi API, đọc/ghi database, xử lý file âm thanh/giọng nói). Nó sử dụng một pool of threads có thể mở rộng theo yêu cầu.
* `Dispatchers.Default`: Tối ưu hóa cho các tác vụ tính toán nặng (CPU-intensive) như sorting list lớn, parse JSON phức tạp, hoặc xử lý thuật toán. Số lượng max thread thường bằng số lượng CPU core.
* `Dispatchers.Unconfined`: Bắt đầu chạy trên thread hiện tại, nhưng sau khi bị suspend và resume, nó sẽ chạy trên thread của hàm suspending đã gọi nó. Ít được sử dụng trong thực tế Android.

### Q: `Dispatchers.IO` và `Dispatchers.Default` dùng chung một Thread Pool. Vậy làm thế nào hệ thống đảm bảo việc gọi cả ngàn request IO không làm "chết đói" (starvation) các tác vụ tính toán CPU của Default?
- Hệ thống giải quyết bài toán này thông qua bộ lập lịch **`CoroutineScheduler`** với 2 cơ chế cốt lõi:

1. **Giới hạn độc lập (Logical Quotas):** 
- `Default` luôn bị giới hạn số luồng hoạt động đồng thời bằng đúng số nhân CPU. Trong khi đó, `IO` có hạn mức trần mặc định là 64 luồng. Hàng ngàn request IO vượt quá con số 64 sẽ phải nằm trong hàng đợi chứ không thể "nuốt chửng" toàn bộ Thread Pool.
2. **Bù đắp luồng (Thread Injection):** 
- Đây là cơ chế quan trọng nhất. Khi một luồng IO bị *block* (ví dụ: đang chờ phản hồi từ Network), nó không còn tiêu thụ CPU nữa. Hệ thống sẽ lập tức phát hiện và **tạo thêm luồng mới** để thế chỗ. Điều này đảm bảo các tác vụ của `Default` luôn có đủ luồng (bằng số nhân CPU) để tiếp tục tính toán mà không bị gián đoạn.

### Q: CoroutineScope và CoroutineContext khác nhau như thế nào? Trong code hay viết `CoroutineScope(Dispatchers.IO + SupervisorJob() + CoroutineName("MyCoroutine"))`. Giải thích phép cộng `+` đang làm gì? Cấu trúc dữ liệu bên dưới CoroutineContext là gì?
***CoroutineContext:** Là một tập hợp các element định nghĩa hành vi của coroutine (bao gồm `Job`, `CoroutineDispatcher`, `CoroutineName`, `CoroutineExceptionHandler`).
***CoroutineScope:** Là một interface chứa một thuộc tính duy nhất là `coroutineContext`. Mục đích chính của nó là để quản lý vòng đời (lifecycle) của các coroutines được tạo ra bên trong nó. Trên Android, chúng ta thường dùng `viewModelScope` hoặc `lifecycleScope` để tự động hủy các tác vụ khi ViewModel hoặc UI component bị destroy, tránh memory leaks.

---

## 3. Xử lý Lỗi & Hủy bỏ (Error Handling & Cancellation)

### Q: Sự khác biệt giữa `Job` và `SupervisorJob`?
Cả hai đều được dùng để quản lý hệ thống phân cấp coroutine, nhưng khác nhau ở cách xử lý lỗi:
* **`Job` (Mặc định):** Nếu một child coroutine thất bại (throw exception), nó sẽ hủy coroutine cha, dẫn đến việc hủy TẤT CẢ các child coroutines khác trong cùng hệ thống phân cấp.
* **`SupervisorJob`:** Nếu một child coroutine thất bại, lỗi đó không lan truyền lên cha. Các child coroutines khác vẫn tiếp tục chạy bình thường. Rất hữu ích khi bạn có nhiều tác vụ độc lập chạy song song (ví dụ: tải song song nhiều file độc lập).

### Q: Làm thế nào để handle exception đúng cách trong Coroutine?
* **Try-catch:** Dùng trực tiếp bên trong coroutine body hoặc quanh một suspending function để bắt các exception cụ thể (ví dụ: `IOException` khi gọi mạng).
* **CoroutineExceptionHandler:** Bắt các "uncaught exceptions" ở cấp root của hệ thống phân cấp coroutine. Dùng như một phương án dự phòng cuối cùng để tránh app crash, thường được truyền vào `CoroutineContext`.
* **Lưu ý:** `CancellationException` là một ngoại lệ đặc biệt. Khi bị ném ra, nó báo hiệu coroutine đã bị hủy và bị lờ đi bởi `CoroutineExceptionHandler`. Không nên "nuốt" (swallow) `CancellationException` trong khối `catch (e: Exception)` chung chung.
