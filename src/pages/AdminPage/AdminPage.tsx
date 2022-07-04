import "./admin-page.scss";
import { FC, useEffect } from "react";
import storeAdmin, {
  StoreAdminContext,
} from "../../services/store/AdminPage/storeAdmin";
import { SignOut } from "../../components/SignOut";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { TopNavigationBar } from "../../components/TopNavigationBar";

export const AdminPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      location.pathname.endsWith("admin/") ||
      location.pathname.endsWith("admin")
    ) {
      navigate("./new");
    }
  }, [location.pathname]);

  return (
    <StoreAdminContext.Provider value={storeAdmin}>
      <div className="admin-page">
        <TopNavigationBar>
          <SignOut />
        </TopNavigationBar>

        <Outlet />
      </div>
    </StoreAdminContext.Provider>
  );
};
