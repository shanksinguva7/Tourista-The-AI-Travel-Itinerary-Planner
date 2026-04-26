import { useEffect } from "react";
import { Link } from "react-router";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import confetti from "canvas-confetti";
import { LEFT_CONFETTI, RIGHT_CONFETTI } from "~/constants";
import type { Route } from "./+types/payment-success";

export const loader = ({ params }: any) => {
    return { tripId: params.tripId };
};

const PaymentSuccess = ({ loaderData }: Route.ComponentProps) => {
    const { tripId } = loaderData;

    useEffect(() => {
        confetti(LEFT_CONFETTI as confetti.Options);
        confetti(RIGHT_CONFETTI as confetti.Options);
    }, []);

    return (
        <main className="payment-success wrapper">
            <section>
                <img src="/assets/icons/check.svg" alt="check" className="size-20" />

                <article>
                    <h1>Thank You & Welcome Aboard!</h1>
                    <p>
                        Your trip is booked — can't wait to have you on this adventure. Get ready to
                        explore &amp; make memories! ✨
                    </p>
                </article>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link to={`/travel/${tripId}`}>
                        <ButtonComponent className="button-class !h-12 !px-6">
                            <span className="p-16-semibold text-white">View trip details</span>
                        </ButtonComponent>
                    </Link>
                    <Link to="/">
                        <ButtonComponent className="button-class-secondary !h-12 !px-6 !border !border-gray-200">
                            <span className="p-16-semibold text-dark-100">Return to homepage</span>
                        </ButtonComponent>
                    </Link>
                </div>
            </section>
        </main>
    );
};

export default PaymentSuccess;
