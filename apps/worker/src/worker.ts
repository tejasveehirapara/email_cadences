import { Worker } from "@temporalio/worker";
import * as activities from "./activities/sendEmail.activity";

async function run() {
  const worker = await Worker.create({
    workflowsPath: require.resolve("./workflows/cadence.workflow.ts"),
    activities,
    taskQueue: "cadence-queue", // ⚠ must match API
  });

  console.log("🚀 Worker started...");
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});