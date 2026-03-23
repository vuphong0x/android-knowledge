# OOP

---

## 1. OOP là gì?
OOP (Object-Oriented Programming) là một phương pháp lập trình dựa trên khái niệm "đối tượng" (Object), bao gồm dữ liệu (thuộc tính) và phương thức (hành động). 

---

## 2. Các thành phần cốt lõi của OOP
- **Lớp (Class) và Đối tượng (Object)**: Lớp là khuôn mẫu (ví dụ: lớp "Xe máy"), đối tượng là thực thể cụ thể dựa trên khuôn mẫu đó (ví dụ: chiếc xe máy Honda của bạn).
- **4 Tính chất cơ bản**:
    1. **Tính đóng gói (Encapsulation)**: Che giấu dữ liệu bên trong lớp và chỉ cho phép truy cập qua các phương thức công khai, giúp bảo mật dữ liệu.
    2. **Tính kế thừa (Inheritance)**: Cho phép lớp con sử dụng lại các thuộc tính và phương thức của lớp cha, giúp tiết kiệm mã nguồn.
    3. **Tính đa hình (Polymorphism)**: Một phương thức có thể được thực hiện bằng nhiều cách khác nhau ở các đối tượng khác nhau.
    4. **Tính trừu tượng (Abstraction)**: Chỉ tập trung vào các đặc điểm chính của đối tượng mà bỏ qua các chi tiết phức tạp không cần thiết. 

### 2.1 Vấn đề nếu không dùng OOP
- Code procedural dễ bị:
  - trùng lặp logic
  - khó maintain
  - khó scale

### 2.2 OOP giải quyết gì?
- Gom logic + data lại thành object
- Giảm coupling
- Tăng reusability
- Dễ test hơn

---

## 3. 4 nguyên lý cốt lõi

---

### 3.1 Encapsulation (Đóng gói)

#### 3.1.1 Bản chất
Ẩn implementation, chỉ expose API cần thiết.

#### 3.1.2 Ví dụ

```kotlin
class BankAccount(private var balance: Double) {

    fun deposit(amount: Double) {
        if (amount > 0) balance += amount
    }

    fun getBalance(): Double = balance
}