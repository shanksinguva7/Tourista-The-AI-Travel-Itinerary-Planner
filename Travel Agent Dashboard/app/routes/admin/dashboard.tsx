import { Header, StatsCard, TripCard } from "components";
import { getUser, getAllUsers } from "~/appwrite/auth";
import {
    getUsersAndTripsStats,
    getUserGrowthPerDay,
    getTripsByTravelStyle,
} from "~/appwrite/dashboard";
import { getAllTrips } from "~/appwrite/trips";
import { parseTripData, formatDate } from "~/lib/utils";
import { userXAxis, useryAxis, tripXAxis, tripyAxis } from "~/constants";
import {
    ChartComponent,
    SeriesCollectionDirective,
    SeriesDirective,
    Inject,
    ColumnSeries,
    SplineAreaSeries,
    Legend,
    Tooltip,
    Category,
} from "@syncfusion/ej2-react-charts";
import { GridComponent, ColumnsDirective, ColumnDirective } from "@syncfusion/ej2-react-grids";

export const clientLoader = async () => {
    const [user, dashboardStats, { allTrips }, userGrowth, tripsByTravelStyle, { users }] =
        await Promise.all([
            getUser(),
            getUsersAndTripsStats(),
            getAllTrips(4, 0),
            getUserGrowthPerDay(),
            getTripsByTravelStyle(),
            getAllUsers(4, 0),
        ]);

    return {
        user,
        dashboardStats,
        allTrips: allTrips.map(({ $id, tripDetails, imageUrls }: any) => ({
            id: $id,
            ...parseTripData(tripDetails),
            imageUrls: imageUrls ?? [],
        })),
        userGrowth,
        tripsByTravelStyle,
        users,
    };
};

const Dashboard = ({ loaderData }: any) => {
    const { user, dashboardStats, allTrips, userGrowth, tripsByTravelStyle, users } = loaderData;
    const { totalUsers, usersJoined, totalTrips, tripsCreated, userRole } = dashboardStats;

    const trips = allTrips as unknown as Trip[];

    const usersItineraryCount: UsersItineraryCount[] = (users || []).map((u: any) => ({
        imageUrl: u.imageUrl || "/assets/images/david.webp",
        name: u.name || "Guest",
        count: u.itineraryCreated || Math.floor(Math.random() * 5),
    }));

    const tripsInterest: TripsInterest[] = trips.map((trip) => ({
        imageUrl: trip.imageUrls?.[0] || "",
        name: trip.name || "Unnamed Trip",
        interest: trip.interests || "N/A",
    }));

    return (
        <main className="dashboard wrapper">
            <Header
                title={`Hello ${(user as any)?.name ?? "Guest"}`}
                description="Track activity, trends, and popular destinations in real time"
            />

            <section className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                    <StatsCard
                        headerTitle="Total Users"
                        total={totalUsers}
                        currentMonthCount={usersJoined.currentMonth}
                        lastMonthCount={usersJoined.lastMonth}
                    />
                    <StatsCard
                        headerTitle="Total Trips"
                        total={totalTrips}
                        currentMonthCount={tripsCreated.currentMonth}
                        lastMonthCount={tripsCreated.lastMonth}
                    />
                    <StatsCard
                        headerTitle="Active Users"
                        total={userRole.total}
                        currentMonthCount={userRole.currentMonth}
                        lastMonthCount={userRole.lastMonth}
                    />
                </div>
            </section>

            <section className="container">
                <h1>Created Trips</h1>
                <div className="trip-grid">
                    {trips.map((trip) => (
                        <TripCard
                            key={trip.id}
                            id={trip.id}
                            name={trip.name}
                            imageUrl={trip.imageUrls[0]}
                            location={trip.itinerary?.[0]?.location ?? ""}
                            tags={[trip.interests, trip.travelStyle]}
                            price={trip.estimatedPrice}
                        />
                    ))}
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-20 shadow-400 p-6 flex flex-col gap-4">
                    <h2 className="p-18-semibold text-dark-100">User Growth</h2>
                    <ChartComponent
                        primaryXAxis={userXAxis}
                        primaryYAxis={useryAxis}
                        tooltip={{ enable: true }}
                        legendSettings={{ visible: true }}
                        height="300"
                    >
                        <Inject
                            services={[
                                ColumnSeries,
                                SplineAreaSeries,
                                Legend,
                                Tooltip,
                                Category,
                            ]}
                        />
                        <SeriesCollectionDirective>
                            <SeriesDirective
                                dataSource={userGrowth}
                                xName="day"
                                yName="count"
                                type="Column"
                                name="Users"
                                fill="#175cd3"
                                opacity={0.9}
                            />
                            <SeriesDirective
                                dataSource={userGrowth}
                                xName="day"
                                yName="count"
                                type="SplineArea"
                                name="Growth"
                                fill="rgba(23, 92, 211, 0.2)"
                                border={{ color: "#175cd3", width: 2 }}
                            />
                        </SeriesCollectionDirective>
                    </ChartComponent>
                </div>

                <div className="bg-white rounded-20 shadow-400 p-6 flex flex-col gap-4">
                    <h2 className="p-18-semibold text-dark-100">Trip Trends</h2>
                    <ChartComponent
                        primaryXAxis={tripXAxis}
                        primaryYAxis={tripyAxis}
                        tooltip={{ enable: true }}
                        legendSettings={{ visible: true }}
                        height="300"
                    >
                        <Inject services={[ColumnSeries, Legend, Tooltip, Category]} />
                        <SeriesCollectionDirective>
                            <SeriesDirective
                                dataSource={tripsByTravelStyle}
                                xName="travelStyle"
                                yName="count"
                                type="Column"
                                name="Trips"
                                fill="#175cd3"
                                opacity={0.9}
                            />
                        </SeriesCollectionDirective>
                    </ChartComponent>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-20 shadow-400 p-6 flex flex-col gap-4">
                    <h2 className="p-18-semibold text-dark-100">Latest User Signups</h2>
                    <GridComponent dataSource={usersItineraryCount} gridLines="None">
                        <ColumnsDirective>
                            <ColumnDirective
                                field="name"
                                headerText="Name"
                                width="160"
                                textAlign="Left"
                                template={(props: UsersItineraryCount) => (
                                    <div className="flex items-center gap-1.5 px-2">
                                        <img
                                            src={props.imageUrl}
                                            alt="user"
                                            className="rounded-full size-8 aspect-square object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                        <span className="text-sm text-dark-100">{props.name}</span>
                                    </div>
                                )}
                            />
                            <ColumnDirective
                                field="count"
                                headerText="Trips Created"
                                width="120"
                                textAlign="Left"
                            />
                        </ColumnsDirective>
                    </GridComponent>
                </div>

                <div className="bg-white rounded-20 shadow-400 p-6 flex flex-col gap-4">
                    <h2 className="p-18-semibold text-dark-100">Trips Based on Interests</h2>
                    <GridComponent dataSource={tripsInterest} gridLines="None">
                        <ColumnsDirective>
                            <ColumnDirective
                                field="name"
                                headerText="Trip"
                                width="160"
                                textAlign="Left"
                                template={(props: TripsInterest) => (
                                    <div className="flex items-center gap-1.5 px-2">
                                        {props.imageUrl && (
                                            <img
                                                src={props.imageUrl}
                                                alt="trip"
                                                className="rounded-lg size-8 aspect-square object-cover"
                                            />
                                        )}
                                        <span className="text-sm text-dark-100 line-clamp-1">
                                            {props.name}
                                        </span>
                                    </div>
                                )}
                            />
                            <ColumnDirective
                                field="interest"
                                headerText="Interest"
                                width="120"
                                textAlign="Left"
                            />
                        </ColumnsDirective>
                    </GridComponent>
                </div>
            </section>
        </main>
    );
};

export default Dashboard;
