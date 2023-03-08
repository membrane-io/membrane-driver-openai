import { state } from "membrane";

export async function api(method: "GET" | "POST", path: string, body?: string | object) {
  return await fetch(`https://api.openai.com/v1/${path}`, {
    method,
    body: typeof body === "object" ? JSON.stringify(body) : body,
    headers: {
      Authorization: `Bearer ${state.token}`,
      "Content-Type": "application/json",
    },
  });
}
