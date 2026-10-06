import {Navigate} from "react-router-dom";
import { useRole } from "../hooks/useRole";


export function CheckAccess({children, allowedRoles}) {
    const { role, loading } = useRole();
    if (loading) return <div>Loading...</div>;
    if (!role) return <Navigate to="/" replace/>;
    if (!allowedRoles.includes(role)) return <Navigate to="/unauthorizedaccess" />;

    return children;
}