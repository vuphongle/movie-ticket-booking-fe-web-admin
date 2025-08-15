import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import ForbiddenPage from "@components/errors/ErrorPage";
import type { RootState } from "@app/Store";
import { useTranslation } from "react-i18next";

interface AuthorizeRoutesProps {
  requireRoles: string[];
}

function AuthorizeRoutes({ requireRoles }: AuthorizeRoutesProps) {
  const auth = useSelector((state: RootState) => state.auth);
  const role = auth.auth?.role;
  const { t } = useTranslation();

  const canAccess = role && requireRoles.includes(role);
  if (!canAccess) {
    return (
      <ForbiddenPage
        error={{ status: "403", data: { message: t("FORBIDDEN") } }}
      />
    );
  }

  return <Outlet />;
}

export default AuthorizeRoutes;
