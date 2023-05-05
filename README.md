# OpenAI Driver

This [driver](https://membrane.io) lets you interact with OpenAI through your Membrane graph.
	
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

`mctl action 'openai:models.one(id:"text-davinci-001").complete(prompt:"what is vercel")'`

```
Result:
"Vercel is a cloud platform for static sites and serverless functions."
```

### Create image

`mctl action 'openai:generateImage(prompt:"real martian")'`

```
Result:
[
  {
    "url": "https://oaidalleapiprodscus.blob.core.windows.net/private/org-axt0lBVwbIkPQaaB9sZUFdv7/user-ZOh1OVZ0EmR0PozpSWPBD5rQ/img-MnHioaTxosecDF2F2SylWI6e.png?st=2023-01-04T02%3A51%3A49Z&se=2023-01-04T04%3A51%3A49Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-01-03T23%3A25%3A38Z&ske=2023-01-04T23%3A25%3A38Z&sks=b&skv=2021-08-06&sig=2L6qXg95yKUrm/Z0p%2B7TjynxW4qN9k5wrZMOt0/AO34%3D"
  },
  ...
]
```

### Create moderation

`mctl action 'openai:models.one(id:"text-moderation-stable").moderate(input:"I want to kill you")'`

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

`mctl action 'openai:models.one(id:"text-davinci-edit-001").edit(input:"what ares wikipedia?", instruction:"Fix the spelling mistakes")'`

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
        fineTunes -> Ref<FineTunesCollection>
        files -> Ref<FilesCollection>
    - Actions
        configure -> Void
        generateImage -> List<Image>
<ModelsCollection>
    - Fields
        one -> <Model>
        page -> List<Model>
<FineTunesCollection>
    - Fields
        one -> <FineTune>
        page -> List<FineTune>
<FilesCollection>
    - Fields
        one -> <File>
        page -> List<File>
<Model>
    - Field
        id -> String
        onject -> String
        owned_by -> Int
    - Actions
        complete -> String
        chat -> String
        moderate -> Ref<Moderation>
        edit -> String
<File>
    - Field
        id -> String
        onject -> String
        bytes -> Int
        created_at -> Int
        filename -> String
        purpose -> String
<FineTuned>
    - Field
        id -> 
        object -> String
        model -> String
        hyperparams -> Ref<Hyperparams>
        fine_tuned_model -> String
        organization_id -> String
        status -> String
        created_at -> Int
        updated_at -> Int
        events -> List<Event>
        result_files -> List<File>
        training_files -> List<File>
        validation_files -> List<File>
<Hyperparams>
    - Fields
        batch_size -> Int
        learning_rate_multiplayer -> Float
        n_epochs -> Int
        prompt_loss_weight -> Float
<Event>
    - Fields
        object -> String
        created_at -> Int
        level -> String
        message -> String
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