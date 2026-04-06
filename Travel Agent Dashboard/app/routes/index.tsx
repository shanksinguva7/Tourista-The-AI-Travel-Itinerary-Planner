import { redirect } from "react-router";
import type { Route } from "./+types/index";

export function loader({ request }: Route.LoaderArgs) {
    return redirect("/dashboard");
}
