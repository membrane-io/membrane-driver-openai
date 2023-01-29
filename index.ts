import fetch from "node-fetch";
import { state, nodes, root } from "membrane";

async function api(
  method: "GET" | "POST",
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
  generateImage: async ({ args: { size = "1024x1024", ...rest } }) => {
    const res = await api("POST", "images/generations", {
      size: "1024x1024",
      ...rest,
    });

    try {
      return await res.json().then((json: any) => json && json.data);
    } catch (e) {
      throw new Error('Failed to generate image.');
    }
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
  complete: async ({ self, args: { max_tokens = 1500, temperature = 0, ...rest } }) => {
    const { id } = self.$argsAt(root.models.one);
    let res = await api("POST", "completions", { model: id, max_tokens, temperature, ...rest });
    try {
      const choices = await res.json().then((json: any) => json && json.choices);
      // Multiple choices when is passing array of texts
      return choices[0].text.replace(/(\n|\t)/gm, "");
    } catch (e) {
      throw new Error('Failed to get completion.');
    }
  },
  edit: async ({ self, args: { temperature = 0.9, ...rest } }) => {
    const { id } = self.$argsAt(root.models.one);
    let res = await api("POST", "edits", { model: id, ...rest });
    try {
      const choices = await res.json().then((json: any) => json && json.choices);
      // Multiple choices when is passing array of texts
      return choices[0].text.replace(/(\n|\t)/gm, "");
    } catch (e) {
      throw new Error('Failed to get edit.');
    }
  },
  moderate: async ({ self, args }) => {
    const { id } = self.$argsAt(root.models.one);
    const res = await api("POST", "moderations", { model: id, ...args });
    try {
      // Multiple classifications when is passing array of texts
      return await res.json().then((json: any) => json && json.results[0].categories);
    } catch (e) {
      throw new Error('Failed to get moderation.');
    }
  }
};
