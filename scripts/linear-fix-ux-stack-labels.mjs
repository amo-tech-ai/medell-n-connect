#!/usr/bin/env node
/** Add track:ux to UX stack issues (SAN-427+) stripped by import labelIds replace. */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const TEAM_ID = "dfea57b5-a723-4414-a06a-39a2c5467afb";
const API_KEY = process.env.LINEAR_API_KEY;

if (!API_KEY) {
  console.error("Set LINEAR_API_KEY");
  process.exit(1);
}

const stack = JSON.parse(readFileSync(join(ROOT, "tasks/linear/ux-stack-import-log.json"), "utf8"));
const legacy = JSON.parse(readFileSync(join(ROOT, "tasks/linear/ux-import-log.json"), "utf8"));

const ids = [
  ...new Set([
    ...stack.issues.map((i) => i.linear?.identifier).filter(Boolean),
    ...legacy.issues.map((i) => i.identifier),
    "SAN-360",
    "SAN-361",
    "SAN-362",
    "SAN-363",
    "SAN-364",
    "SAN-365",
  ]),
];

async function gql(query, variables = {}) {
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: API_KEY },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json;
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const { data: ref } = await gql(
    `query($id: String!) {
      issue(id: $id) { labels { nodes { id name } } }
    }`,
    { id: "SAN-315" },
  );
  const trackUx = ref.issue.labels.nodes.find((l) => l.name === "track:ux");
  if (!trackUx) throw new Error("track:ux label not found on SAN-315");

  let updated = 0;
  let skipped = 0;
  for (const identifier of ids) {
    const { data: issueData } = await gql(
      `query($id: String!) {
        issue(id: $id) { id identifier labels { nodes { id name } } }
      }`,
      { id: identifier },
    );
    const issue = issueData.issue;
    if (!issue) {
      console.log("missing", identifier);
      continue;
    }
    if (issue.labels.nodes.some((l) => l.name === "track:ux")) {
      skipped++;
      continue;
    }
    const labelIds = [...issue.labels.nodes.map((l) => l.id), trackUx.id];
    await gql(
      `mutation($id: String!, $input: IssueUpdateInput!) {
        issueUpdate(id: $id, input: $input) { success }
      }`,
      { id: issue.id, input: { labelIds } },
    );
    console.log(`track:ux → ${identifier}`);
    updated++;
    await sleep(80);
  }
  console.log(`Done: updated=${updated} skipped=${skipped} total=${ids.length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
