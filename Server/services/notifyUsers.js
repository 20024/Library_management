import cron from "node-cron";
import { User } from "../models/userModels.js";
import Borrow from "../models/borrowModels.js"; // make sure this is imported
import { sendEmail } from "../utils/sendEmail.js"; // assume this exists

export const notifyUsers = () => {
  cron.schedule("*/10 * * * *", async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const borrowers = await Borrow.find({
        dueDate: { $lt: oneDayAgo },
        returnDate: null,
        notified: false,
      }).populate("user");

      for (const borrow of borrowers) {
        if (borrow.user && borrow.user.email) {
          await sendEmail({
            email: borrow.user.email,
            subject: "Book Return Reminder",
            message: `Hello ${borrow.user.name},\n\nThis is a reminder that the book you borrowed was due for return. Please return the book to the library as soon as possible.\n\nThank you.`,
          });

          borrow.notified = true;
          await borrow.save();
        }
      }

      console.log("Notification cron ran successfully.");
    } catch (error) {
      console.error("Error running notification cron:", error);
    }
  });
};
