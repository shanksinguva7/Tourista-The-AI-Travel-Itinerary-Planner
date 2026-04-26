import { Link, useLocation } from "react-router";
import {
    ChipDirective,
    ChipListComponent,
    ChipsDirective,
} from "@syncfusion/ej2-react-buttons";
import { cn, getFirstWord } from "~/lib/utils";

const TripCard = ({ id, name, location, imageUrl, tags, price }: TripCardProps) => {
    const currentLocation = useLocation();
    const isAdminRoute = !currentLocation.pathname.startsWith("/travel");

    return (
        <Link to={isAdminRoute ? `/trips/${id}` : `/travel/${id}`} className="trip-card flex">
            <img src={imageUrl} alt={name} />

            <article>
                <h2>{name}</h2>

                <figure>
                    <img
                        src="/assets/icons/location-mark.svg"
                        alt="location"
                        className="size-4"
                    />
                    <figcaption>{location}</figcaption>
                </figure>

                <div className="flex items-center justify-between mt-1 pb-4 pl-0 pr-0">
                    <ChipListComponent id={`chip-${id}`}>
                        <ChipsDirective>
                            {tags.map((tag, i) => (
                                <ChipDirective
                                    key={i}
                                    text={getFirstWord(tag)}
                                    cssClass={cn(
                                        "!text-xs",
                                        i === 1
                                            ? "!bg-pink-50 !text-pink-500"
                                            : "!bg-success-50 !text-success-700"
                                    )}
                                />
                            ))}
                        </ChipsDirective>
                    </ChipListComponent>

                    <p className="price-pill">{price}</p>
                </div>
            </article>
        </Link>
    );
};

export default TripCard;
