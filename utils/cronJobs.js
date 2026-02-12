const cron = require("node-cron");
const Task = require("../models/Task");

module.exports = function startCronJobs() {
  cron.schedule("0 * * * *", async () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    await Task.deleteMany({
      status: "failure",
      failedAt: { $lte: twoDaysAgo }
    });

    console.log("Expired failed tasks deleted");
  });
};
