import { redirect } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { loginWithGoogle } from "~/appwrite/auth";

export const clientLoader = async () => {
    try {
        const user = await account.get();
        if (user.$id) return redirect("/");
    } catch {
        // Not authenticated — show sign-in page
    }
    return null;
};

const SignIn = () => {
    return (
        <main className="auth">
            <div className="flex-center w-full">
                <section className="sign-in-card">
                    <header>
                        <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
                        <h1 className="text-base md:text-2xl font-bold text-dark-100">Tourista</h1>
                    </header>

                    <article>
                        <h2 className="p-28-bold text-dark-100">Start Your Travel Journey</h2>
                        <p className="text-gray-100 text-sm md:text-lg font-normal">
                            Sign in with Google to manage destinations, itineraries, and user
                            activity with ease.
                        </p>
                    </article>

                    <ButtonComponent
                        type="button"
                        className="button-class !h-11 !w-full"
                        onClick={loginWithGoogle}
                    >
                        <img src="/assets/icons/google.svg" alt="google" className="size-5" />
                        <span className="p-16-semibold text-white">Sign in with Google</span>
                    </ButtonComponent>
                </section>
            </div>
        </main>
    );
};

export default SignIn;
