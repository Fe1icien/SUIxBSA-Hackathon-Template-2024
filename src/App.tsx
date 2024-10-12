import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CookiePage from './pages/CookiePage';

function App() {
  const currentAccount = useCurrentAccount();
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
    <BrowserRouter>
      <Routes>
        {/* Set the root path to CookiePage */}
        <Route path="/" element={<CookiePage />} />
        {/* Retain other routes if necessary */}
        {/* <Route path="/Contract" element={<Contract />} /> */}
        <Route path="/Cookie" element={<CookiePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
