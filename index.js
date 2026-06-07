const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const { createServer } = require("http")
const { Server } = require("socket.io")
const Order = require("./model/Order")
const Menu = require("./model/Menu.js")

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: { origin: "*" }
})

app.use(cors({
  origin: "*"
}))
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Kết nối MongoDB thành công!"))
  .catch((err) => console.log("Lỗi kết nối:", err))

// Socket.io
io.on("connection", (socket) => {
  console.log("Client kết nối:", socket.id)
})

app.get("/", (req, res) => {
  res.json({ message: "Server đang chạy!" })
})

app.get("/api/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 })
  res.json(orders)
})

app.post("/api/orders", async (req, res) => {
  const { tableId, items } = req.body
  const newOrder = await Order.create({ tableId, items })

  // báo cho kitchen biết có order mới
  io.emit("new_order", newOrder)

  res.json({ message: "Đặt món thành công!", order: newOrder })
})

app.put("/api/orders/:id", async (req, res) => {
  const { id } = req.params
  const { status } = req.body
  const order = await Order.findByIdAndUpdate(id, { status }, { new: true })

  // báo cho kitchen biết order được cập nhật
  io.emit("order_updated", order)

  res.json(order)
})

app.post("/api/login", (req, res) => {
  const { username, password } = req.body
  if (username === "admin" && password === "123456") {
    res.json({ success: true, role: "kitchen" })
  } else {
    res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" })
  }
})

app.get("/api/menus", async (req, res) => {
  const menus = await Menu.find()
  res.json(menus)
})
// Thêm món
app.post("/api/menus", async (req, res) => {
  const { name, price, category, image } = req.body
  const newMenu = await Menu.create({ name, price, category, image })
  res.json(newMenu)
})

// Sửa món
app.put("/api/menus/:id", async (req, res) => {
  const { id } = req.params
  const menu = await Menu.findByIdAndUpdate(id, req.body, { new: true })
  res.json(menu)
})

// Xóa món
app.delete("/api/menus/:id", async (req, res) => {
  const { id } = req.params
  await Menu.findByIdAndDelete(id)
  res.json({ message: "Xóa thành công!" })
})
// upload image
const { upload } = require("./cloudinary")

app.post("/api/upload", upload.single("image"), (req, res) => {
  try {
    console.log("File:", JSON.stringify(req.file))
    res.json({ url: req.file.path })
  } catch (err) {
    console.log("Lỗi upload:", err.message)
    res.status(500).json({ message: err.message })
  }
})
// api doanh thu
app.get("/api/revenue", async (req, res) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // orders hôm nay
  const todayOrders = await Order.find({
    status: "done",
    createdAt: { $gte: today }
  })

  // orders tuần này
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - 7)
  const weekOrders = await Order.find({
    status: "done",
    createdAt: { $gte: weekStart }
  })

  // orders tháng này
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)
  const monthOrders = await Order.find({
    status: "done",
    createdAt: { $gte: monthStart }
  })

  const calcTotal = (orders) => orders.reduce((sum, order) =>
    sum + order.items.reduce((s, item) => s + item.price * item.qty, 0), 0)

  res.json({
    today: { total: calcTotal(todayOrders), count: todayOrders.length },
    week: { total: calcTotal(weekOrders), count: weekOrders.length },
    month: { total: calcTotal(monthOrders), count: monthOrders.length },
    recentOrders: todayOrders.slice(0, 10)
  })
})
// đổi app.listen thành httpServer.listen
httpServer.listen(3000, () => {
  console.log("Server chạy ở port 3000")
})