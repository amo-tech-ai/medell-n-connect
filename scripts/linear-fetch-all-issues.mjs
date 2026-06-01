#!/usr/bin/env node
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const API_KEY = process.env.LINEAR_API_KEY;
const PROJECT_ID = "7826f699-5ded-44e3-8fc1-0a17fd9910ca";

if (!API_KEY) {
  console.error("LINEAR_API_KEY required");
  process.exit(1);
}

async function gql(query, variables = {}) {
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: API_KEY },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data;
}

const issues = [];
let cursor = null;
for (;;) {
  const data = await gql(
    `query($id: String!, $after: String) {
      project(id: $id) {
        issues(first: 50, after: $after) {
          nodes {
            id identifier title
            state { name type }
            projectMilestone { name }
            labels { nodes { name } }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    }`,
    { id: PROJECT_ID, after: cursor },
  );
  issues.push(...data.project.issues.nodes);
  if (!data.project.issues.pageInfo.hasNextPage) break;
  cursor = data.project.issues.pageInfo.endCursor;
}

const out = join(ROOT, "tasks/linear/linear-issues-snapshot.json");
writeFileSync(out, JSON.stringify(issues, null, 2));
console.log(`Wrote ${issues.length} issues to ${out}`);
