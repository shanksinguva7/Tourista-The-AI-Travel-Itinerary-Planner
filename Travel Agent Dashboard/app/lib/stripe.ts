import Stripe from "stripe";

export const createProduct = async (
    name: string,
    description: string,
    images: string[],
    price: number,
    tripId: string
) => {
    const stripe = new Stripe(
        process.env.STRIPE_SECRET_KEY ?? import.meta.env.STRIPE_SECRET_KEY,
        { apiVersion: "2025-03-31.basil" as any }
    );

    const product = await stripe.products.create({ name, description, images });

    const priceObject = await stripe.prices.create({
        product: product.id,
        unit_amount: price * 100,
        currency: "usd",
    });

    const baseUrl =
        process.env.VITE_BASE_URL ?? import.meta.env.VITE_BASE_URL ?? "http://localhost:5174";

    const paymentLink = await stripe.paymentLinks.create({
        line_items: [{ price: priceObject.id, quantity: 1 }],
        metadata: { tripId },
        after_completion: {
            type: "redirect",
            redirect: { url: `${baseUrl}/travel/${tripId}/success` },
        },
    });

    return paymentLink;
};
