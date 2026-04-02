import mongoose from "mongoose";

const activityEventSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    type: { type: String, required: true },
    ts: { type: Date, required: true },
    payload: { type: Object, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.ActivityEvent || mongoose.model("ActivityEvent", activityEventSchema);
