import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { TransactionBlock } from "@mysten/sui/transactions';
import { useNetworkVariable } from "../../networkConfig";
import { useState } from "react";

export function Token() {
  const tokenPackageId = useNetworkVariable("counterPackageId");
  const currentAccount = useCurrentAccount();
  const [mintAmount, setMintAmount] = useState("");

  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  const { data: treasuryCapData, isPending, error } = useSuiClientQuery("getOwnedObjects", {
    owner: currentAccount?.address ?? "",
    filter: {
      StructType: `${tokenPackageId}::my_coin::TreasuryCap<${tokenPackageId}::my_coin::MY_COIN>`
    },
    options: {
      showContent: true,
    },
  });

  const mint = () => {
    if (!treasuryCapData?.data?.[0]?.data?.objectId) {
      console.error("TreasuryCap not found");
      return;
    }

    const tx = new TransactionBlock();

    tx.moveCall({
      target: `${tokenPackageId}::my_coin::mint`,
      arguments: [
        tx.object(treasuryCapData.data[0].data.objectId),
        tx.pure(mintAmount),
        tx.pure(currentAccount?.address),
      ],
    });

    signAndExecute({
      transaction: tx,
    }, {
      onSuccess: () => {
        console.log("Minted successfully");
        setMintAmount("");
      },
    });
  };

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="max-w-md mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb-4">MY_COIN Minter</h1>
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
          disabled={!currentAccount || !treasuryCapData?.data?.[0]?.data?.objectId}
        >
          Mint
        </button>
      </div>
    </div>
  );
}
