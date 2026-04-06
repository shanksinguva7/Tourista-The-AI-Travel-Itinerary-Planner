import { type RouteConfig, route, layout, index } from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    layout("routes/admin/Adminlayout.tsx", [
        route('dashboard', 'routes/admin/dashboard.tsx'),
        route('all-users', 'routes/admin/AllUsers.tsx')
    ])

] satisfies RouteConfig;