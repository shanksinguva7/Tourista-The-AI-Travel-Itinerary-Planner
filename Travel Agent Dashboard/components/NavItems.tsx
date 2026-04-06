import { Link, NavLink } from "react-router";
import { sidebarItems } from "~/constants";
import { cn } from "~/lib/utils";
const NavItems = ({ handleClick }: { handleClick: () => void }) => {
    const user = {
        name: 'Shashank',
        email: 'shashank.inguvawork@gmail.com',
        pfp: "/assets/images/david.webp"
    }
    return (
        <section className="nav-items">
            <Link to='/' className="link-logo">
                {/*The whole point of Link Tag is to bring you back to the homepage once you click on either the logo or the Toruisto name
             kind of similar to when you click on the Youtube logo you get back to your homepage. This is for faster reloads */}
                <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
                <h1>Tourista</h1>
            </Link>

            <div className="container">
                <nav>
                    {sidebarItems.map(({ id, href, icon, label }) => (
                        <NavLink to={href} key={id}>
                            {({ isActive }: { isActive: boolean }) => (
                                <div className={cn('group nav-item', { 'bg-primary-100 !text-white': isActive })}>
                                    <img
                                        src={icon}
                                        alt={label}
                                        className={`group-hover:brightness-0 size-0 group-hover:invert 
                                    ${isActive ? 'brightness-0 invert' : 'text-dark-200'}`} />

                                    {label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <footer className="nav-footer">
                    <img src={'/assets/images/pfp.jpg'} />
                    <article>
                        <h2> {user?.name}</h2>
                        <p>{user?.email}</p>
                    </article>
                    <button
                        onClick={() => {
                            console.log('Logout')
                        }}
                        className="cursor-pointer"
                    >
                        <img src='/assets/icons/logout.svg' />
                    </button>

                </footer>

            </div>
        </section>
    )
}
export default NavItems