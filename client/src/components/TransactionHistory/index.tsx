import { TransactionContext } from "context";
import { sanityClient } from "lib/sanity.client";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { v4 as uuid } from "uuid";
const style = {
  wrapper: `h-full text-white select-none h-full w-screen flex-1 pt-14 flex items-end justify-end pb-12 overflow-scroll px-8`,
  txHistoryItem: `bg-[#191a1e] rounded-lg px-4 py-2 my-2 flex items-center justify-end`,
  txDetails: `flex items-center`,
  toAddress: `text-[#f48706] mx-2`,
  txTimestamp: `mx-2`,
  etherscanLink: `flex items-center text-[#2172e5]`,
};

const TransactionHistory: React.FC = (): JSX.Element => {
  const { loading, currentAccount } = useContext(TransactionContext);
  const [history, setHistory] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      if (!loading && currentAccount) {
        const query = `*[_type==users && _id == ${currentAccount}] {
        "transactionList": transactions[]->{amount, toAddress, timestamp, txHash}|order(timestamp desc)[0..4]
      }`;
        const clientRes = await sanityClient.fetch(query);
        setHistory(clientRes[0].transactionList);
      }
    })();
  }, []);
  return (
    <div className={style.wrapper}>
      <div>
        {history.map((item) => (
          <div className={style.txHistoryItem} key={uuid()}>
            <div className={style.txDetails}>
              <img
                src="/assets/images/eth.png"
                alt="ethereum"
                height={20}
                width={20}
              />
              {item.amount} sent to
              <span className={style.toAddress}>
                {item?.toAddress?.substring(0, 6)}
              </span>
            </div>{" "}
            on{" "}
            <div className={style.txTimestamp}>
              {new Date(item.timestamp).toLocaleString("en-NG", {
                hour12: true,
                timeStyle: "short",
                dateStyle: "long",
              })}
            </div>
            <div className={style.etherscanLink}>
              <a
                href={`https://rinkeby.etherscan.io/tx/${item.txHash}`}
                target={"_blank"}
                rel="noreferrer"
                className={style.etherscanLink}
              ></a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
