import {
  sleep,
  proxyActivities,
  defineSignal,
  defineQuery,
  setHandler,
} from "@temporalio/workflow";

const { sendEmailActivity } = proxyActivities<{
  sendEmailActivity: (input: {
    to: string;
    subject: string;
    body: string;
  }) => Promise<any>;
}>({
  startToCloseTimeout: "1 minute",
});

export const updateCadence = defineSignal<[any[]]>("updateCadence");
export const getState = defineQuery<any>("getState");

export async function CadenceWorkflow(input: {
  cadenceId: string;
  contactEmail: string;
  steps: any[];
}) {
  let state = {
    currentStepIndex: 0,
    stepsVersion: 1,
    status: "RUNNING",
    steps: input.steps,
  };

  // ✅ Query Handler
  setHandler(getState, () => state);

  // ✅ Signal Handler (VERY IMPORTANT)
  setHandler(updateCadence, (newSteps) => {
    console.log("🔄 Cadence Updated अंदर Workflow");

    state.steps = newSteps;
    state.stepsVersion++;

    // RULE: If steps shrink
    if (newSteps.length <= state.currentStepIndex) {
      state.status = "COMPLETED";
    }
  });

  // ✅ Execution Loop
  while (
    state.currentStepIndex < state.steps.length &&
    state.status === "RUNNING"
  ) {
    const step = state.steps[state.currentStepIndex];

    console.log(`➡ Executing Step ${state.currentStepIndex + 1}`);

    if (step.type === "WAIT") {
      console.log(`⏳ Waiting ${step.seconds} seconds`);
      await sleep(step.seconds * 1000);
    }

    if (step.type === "SEND_EMAIL") {
      await sendEmailActivity({
        to: input.contactEmail,
        subject: step.subject,
        body: step.body,
      });
    }

    state.currentStepIndex++;
  }

  state.status = "COMPLETED";
  console.log("✅ Workflow Completed");
}