const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/categoryRoute");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./config/dbConnect");
const PORT = process.env.PORT || 4000;
const morgan = require("morgan");

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", authRoute);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
