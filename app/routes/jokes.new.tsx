import { ActionFunction, ActionFunctionArgs, redirect } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";
import { requireUserId } from "~/utils/session.server";


function validateJokeName(name: string) {
  if (name.length < 3) {
    return "That joke name is too short";
  }
}
function validateJokeContent(content: string) {
  if (content.length < 10) {
    return "That joke content is too short";
  }
}

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
  const form = await request.formData();
  const name = form.get("name");
  const content = form.get("content");
  const userId = await requireUserId(request);


  if (typeof name !== "string" || typeof content !== "string") {
    return badRequest({ fieldErrors: null, fields: null, formError: "Form not submited correctly" });
  }

  const fieldErrors = {
    content: validateJokeContent(content),
    name: validateJokeName(name),
  }
  const fields = { name, content };
  if (Object.values(fieldErrors).some(Boolean)) {
    return badRequest({ fieldErrors, fields, formError: null })
  }
  const joke = await db.joke.create({ data: {...fields, jokesterId: userId} })
  return redirect(`/jokes/${joke.id}`)
}

export default function NewJokeRoute() {
  const actionData = useActionData<typeof action>()

  return (
    <div>
      <p>Add your own hilarious joke</p>
      <form method="post">
        <div>
          <label>
            Name: {" "}
            <input
              type="text"
              name="name"
              defaultValue={actionData?.fields?.name}
              aria-invalid={Boolean(actionData?.fieldErrors?.name)}
              aria-errormessage={
                actionData?.fieldErrors?.namei
                  ? "name-error" : undefined
              }
            />
            {actionData?.fieldErrors?.name ? (
              <p className="form-validation-error" id="name-error" role="alert">
                {actionData?.fieldErrors?.name}
              </p>
            ) : null}
          </label>
        </div>
        <div>
          <label>
            Content: ${" "}
            <textarea
              name="content"
              defaultValue={actionData?.fields?.content}
              aria-invalid={Boolean(actionData?.fieldErrors?.content)}
              aria-errormessage={
                actionData?.fieldErrors?.content
                  ? "content-error" : undefined
              } />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p className="form-validation-error" id="content-error" role="alert">
              {actionData?.fieldErrors?.content}
            </p>
          ) : null}

        </div>
        <div>
          <button type="submit" className="button">
            Add
          </button>
        </div>
      </form>
    </div>
  );
}
