//@ts-nocheck

import { Link } from "react-router"
import { SidebarComponent } from "@syncfusion/ej2-react-navigations"
import NavItems from "./NavItems"
const MobileSidebar = () => {
    let sidebar: SidebarComponent;
    const toggleSidebar = () => {
        sidebar.toggle();
    }
    return (

        <div className="mobile-sidebar wrapper">
            <header>
                <Link to="/">
                    <img src="/assets/icons/logo.svg"
                        alt="logo"
                        className="size-[30px]" />
                    <h1> Tourista</h1>
                </Link>
                <button onClick={toggleSidebar}>
                    <img src="/assets/icons/menu.svg" alt="menu" />
                </button>
            </header>
            <SidebarComponent
                width={270}
                ref={(Sidebar) => Sidebar = sidebar}
                created={() => sidebar.hide()}
                closeOnDocumentClick={true}
                showBacdrop={true}
                type="over"
            >
                <NavItems handleClick={toggleSidebar} />
            </SidebarComponent>
        </div>
    )
}

export default MobileSidebar