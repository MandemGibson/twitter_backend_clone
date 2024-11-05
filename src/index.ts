import express from "express";
import userRoutes from "./routes/userRoutes";
import tweetRoutes from "./routes/tweetRoutes";

const app = express();
app.use(express.json());
app.use(express.static("src/public"));

app.use("/user", userRoutes);
app.use("/tweet", tweetRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});