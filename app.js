/* =====================================================
   ECOSHOP APP.JS
   File dùng chung cho TẤT CẢ các trang (index, product,
   cart, auth, admin). Mọi trang phải nhúng file này
   TRƯỚC các script riêng của trang:
   <script src="app.js"></script>
===================================================== */

/* ======================
   DỮ LIỆU MẪU (chỉ tạo 1 LẦN DUY NHẤT nếu chưa có)
====================== */
const DEFAULT_PRODUCTS = [
  { id: 1, name: "Rau cải xanh", category: "Rau", price: 15000, oldPrice: 18000, stock: 50, cert: "VietGAP", code: "ECO001", rating: 4.8, image: "https://picsum.photos/seed/eco1/600/500", desc: "Rau cải xanh sạch đạt chuẩn VietGAP, thu hoạch trong ngày, không tồn dư thuốc bảo vệ thực vật." },
  { id: 2, name: "Cam sành Hà Giang", category: "Trái cây", price: 35000, oldPrice: 42000, stock: 30, cert: "Organic", code: "ECO002", rating: 4.9, image: "https://picsum.photos/seed/eco2/600/500", desc: "Cam sành hữu cơ trồng trên vùng núi đá, mọng nước, giàu vitamin C." },
  { id: 3, name: "Trứng gà ta", category: "Thực phẩm", price: 45000, oldPrice: 50000, stock: 100, cert: "HACCP", code: "ECO003", rating: 5, image: "https://picsum.photos/seed/eco3/600/500", desc: "Trứng gà thả vườn, giàu dinh dưỡng, kiểm soát an toàn theo tiêu chuẩn HACCP." },
  { id: 4, name: "Táo hữu cơ", category: "Trái cây", price: 89000, oldPrice: 98000, stock: 35, cert: "Organic", code: "ECO004", rating: 4.7, image: "https://picsum.photos/seed/eco4/600/500", desc: "Táo hữu cơ nhập khẩu, giòn ngọt, giàu chất xơ và vitamin." },
  { id: 5, name: "Cà chua bi", category: "Rau", price: 28000, oldPrice: 32000, stock: 45, cert: "VietGAP", code: "ECO005", rating: 4.6, image: "https://picsum.photos/seed/eco5/600/500", desc: "Cà chua bi tươi, vị ngọt tự nhiên, thu hoạch trong ngày." },
  { id: 6, name: "Thịt heo sạch", category: "Thịt", price: 120000, oldPrice: 135000, stock: 20, cert: "HACCP", code: "ECO006", rating: 4.8, image: "https://picsum.photos/seed/eco6/600/500", desc: "Thịt heo nuôi theo quy trình an toàn sinh học, kiểm soát HACCP toàn chuỗi." },
  { id: 7, name: "Xà lách hữu cơ", category: "Rau", price: 22000, oldPrice: 25000, stock: 40, cert: "Organic", code: "ECO007", rating: 4.5, image: "https://picsum.photos/seed/eco7/600/500", desc: "Xà lách trồng thủy canh trong nhà màng, lá xanh giòn, thích hợp ăn sống." },
  { id: 8, name: "Tôm sú tươi", category: "Hải sản", price: 220000, oldPrice: 245000, stock: 18, cert: "Organic", code: "ECO008", rating: 4.9, image: "https://picsum.photos/seed/eco8/600/500", desc: "Tôm sú nuôi quảng canh hữu cơ tại Cà Mau, tươi sống trong ngày." },
];

/* ======================
   KHỞI TẠO DỮ LIỆU (chạy 1 lần khi localStorage trống)
====================== */
function initApp() {
  if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(DEFAULT_PRODUCTS));
  }
  // Chỉ có DUY NHẤT một nơi seed tài khoản admin (tránh xung đột mật khẩu
  // giữa các trang như bản cũ: auth.html seed "123456" còn app.js seed "123").
  //
  // TỰ PHỤC HỒI: nếu dữ liệu "users" cũ (từ phiên bản trước) bị hỏng, rỗng,
  // hoặc thiếu hẳn tài khoản admin, tự động thêm lại tài khoản admin mặc định
  // mà KHÔNG xóa các tài khoản khách hàng đã đăng ký.
  let users = [];
  try { users = JSON.parse(localStorage.getItem("users")) || []; } catch (e) { users = []; }
  if (!Array.isArray(users)) users = [];
  if (!users.some(u => u && u.role === "admin")) {
    users.push({ name: "Administrator", email: "admin@ecoshop.com", pass: "123456", role: "admin" });
  }
  localStorage.setItem("users", JSON.stringify(users));
  if (!localStorage.getItem("cart")) localStorage.setItem("cart", JSON.stringify([]));
  if (!localStorage.getItem("favorites")) localStorage.setItem("favorites", JSON.stringify([]));
  if (!localStorage.getItem("reviews")) localStorage.setItem("reviews", JSON.stringify([]));
  if (!localStorage.getItem("orders")) localStorage.setItem("orders", JSON.stringify([]));
}

/* ======================
   ĐỌC / GHI LOCALSTORAGE (có try/catch để không bao giờ crash trang)
====================== */
function getData(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch (e) { return []; }
}
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/* ======================
   TIỆN ÍCH DÙNG CHUNG
====================== */
function formatMoney(price) {
  return Number(price || 0).toLocaleString("vi-VN") + "đ";
}
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("currentUser")); }
  catch (e) { return null; }
}
function logout() {
  if (confirm("Bạn muốn đăng xuất?")) {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberEmail");
    location.href = "auth.html";
  }
}

/* Xóa sạch toàn bộ dữ liệu EcoShop đã lưu trong trình duyệt (sản phẩm,
   tài khoản, giỏ hàng, đơn hàng...) rồi tạo lại dữ liệu mẫu từ đầu.
   Dùng khi dữ liệu cũ từ phiên bản trước bị lỗi/không đăng nhập được. */
function resetAllData() {
  ["products", "users", "cart", "favorites", "reviews", "orders", "currentUser", "rememberEmail"]
    .forEach(key => localStorage.removeItem(key));
  initApp();
}

/* Chỉ chặn trang admin.html — KHÔNG chặn cart.html (khách vẫn xem giỏ
   hàng được, chỉ khi bấm "Thanh toán" mới cần đăng nhập). Bản cũ chặn cả
   cart.html khiến người dùng chưa đăng nhập không xem được giỏ hàng. */
function protectAdminRoute() {
  const user = getCurrentUser();
  const page = location.pathname.toLowerCase();
  if (page.includes("admin.html")) {
    if (!user || user.role !== "admin") {
      alert("Bạn cần đăng nhập bằng tài khoản quản trị viên để truy cập trang này.");
      location.href = "auth.html";
    }
  }
}

function nextProductId() {
  const products = getData("products");
  return products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
}
function findProduct(id) {
  return getData("products").find(p => p.id === Number(id));
}

/* ======================
   GIỎ HÀNG
====================== */
function addToCart(id, qty = 1) {
  const product = findProduct(id);
  if (!product) return false;
  const cart = getData("cart");
  const item = cart.find(p => p.id === product.id);
  if (item) {
    item.quantity += qty;
  } else {
    cart.push({ id: product.id, name: product.name, image: product.image, price: product.price, quantity: qty });
  }
  saveData("cart", cart);
  updateCartBadge();
  return true;
}
function cartCount() {
  return getData("cart").reduce((sum, item) => sum + item.quantity, 0);
}
function updateCartBadge() {
  const badge = document.getElementById("cart-count");
  if (badge) badge.textContent = cartCount();
}

/* ======================
   TÌM KIẾM / LỌC SẢN PHẨM
====================== */
function filterProducts(keyword = "", category = "") {
  const products = getData("products");
  const key = keyword.toLowerCase();
  return products.filter(p => {
    const matchName = p.name.toLowerCase().includes(key);
    const matchCategory = category === "" || category === "Tất cả" || p.category === category;
    return matchName && matchCategory;
  });
}

/* ======================
   KHỞI TẠO KHI FILE ĐƯỢC NẠP
====================== */
initApp();
document.addEventListener("DOMContentLoaded", () => {
  protectAdminRoute();
  updateCartBadge();
});

/* ======================
   EXPORT RA WINDOW ĐỂ CÁC TRANG DÙNG
====================== */
window.getData = getData;
window.saveData = saveData;
window.formatMoney = formatMoney;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.addToCart = addToCart;
window.cartCount = cartCount;
window.updateCartBadge = updateCartBadge;
window.filterProducts = filterProducts;
window.findProduct = findProduct;
window.nextProductId = nextProductId;
window.resetAllData = resetAllData;