import React, { useContext, useMemo, useState } from "react";
import { FiArrowUpRight } from "react-icons/fi";
import { AiOutlineDown } from "react-icons/ai";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { TransactionContext } from "context";
import { v4 as uuid } from "uuid";

// Header
const style = {
  wrapper: `p-4 w-screen flex justify-between items-center`,
  headerLogo: `flex w-1/4 items-center justify-start`,
  nav: `flex-1 flex justify-center items-center`,
  navItemsContainer: `flex bg-[#191B1F] rounded-3xl`,
  navItem: `px-4 py-2 m-1 flex items-center text-lg font-semibold text-[0.9rem] cursor-pointer rounded-3xl`,
  activeNavItem: `bg-[#20242A]`,
  buttonsContainer: `flex w-1/4 justify-end items-center`,
  button: `flex items-center bg-[#191B1F] rounded-2xl mx-2 text-[0.9rem] font-semibold cursor-pointer`,
  buttonPadding: `p-2`,
  buttonTextContainer: `h-8 flex items-center`,
  buttonIconContainer: `flex items-center justify-center w-8 h-8`,
  buttonAccent: `bg-[#172A42] border border-[#163256] hover:border-[#234169] h-full rounded-2xl flex items-center justify-center text-[#4F90EA]`,
};

type NavItemOptionType = "swap" | "pool" | "vote" | "charts";

const Header: React.FC = (): JSX.Element => {
  const [selectedNav, setSelectedNav] = useState<NavItemOptionType>();
  const { connectWallet, currentAccount } = useContext(TransactionContext);
  console.log({ connectWallet, currentAccount });
  const navOptions: { type: "link" | "item"; value: NavItemOptionType }[] =
    useMemo(() => {
      return [
        { type: "item", value: "pool" },
        { type: "item", value: "swap" },
        { type: "item", value: "vote" },
        { type: "link", value: "charts" },
      ];
    }, []);
  const username =
    currentAccount &&
    `${currentAccount?.slice(0, 7)} ... ${currentAccount?.slice(35)}`;
  return (
    <div className={style.wrapper}>
      <div className={style.headerLogo}>
        <img
          src="/assets/images/uniswap.png"
          alt="Uniswap"
          height={40}
          width={40}
        />
      </div>
      <div className={style.nav}>
        <div className={style.navItemsContainer}>
          {navOptions.map((item) => {
            if (item.type === "item")
              return (
                <div
                  key={uuid()}
                  onClick={() => setSelectedNav(item.value)}
                  className={`${style.navItem} ${
                    selectedNav === item.value && style.activeNavItem
                  }`}
                >
                  {item.value}
                </div>
              );
            if (item.value === "charts")
              return (
                <a
                  key={uuid()}
                  href="https://info.uniswap/org/#/"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <div className={style.navItem}>
                    Charts <FiArrowUpRight />
                  </div>
                </a>
              );
            return null;
          })}
        </div>
      </div>
      <div className={style.buttonsContainer}>
        <div className={`${style.button} ${style.buttonPadding}`}>
          <div className={style.buttonIconContainer}>
            <img
              src="/assets/images/eth.png"
              alt="eth logo"
              height={20}
              width={20}
            />
          </div>
          <p>Ethereum</p>
          <div className={style.buttonIconContainer}>
            <AiOutlineDown />
          </div>
        </div>
        {currentAccount ? (
          <div className={`${style.button} ${style.buttonPadding}`}>
            <div className={style.buttonTextContainer}>{username}</div>
          </div>
        ) : (
          <div
            onClick={() => connectWallet && connectWallet()}
            className={`${style.button} ${style.buttonPadding}`}
          >
            <div className={`${style.buttonAccent} ${style.buttonPadding}`}>
              Connect Wallet"
            </div>
          </div>
        )}
        <div className={`${style.button} ${style.buttonPadding}`}>
          <div className={`${style.buttonIconContainer} mx-2`}>
            <HiOutlineDotsVertical />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
