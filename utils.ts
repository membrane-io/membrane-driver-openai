import { state } from "membrane";

export async function api(method: "GET" | "POST", path: string, body?: object) {
  const res = await fetch(`https://api.openai.com/v1/${path}`, {
    method,
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${state.token}`,
      "Content-Type": "application/json",
    },
  });

  if (res.status >= 300) {
    const error = new Error(await res.text());
    error["status"] = res.status;
    throw error;
  }

  return res;
}
 