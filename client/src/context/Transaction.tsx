import React, { useState, useEffect, useCallback } from "react";
import { contractABI, contractAddress } from "lib/constants";
import { ethers } from "ethers";
import { sanityClient } from "lib/sanity.client";
import { toast } from "react-toastify";
export const TransactionContext = React.createContext<
  Partial<{
    currentAccount: string;
    connectWallet: (metamask?: any) => Promise<void>;
    sendTransaction: (props: SendTransactionProp) => Promise<void>;
    loading: boolean;
  }>
>({});

let eth: any;
if (typeof window !== "undefined") {
  eth = window.ethereum;
}

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(eth);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );
  return transactionContract;
};
export interface SendTransactionProp {
  data: {
    addressTo: string;
    amount: string;
  };
  [key: string]: any;
}
export const TransactionProvider: React.FC = ({ children }): JSX.Element => {
  const [currentAccount, setCurrentAccount] = useState<string>();
  const [loading, setLoading] = useState<boolean>();

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  /**
   * Create user profile in sanity
   */
  useEffect(() => {
    if (!currentAccount) return;
    (async () => {
      const userDoc = {
        _type: "users",
        _id: currentAccount,
        username: "Unnamed",
        address: currentAccount,
      };
      await sanityClient.createIfNotExists(userDoc);
    })();
  }, [currentAccount]);
  const checkIfWalletIsConnected = async (metamask = eth) => {
    try {
      console.log("metamask", metamask);
      if (!metamask) return alert("Please install metamask");
      const accounts: string[] = await metamask.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      }
    } catch (err) {
      console.error(err);
      throw new Error("No ethereum object");
    }
  };

  const sendTransaction = useCallback(
    async ({
      metamask = eth,
      connectedAccount = currentAccount,
      data,
    }: SendTransactionProp) => {
      try {
        if (!metamask) return alert("Please install metamask");
        const { addressTo, amount } = data;
        console.log("data", data, "connectedAccount", connectedAccount);
        const transactionContract = getEthereumContract();
        const parsedAmount = ethers.utils.parseEther(amount);
        await metamask.request({
          method: "eth_sendTransaction",
          params: [
            {
              from: connectedAccount,
              to: addressTo,
              gas: "0x7EF40", // 0.1368 USD
              value: parsedAmount._hex,
            },
          ],
        });

        const transactionHash = await transactionContract.publishTransaction(
          addressTo,
          parsedAmount,
          `Transferring ETH ${parsedAmount} to ${addressTo}`,
          "TRANSFER"
        );
        setLoading(true);

        await transactionHash.wait();

        // DB
        await saveTransaction(
          transactionHash.hash,
          amount,
          connectedAccount,
          addressTo
        );
        setLoading(false);
      } catch (error: any) {
        console.error(error);
        toast.error(error.message);
      }
    },
    [currentAccount]
  );

  const saveTransaction = async (
    txHash: string,
    amount: string,
    fromAddress = currentAccount,
    toAddress: string
  ) => {
    const document = {
      _type: "transactions",
      _id: txHash,
      fromAddress,
      toAddress,
      timestamp: new Date(Date.now()).toISOString(),
      txHash: txHash,
      amount: parseFloat(amount),
    };
    await sanityClient.createIfNotExists(document);
    await sanityClient
      .patch(currentAccount as string)
      .setIfMissing({ transactions: [] })
      .insert("after", "transactions[-1]", [
        {
          _key: txHash,
          _ref: txHash,
          _type: "reference",
        },
      ])
      .commit();
    return;
  };
  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet: checkIfWalletIsConnected,
        sendTransaction,
        loading,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
