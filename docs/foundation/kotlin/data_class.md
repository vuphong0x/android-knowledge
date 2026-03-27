# Data Class
Data class là một lớp được thiết kế để chứa dữ liệu. Compiler sẽ tự động sinh ra các phương thức như *`equals()`*, *`hashCode()`*, *`toString()`*, *`copy()`*, *`componentN()`*. Điều này giúp giảm lượng boilerplate code khi mục đích chính của nó là để lưu trữ và quản lý dữ liệu.

## Key Concepts

### 1. Data Class phải đáp ứng các điều kiện sau:
- Primary constructor phải có ít nhất một tham số.
- Tất cả các tham số của primary constructor phải được đánh dấu là val hoặc var.
- Data class không thể là abstract, open, sealed, hoặc inner.
=> Vì những điều kiện này mà data class không thể thay thế cho class thông thường.