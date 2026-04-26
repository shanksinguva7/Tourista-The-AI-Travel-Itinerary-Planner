import { Link, NavLink, useLoaderData, useNavigate } from "react-router";
import { sidebarItems } from "~/constants";
import { cn } from "~/lib/utils";
import { logoutUser } from "~/appwrite/auth";

const NavItems = ({ handleClick }: { handleClick?: () => void }) => {
    const user = useLoaderData() as any;
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logoutUser();
        navigate("/sign-in");
    };

    return (
        <section className="nav-items">
            <Link to="/" className="link-logo">
                <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
                <h1>Tourista</h1>
            </Link>

            <div className="container">
                <nav>
                    {sidebarItems.map(({ id, href, icon, label }) => (
                        <NavLink to={href} key={id} onClick={handleClick}>
                            {({ isActive }: { isActive: boolean }) => (
                                <div
                                    className={cn("group nav-item", {
                                        "bg-primary-100 !text-white": isActive,
                                    })}
                                >
                                    <img
                                        src={icon}
                                        alt={label}
                                        className={cn(
                                            "group-hover:brightness-0 size-5 group-hover:invert",
                                            { "brightness-0 invert": isActive }
                                        )}
                                    />
                                    {label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <footer className="nav-footer">
                    <img
                        src={user?.imageUrl || "/assets/images/david.webp"}
                        alt="user"
                        referrerPolicy="no-referrer"
                    />
                    <article>
                        <h2>{user?.name || "Guest"}</h2>
                        <p>{user?.email || ""}</p>
                    </article>
                    <button onClick={handleLogout} className="cursor-pointer">
                        <img src="/assets/icons/logout.svg" alt="logout" />
                    </button>
                </footer>
            </div>
        </section>
    );
};

export default NavItems;
