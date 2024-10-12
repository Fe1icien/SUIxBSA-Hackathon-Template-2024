import { useSignAndExecuteTransaction, useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "../networkConfig";
import { TREASURY_CAP_OBJECT_ID } from "../constants";
import { useState } from "react";

export function Cookie() {
  const cookiePackageId = useNetworkVariable("counterPackageId");
  const [mintAmount, setMintAmount] = useState("");
  const currentAccount = useCurrentAccount();
  const suiClient = useSuiClient();

  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showEffects: true,
        },
      }),
  });

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
          setMintAmount("");
        },
        onError: (error) => {
          console.error("Error during minting:", error);
        },
      }
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-4">Cookie Minter</h1>
      <div className="flex flex-col gap-2">
        <input
          type="number"
          value={mintAmount}
          onChange={(e) => setMintAmount(e.target.value)}
          placeholder="Amount to mint"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          className="btn btn-primary w-full"
          onClick={mint}
        >
          Mint
        </button>
      </div>
    </div>
  );
}
