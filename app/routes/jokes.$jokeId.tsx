import { LoaderFunctionArgs, json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async ({
    params,
}: LoaderFunctionArgs) => {
    console.log(params); // <-- {jokeId: "123"}
    const joke = await db.joke.findUnique({
        where: { id: params.jokeId },
    });
    if (!joke) throw new Error("Joke notfound");
    return json({ joke });
};

export default function JokeRoute() {
    const data = useLoaderData<typeof loader>();

    return (
        <div>
            <p>Here's your hilarious joke:</p>
            <p>{data.joke.content}</p>
            <Link to=".">"{data.joke.name}" Permalink</Link>
        </div>

    );
}