import React, { useState } from 'react';
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Cookie } from "../components/Cookie";
import Navbar from "../components/Navbar";
import ClickableCookie from "../components/ClickableCookie";

const CookiePage = () => {
  const currentAccount = useCurrentAccount();
  const [mintAmount, setMintAmount] = useState(0); // Manage mintAmount state here

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 mt-20">
        {currentAccount ? (
          <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
            <div className="flex flex-row items-center space-x-36">
              <div className="flex justify-center">
                <ClickableCookie setMintAmount={setMintAmount} /> {/* Pass setMintAmount as prop */}
              </div>
              <div className="flex justify-center">
                <Cookie mintAmount={mintAmount} setMintAmount={setMintAmount} /> {/* Pass mintAmount and setMintAmount as props */}
              </div>
            </div>
          </div>
        ) : (
          <h1 className="text-3xl font-bold mb-4 text-center">Please connect your wallet</h1>
        )}
      </div>
    </>
  );
}

export default CookiePage;
