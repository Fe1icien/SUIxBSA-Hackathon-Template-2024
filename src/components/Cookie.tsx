import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { useNetworkVariable } from "../networkConfig";
import { TREASURY_CAP_OBJECT_ID } from "../constants";
import { useState, useEffect } from "react";

export function Cookie({ mintAmount, setMintAmount }) {
  const cookiePackageId = useNetworkVariable("counterPackageId");
  const [balance, setBalance] = useState<number | null>(null);
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const mint = () => {
    if (!mintAmount || parseInt(mintAmount) <= 0) {
      console.error("Please enter a valid amount to mint");
      return;
    }

    const tx = new Transaction();

    tx.moveCall({
      target: `${cookiePackageId}::cookie::mint`,
      arguments: [
        tx.object(TREASURY_CAP_OBJECT_ID), // TreasuryCap
        tx.pure.u64(parseInt(mintAmount)),
        tx.pure.address(currentAccount?.address),
      ],
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: () => {
          console.log("Minted successfully");
          setMintAmount(0); // Reset mintAmount after minting
          fetchBalance(); // Refresh balance after minting
        },
        onError: (error) => {
          console.error("Error during minting:", error);
        },
      }
    );
  };

  const get_balance = async (): Promise<number> => {
    if (!currentAccount?.address) {
      console.error("No connected account found");
      return 0;
    }

    try {
      // Create a transaction to call the get_balance function
      const tx = new Transaction();

      tx.moveCall({
        target: `${cookiePackageId}::cookie::get_balance`,
        typeArguments: [],
        arguments: [
          tx.pure.address(currentAccount.address),
          tx.object(TREASURY_CAP_OBJECT_ID), // Assuming COOKIE struct is tied to TreasuryCap
        ],
      });

      const response = await suiClient.executeTransactionBlock({
        transactionBlock: tx,
        options: {
          showEffects: true,
          showEvent: true,
        },
      });

      // Parse the returned balance from the transaction effects or events
      // This depends on how the get_balance function returns data
      // For simplicity, assume it emits an event with the balance

      // Implement event parsing logic here
      // This is a placeholder as actual implementation may vary
      const balance = 0; // Replace with actual parsing

      return balance;
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      return 0;
    }
  };

  const fetchBalance = async () => {
    if (!currentAccount?.address) {
      console.error("No connected account found");
      return;
    }

    try {
      const coins = await suiClient.getCoins({
        owner: currentAccount.address,
        coinType: `${cookiePackageId}::cookie::COOKIE`,
      });

      if (coins && coins.data && Array.isArray(coins.data)) {
        const totalBalance = coins.data.reduce((sum, coin) => sum + BigInt(coin.balance), 0n);
        setBalance(Number(totalBalance));
      } else {
        console.error("Unexpected response format from getCoins");
        setBalance(0);
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setBalance(0);
    }
  };

  useEffect(() => {
    if (currentAccount?.address) {
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  const buyUpgrade = async (amountToBurn: number) => {
    const cookieObjects = await suiClient.getCoins({
      owner: currentAccount.address,
      coinType: `${cookiePackageId}::cookie::COOKIE`,
    });

    if (!cookieObjects || !cookieObjects.data || cookieObjects.data.length === 0) {
      console.error("No COOKIE objects found");
      return;
    }

    console.log("Retrieved COOKIE objects:", cookieObjects);
    let totalAvailable = 0n;
    const objectsToBurn = [];

    for (const coin of cookieObjects.data) {
      console.log("Coin object:", coin);
      const coinBalance = BigInt(coin.balance);
      totalAvailable += coinBalance;
      objectsToBurn.push({
        objectId: coin.coinObjectId,
        balance: coinBalance,
      });
    }
    console.log("Amount to Burn:", amountToBurn);
    const amountToBurnBigInt = BigInt(amountToBurn);
    if (totalAvailable < amountToBurnBigInt) {
      console.error("Insufficient COOKIE balance");
      return;
    }

    const tx = new TransactionBlock();
    let amountRemaining = amountToBurnBigInt;

    for (const { objectId, balance } of objectsToBurn) {
      if (amountRemaining <= 0n) break;

      const amountToUse = amountRemaining > balance ? balance : amountRemaining;

      console.log(`Burning ${amountToUse} from objectId: ${objectId}`);

      tx.moveCall({
        target: `${cookiePackageId}::cookie::burn`,
        arguments: [
          tx.object(TREASURY_CAP_OBJECT_ID),
          tx.object(objectId),
          tx.pure.u64(Number(amountToUse)),
        ],
      });

      amountRemaining -= amountToUse;
    }

    // Create a move call to mint the upgrade
    tx.moveCall({
      target: `${cookiePackageId}::upgrade::mint_upgrade`,
      arguments: [
        tx.object(TREASURY_CAP_OBJECT_ID),
        tx.pure.u64(amountToBurn),
        tx.pure.string("Upgrade Name"),
        tx.pure.u64(2),
        tx.pure.string("image_url"),
      ],
    });

    console.log("Transaction to be executed:", tx);

    try {
      const result = await signAndExecute({
        transaction: tx,
      });

      console.log("Transaction result:", result);

      if (result && result.digest) {
        console.log("Upgrade purchased successfully. Transaction digest:", result.digest);
        fetchBalance();
      } else {
        console.error("Transaction executed but returned an unexpected result:", result);
      }
    } catch (error) {
      console.error("Error purchasing upgrade:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Cookie Minter</h1>
      <div className="flex flex-col gap-2">
        <div className="mb-4">
          <strong>Current Balance:</strong>{" "}
          {balance !== null ? `${balance} COOKIE` : "Loading..."}
          {mintAmount > 0 && (
            <span style={{ color: '#1E90FF', fontWeight: 'bold' }}> + {mintAmount}</span>
          )}
        </div>
        <button
          className="btn btn-primary w-full"
          onClick={mint}
        >
          Mint
        </button>
        <button
          className="btn btn-secondary w-full mt-4"
          onClick={() => buyUpgrade(1)} // Pass a fixed amount or use a state variable
        >
          Buy Upgrade (1 COOKIE)
        </button>
      </div>
    </div>
  );
}
