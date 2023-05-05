import { state, nodes, root } from "membrane";
import { api } from "./utils";

export const Root = {
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
  models() {
    return {};
  },
  files: () => ({}),
  fineTunes: () => ({}),
  generateImage: async ({ args: { size = "1024x1024", ...rest } }) => {
    const res = await api("POST", "images/generations", {
      size: "1024x1024",
      ...rest,
    });

    try {
      return await res.json().then((json: any) => json && json.data);
    } catch (e) {
      throw new Error("Failed to generate image.");
    }
  },
  moderate: async ({ args }) => {
    const model = args.stable ? "text-moderation-stable" : "text-moderation-latest";
    const input = args.input;
    const res = await api("POST", "moderations", { model, input });

    if (res.status !== 200) {
      throw new Error("Failed to get moderation. Status: " + res.status);
    }

    // API supports passing multiple inputs, but we only pass one so take the first result
    const body = await res.json();
    const result = body?.results?.[0];

    // Remove slashes and dashes from keys in the categories and categories_scores
    const ret: Record<string, boolean | number> = {};
    for (const key of Object.keys(result.categories)) {
      ret[key.replace("/", "_").replace("-", "_")] = result.categories[key];
    }
    for (const key of Object.keys(result.category_scores)) {
      ret[key.replace("/", "_").replace("-", "_") + "_score"] = result.category_scores[key];
    }
    return ret;
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

export const FilesCollection = {
  one: async ({ args }) => {
    const res = await api("GET", `files/${args.id}`);

    return res.json().then((json: any) => json && json);
  },

  items: async ({ self, args }) => {
    let res = await api("GET", "files");

    return await res.json().then((json: any) => json && json.data);
  },
  upload: async ({ args }) => {
    // TODO: Implement
    // const res = await api("POST", "files", args);
    // return res.json().then((json: any) => json && json);
  },
};

export const FineTunesCollection = {
  one: async ({ args }) => {
    const res = await api("GET", `fine-tunes/${args.id}`);

    return res.json().then((json: any) => json && json);
  },

  items: async ({ self, args }) => {
    let res = await api("GET", "fine-tunes");

    return await res.json().then((json: any) => json && json.data);
  },
  create: async ({ args }) => {
    const res = await api("POST", "fine-tunes", args);

    return res.json().then((json: any) => json && json);
  },
};

export const FineTune = {
  gref({ obj }) {
    return root.fineTunes.one({ id: obj.id });
  },
};

export const File = {
  gref({ obj }) {
    return root.files.one({ id: obj.id });
  },
  created_at({ obj }) {
    return new Date(obj.created_at * 1000).toISOString();
  },
};

export const Model = {
  gref({ obj }) {
    return root.models.one({ id: obj.id });
  },
  completeText: async ({ self, args: { max_tokens = 1500, temperature = 0.2, ...rest } }) => {
    const { id } = self.$argsAt(root.models.one);
    let res = await api("POST", "completions", {
      model: id,
      max_tokens,
      temperature,
      ...rest,
    });
    try {
      const choices = await res.json().then((json: any) => json && json.choices);
      // Multiple choices when is passing array of texts
      return choices[0].text;
    } catch (e) {
      throw new Error("Failed to get completion.");
    }
  },
  completeChat: async ({
    self,
    args: { max_tokens = 3000, temperature = 0, messages, ...rest },
  }) => {
    const { id } = self.$argsAt(root.models.one);
    let res = await api("POST", "chat/completions", {
      model: id,
      messages: JSON.parse(messages),
      max_tokens,
      temperature,
      ...rest,
    });
    try {
      const choices = await res.json().then((json: any) => json && json.choices);
      return choices[0].message.content;
    } catch (e) {
      throw new Error(e);
    }
  },
  edit: async ({ self, args: { temperature = 0.9, ...rest } }) => {
    const { id } = self.$argsAt(root.models.one);
    let res = await api("POST", "edits", { model: id, ...rest });
    try {
      const choices = await res.json().then((json: any) => json && json.choices);
      // Multiple choices when is passing array of texts
      return choices[0].text;
    } catch (e) {
      throw new Error("Failed to get edit.");
    }
  },
  createEmbeddings: async ({ self, args: { input, user } }) => {
    const { id } = self.$argsAt(root.models.one);
    try {
      //TODO: Multiple inputs when is passsing text separated by comma - str.split(',')
      let res = await api("POST", "embeddings", { model: id, user, input });
      return JSON.stringify(await res.json().then((json: any) => json && json.data));
    } catch (e) {
      throw new Error("Failed to create embeddings.");
    }
  },
};
