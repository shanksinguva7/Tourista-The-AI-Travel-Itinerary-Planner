import { Header } from "components";
import {
    ComboBoxComponent,
    MultiSelectComponent,
    CheckBoxSelection,
    Inject as DropdownInject,
} from "@syncfusion/ej2-react-dropdowns";
import type { Route } from "./+types/create-trip";
import { comboBoxItems, selectItems } from "~/constants";
import { cn, formatKey } from "~/lib/utils";
import { LayerDirective, LayersDirective, MapsComponent } from "@syncfusion/ej2-react-maps";
import React, { useState } from "react";
import { world_map } from "~/constants/world_map";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import { account } from "~/appwrite/client";
import { useNavigate } from "react-router";

export const clientLoader = async () => {
    try {
        const response = await fetch(
            "https://restcountries.com/v3.1/all?fields=name,latlng,maps,flag",
            { signal: AbortSignal.timeout(10000) }
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error("Invalid response");

        return (data as any[])
            .map((country) => ({
                name: (country.flag ?? "") + " " + country.name.common,
                coordinates: country.latlng ?? [],
                value: country.name.common,
                openStreetMap: country.maps?.openStreetMap ?? "",
            }))
            .sort((a: Country, b: Country) => a.value.localeCompare(b.value));
    } catch (e) {
        console.error("Error fetching countries:", e);
        return [];
    }
};

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
    const countries = loaderData as Country[];
    const navigate = useNavigate();

    const [formData, setFormData] = useState<TripFormData>({
        country: "",
        travelStyle: "",
        interest: "",
        budget: "",
        duration: 0,
        groupType: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (
            !formData.country ||
            !formData.travelStyle ||
            !formData.interest ||
            !formData.budget ||
            !formData.groupType
        ) {
            setError("Please provide values for all fields");
            setLoading(false);
            return;
        }

        if (formData.duration < 1 || formData.duration > 10) {
            setError("Duration must be between 1 and 10 days");
            setLoading(false);
            return;
        }

        const user = await account.get();
        if (!user.$id) {
            console.error("User not authenticated");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/create-trip", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    country: formData.country,
                    numberOfDays: formData.duration,
                    travelStyle: formData.travelStyle,
                    interests: formData.interest,
                    budget: formData.budget,
                    groupType: formData.groupType,
                    userId: user.$id,
                }),
            });

            const result: CreateTripResponse = await response.json();

            if (result?.id) navigate(`/trips/${result.id}`);
            else {
                setError("Failed to generate trip. Please try again.");
                console.error("No trip ID returned", result);
            }
        } catch (e) {
            console.error("Error generating trip", e);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (key: keyof TripFormData, value: string | number) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const countryData = countries.map((country) => ({
        text: country.name,
        value: country.value,
    }));

    const mapData = [
        {
            country: formData.country,
            color: "#EA382E",
            coordinates:
                countries.find((c: Country) => c.value === formData.country)?.coordinates || [],
        },
    ];

    return (
        <main className="flex flex-col gap-10 pb-20 wrapper">
            <Header title="Add a New Trip" description="View and edit AI Generated travel plans" />

            <section className="mt-2.5 wrapper-md">
                <form className="trip-form" onSubmit={handleSubmit}>
                    {/* Country */}
                    <div>
                        <label htmlFor="country">Country</label>
                        <ComboBoxComponent
                            id="country"
                            dataSource={countryData}
                            fields={{ text: "text", value: "value" }}
                            placeholder="Select a Country"
                            className="combo-box"
                            popupHeight="300px"
                            allowFiltering
                            filterType="Contains"
                            ignoreCase
                            change={(e: { value: string | undefined }) => {
                                if (e.value) handleChange("country", e.value);
                            }}
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label htmlFor="duration">Duration</label>
                        <input
                            id="duration"
                            name="duration"
                            type="number"
                            min={1}
                            max={10}
                            placeholder="Enter number of days (1–10)"
                            className="form-input placeholder:text-gray-100"
                            onChange={(e) => handleChange("duration", Number(e.target.value))}
                        />
                    </div>

                    {/* Interests — multi-select */}
                    <div>
                        <label htmlFor="interest">Interests</label>
                        <MultiSelectComponent
                            id="interest"
                            dataSource={comboBoxItems["interest"].map((item) => ({
                                text: item,
                                value: item,
                            }))}
                            fields={{ text: "text", value: "value" }}
                            placeholder="Select your interests"
                            mode="CheckBox"
                            showSelectAll
                            selectAllText="Select All"
                            unSelectAllText="Unselect All"
                            filterBarPlaceholder="Search interests"
                            allowFiltering
                            popupHeight="300px"
                            className="combo-box"
                            change={(e: any) => {
                                if (e.value?.length) {
                                    handleChange("interest", (e.value as string[]).join(", "));
                                } else {
                                    handleChange("interest", "");
                                }
                            }}
                        >
                            <DropdownInject services={[CheckBoxSelection]} />
                        </MultiSelectComponent>
                    </div>

                    {/* Other selects (groupType, travelStyle, budget) */}
                    {(selectItems.filter((k) => k !== "interest") as (keyof TripFormData)[]).map(
                        (key) => (
                            <div key={key}>
                                <label htmlFor={key}>{formatKey(key)}</label>
                                <ComboBoxComponent
                                    id={key}
                                    dataSource={comboBoxItems[key].map((item) => ({
                                        text: item,
                                        value: item,
                                    }))}
                                    fields={{ text: "text", value: "value" }}
                                    placeholder={`Select ${formatKey(key)}`}
                                    popupHeight="300px"
                                    allowFiltering
                                    filterType="Contains"
                                    ignoreCase
                                    change={(e: { value: string | undefined }) => {
                                        if (e.value) handleChange(key, e.value);
                                    }}
                                    className="combo-box"
                                />
                            </div>
                        )
                    )}

                    {/* Map */}
                    <div>
                        <label htmlFor="location">Location on the world map</label>
                        <MapsComponent>
                            <LayersDirective>
                                <LayerDirective
                                    shapeData={world_map}
                                    dataSource={mapData}
                                    shapePropertyPath="name"
                                    shapeDataPath="country"
                                    shapeSettings={{ colorValuePath: "color", fill: "#E5E5E5" }}
                                />
                            </LayersDirective>
                        </MapsComponent>
                    </div>

                    <div className="bg-gray-200 h-px w-full" />

                    {error && (
                        <div className="error">
                            <p>{error}</p>
                        </div>
                    )}

                    <footer className="px-6 w-full">
                        <ButtonComponent
                            type="submit"
                            className="button-class !h-12 !w-full"
                            disabled={loading}
                        >
                            <img
                                src={`/assets/icons/${loading ? "loader.svg" : "magic-star.svg"}`}
                                className={cn("size-5", { "animate-spin": loading })}
                            />
                            <span className="p-16-semibold text-white">
                                {loading ? "Generating..." : "Generate Trip"}
                            </span>
                        </ButtonComponent>
                    </footer>
                </form>
            </section>
        </main>
    );
};

export default CreateTrip;
