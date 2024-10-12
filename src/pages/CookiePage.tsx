import React from 'react';
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Cookie } from "../components/Cookie";
import Navbar from "../components/Navbar";

const CookiePage = () => {
  const currentAccount = useCurrentAccount();

  return (
    <>
      <Navbar/>
      <div className="max-w-7xl mx-auto p-4 mt-20">
        <div className="flex justify-center">
          {currentAccount ? (
            <Cookie />
          ) : (
            <h1 className="text-3xl font-bold mb-4">Please connect your wallet</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default CookiePage;
