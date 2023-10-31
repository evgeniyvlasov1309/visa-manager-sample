import { Router } from "express";
import { body } from "express-validator";
import { ApplicantController } from "../controllers/applicant-controller";
import { BotController } from "../controllers/bot-controller";
import { NotificationController } from "../controllers/notification-controller";
import { PaymentController } from "../controllers/payment-controller";
import { PriceController } from "../controllers/price-controller";
import { RecordController } from "../controllers/record-controller";
import { SupportController } from "../controllers/support-controller";
import { UserController } from "../controllers/user-controller";
import { WithdrawalController } from "../controllers/withdrawal-controller";
import { authBotMiddleware } from "../middlewares/auth-bot-middleware";
import { authMiddleware } from "../middlewares/auth-middleware";

const router = Router();
router.post(
  "/registration",
  body("email").isEmail(),
  body("password").isLength({ min: 3, max: 32 }),
  UserController.registration
);
router.get("/activation", UserController.activation);
router.post("/login", UserController.login);
router.get("/logout", UserController.logout);
router.get("/refresh", UserController.refresh);
router.post("/reset-password-link", UserController.resetPasswordLink);
router.post("/reset-password", UserController.resetPassword);
router.post("/change-password", authMiddleware, UserController.changePassword);
router.get("/users", authMiddleware, UserController.getUsers);
router.get("/users/:id", authMiddleware, UserController.getUser);
router.patch("/users/:id", authMiddleware, UserController.updateUser);
router.post("/records", authMiddleware, RecordController.createRecord);
router.patch(
  "/applicants/:id",
  authBotMiddleware,
  authMiddleware,
  ApplicantController.update
);
router.patch(
  "/records/:id",
  authBotMiddleware,
  authMiddleware,
  RecordController.updateRecord
);
router.delete("/records/:id", authMiddleware, RecordController.removeRecord);
router.get(
  "/records",
  authBotMiddleware,
  authMiddleware,
  RecordController.getRecords
);
router.get(
  "/records/:id",
  authBotMiddleware,
  authMiddleware,
  RecordController.getRecord
);
router.post("/support", authMiddleware, SupportController.createSupportTicket);
router.post("/bot", authMiddleware, BotController.createBot);
router.get("/bot", authMiddleware, BotController.getBots);
router.post("/payment", authMiddleware, PaymentController.createPayment);
router.get("/withdrawals", authMiddleware, WithdrawalController.getWithdrawals);
router.post(
  "/withdrawals",
  authMiddleware,
  WithdrawalController.createWithdrawal
);
router.patch(
  "/withdrawals/:id",
  authMiddleware,
  WithdrawalController.updateWithdrawal
);
router.delete(
  "/withdrawals/:id",
  authMiddleware,
  WithdrawalController.removeWithdrawal
);
router.get("/paymentCheck", PaymentController.checkPayment);
router.get("/prices", PriceController.getPrices);
router.post("/prices", authMiddleware, PriceController.updatePrices);
router.post(
  "/statistics",
  authMiddleware,
  UserController.getBotOwnerStatistics
);
router.get(
  "/notifications",
  authMiddleware,
  NotificationController.getNotifications
);
router.patch(
  "/notifications/:id",
  authMiddleware,
  NotificationController.updateNotification
);

export { router };
