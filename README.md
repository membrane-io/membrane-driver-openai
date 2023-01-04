# Hacker News Driver

This [driver](https://membrane.io) lets you interact with OpenAI through your Membrane graph.

## Usage

1. Install the [Membrane VSCode Extension](https://marketplace.visualstudio.com/items?itemName=membrane.membrane).
2. Setup on extension your [Membrane's CLI binary (mctl)](https://membrane.io/download) path.
3. Login / Sign up with `mctl login`.
4. Update the program on Membrane with the VSCode Command palette `(cmd+shift+p)`\
   `> Membrame: Update current program`

## Queries

### List models:

`mctl query 'openai:models.page' '{ id owned_by object }'`

```
Result:
[
 {
    "id": "text-davinci:001",
    "owned_by": "system",
    "object": "model"
  },
  {
    "id": "text-curie:001",
    "owned_by": "system",
    "object": "model"
  },
  {
    "id": "text-babbage:001",
    "owned_by": "openai",
    "object": "model"
  }
  ...
]
```

## Actions

### Create completion

`mctl action 'openai:completion(prompt:"what is vercel")'`

```
Result:
"Vercel is a cloud platform for static sites and serverless functions."
```

### Create image

`mctl action 'openai:image(n:1,prompt:"real martian")'`

```
Result:
[
  {
    "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-axt0lBVwbIkPQaaB9sZUFdv7/user-ZOh1OVZ0EmR0PozpSWPBD5rQ/img-MnHioaTxosecDF2F2SylWI6e.png?st=2023-01-04T02%3A51%3A49Z&se=2023-01-04T04%3A51%3A49Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-01-03T23%3A25%3A38Z&ske=2023-01-04T23%3A25%3A38Z&sks=b&skv=2021-08-06&sig=2L6qXg95yKUrm/Z0p%2B7TjynxW4qN9k5wrZMOt0/AO34%3D"
  },
  {
    "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-axt0lBVwbIkPQaaB9sZUFdv7/user-ZOh1OVZ0EmR0PozpSWPBD5rQ/img-Zcs6ADyFGSo1CTe9Qp2kAnbH.png?st=2023-01-04T02%3A51%3A49Z&se=2023-01-04T04%3A51%3A49Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-01-03T23%3A25%3A38Z&ske=2023-01-04T23%3A25%3A38Z&sks=b&skv=2021-08-06&sig=keDxTR1ughhfnUM5kE47gm7QstTa1b8agx1gMB/PHpw%3D"
  }
  ...
]
```

### Create moderation

`mctl action 'openai:moderation(input:"I want to kill you")'`

```
Result:
{
  "hate": false,
  "hate/threatening": false,
  "self-harm": false,
  "sexual": false,
  "sexual/minors": false,
  "violence": true,
  "violence/graphic": false
}
```

### Create edit

`mctl action 'openai:edit(input:"what ares wikipedia?", instruction:"Fix the spelling mistakes")'`

```
Result:
"What is wikipedia?"
```

# Schema

### Types

```javascript
<Root>
    - Fields
        status -> String
        models -> Ref<ModelsCollection>
    - Actions
        configure -> Void
        completion -> String
        moderation -> Ref<Moderation>
        edit -> String
        image -> List<Image>
<ModelsCollection>
    - Fields
        one -> <Model>
        page -> List<Model>
<Model>
    - Field
        id -> String
        onject -> String
        owned_by -> Int
<Image>
    - Fields
        url -> String
<Moderation>
    - Fields
        violence/graphic -> String
        violence -> String
        sexual/minors -> String
        sexual -> String
        self-harm -> String
        hate/threatening -> String
        hate -> String
```
