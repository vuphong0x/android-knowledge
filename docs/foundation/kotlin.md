# Kotlin

## 1. Tổng quan
Kotlin là ngôn ngữ chính thức để phát triển Android hiện đại.

## 2. Khi nào dùng
- Viết app Android mới
- Thay thế dần Java trong project cũ

## 3. Điểm quan trọng
- Null safety
- Extension functions
- Coroutines support

## 4. Ví dụ
```kotlin
fun main() {
    val name: String = "Android"
    println("Hello $name")
}

## 5. Best practices
- Ưu tiên val hơn var
- Tránh class quá lớn
- Dùng sealed class khi biểu diễn state