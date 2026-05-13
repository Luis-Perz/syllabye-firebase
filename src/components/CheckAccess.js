import {Navigate} from "react-router-dom";
import { useRole } from "../hooks/useRole";

export function CheckAccess({children, allowedRoles}) {
    const { role, loading } = useRole();
    console.log(role)
    if (loading) return <div>Loading...</div>;
    if (!role) return <Navigate to="/unauthorizedaccess"/>;
    if (!allowedRoles.includes(role)) return <Navigate to="/unauthorizedaccess" />;

    return children;
}