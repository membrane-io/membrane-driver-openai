import { state } from "membrane";

export async function api(method: "GET" | "POST", path: string, body?: object) {
  return await fetch(`https://api.openai.com/v1/${path}`, {
    method,
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${state.token}`,
      "Content-Type": "application/json",
    },
  });
}
