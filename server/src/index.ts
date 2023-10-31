import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { errorMiddleware } from "./middlewares/error-middleware";
import { router } from "./router";
import { EmailService } from "./services/email-service";
import { RecordService } from "./services/record-service";
import { sequelize } from "./utils/database";

const app = express();
const port = process.env.PORT || 5000;

app.use(compression());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../", "public")));

app.use("/api", router);

app.use(errorMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    app.listen(port, async () => {
      console.log(`App listening on port ${port}`);
      RecordService.processRecordNotifications();
      //new TelegramService();
      new EmailService();
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

start();
