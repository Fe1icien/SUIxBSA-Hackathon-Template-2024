// components/Navbar.js
import { Link } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100 fixed top-0 z-50 h-20 mb-4 pb-0">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl hover:scale-110 transition-transform duration-200">
          BSA x SUI Starter Pack
        </Link>
      </div>
      <div className="navbar-end">
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
