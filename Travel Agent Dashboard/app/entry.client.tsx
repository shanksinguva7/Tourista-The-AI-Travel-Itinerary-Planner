import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(import.meta.env.VITE_SYNCFUSION_LICENSE_KEY);

startTransition(() => {
    hydrateRoot(
        document,
        <StrictMode>
            <HydratedRouter />
        </StrictMode>
    );
});
