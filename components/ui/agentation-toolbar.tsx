"use client";

import { Agentation } from "agentation";

const AGENTATION_ENDPOINT = "http://localhost:4747";

export default function AgentationToolbar() {
  if (process.env.NODE_ENV !== "development") return null;
  return <Agentation endpoint={AGENTATION_ENDPOINT} copyToClipboard={false} />;
}
