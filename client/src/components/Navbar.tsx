import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <div className="container mx-auto ">
        <nav className="flex gap-6 mt-4 rounded items-center py-4 border-b border-black justify-between">
          <div className="logo">
            <NavLink to={`/login`} className={`text-xl font-black`}>
              AltBlog
            </NavLink>
          </div>
          <div className="flex gap-6 items-center">
            <NavLink to={`/login`} className={`text-xl font-medium`}>
              Login
            </NavLink>
            <NavLink
              to={`/register`}
              className={`border-black border text-xl font-medium p-4 rounded-md hover:bg-slate-950 hover:text-slate-50`}
            >
              Create an Account
            </NavLink>
          </div>
          <div className="mobile__menu md:hidden  ">
            <p>Hi</p>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
