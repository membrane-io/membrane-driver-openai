import fetch from "node-fetch";
import { state, nodes, root } from "membrane";

async function api(
  method: "GET" | "POST" | "PUT",
  path: string,
  body?: string | object
) {
  return await fetch(`https://api.openai.com/v1/${path}`, {
    method,
    body: typeof body === "object" ? JSON.stringify(body) : body,
    headers: {
      Authorization: `Bearer ${state.token}`,
      "Content-Type": "application/json",
    },
  });
}

export const Root = {
  models() {
    return {};
  },
  status() {
    if (!state.token) {
      return "Please [get and configure the OpenAI API key](https://beta.openai.com/account/api-keys)";
    } else {
      return `Ready`;
    }
  },
  configure({ args: { token } }) {
    return (state.token = token);
  },
};

export const ModelsCollection = {
  async one({ args }) {
    const res = await api("GET", `models/${args.id}`);

    return res.json().then((json: any) => json && json);
  },

  page: async ({ self, args }) => {
    let res = await api("GET", "models");

    return await res.json().then((json: any) => json && json.data);
  },
};

export const Model = {
  gref({ obj }) {
    return root.models.one({ id: obj.id });
  },
};

export async function completion({
  args: {
    model = "text-davinci-003",
    max_tokens = 100,
    temperature = 0.9,
    ...rest
  },
}) {
  let res = await api("POST", "completions", { model, ...rest });

  return await res.json().then((json: any) => json && json.choices[0].text.replace(/(\n|\t)/gm, ""));
}

export async function edit({
  args: { model = "text-davinci-edit-001", temperature = 0.9, ...rest },
}) {
  let res = await api("POST", "edits", { model, ...rest });

  return await res.json().then((json: any) => json && json.choices[0].text.replace(/(\n|\t)/gm, ""));
}

export async function image({ args: { size = "1024x1024", ...rest } }) {
  const res = await api("POST", "images/generations", {
    size: "1024x1024",
    ...rest,
  });

  return await res.json().then((json: any) => json && json.data);
}

export async function moderation({ args }) {
  const res = await api("POST", "moderations", args);

  return await res.json().then((json: any) => json && json.results[0].categories);
}
