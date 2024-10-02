import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function OnlyAdminPrivateRoute() {
  const { currUser } = useSelector((state) => state.user);
  return currUser && currUser?.user.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to='/login' />
  );
}