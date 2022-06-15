import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { connector } from "../config/web3";
import { useCallback, useEffect, useState } from "react";

const Wallet = () => {
  const [balance, setBalance] = useState(0);
  const { 
    active,
    activate,
    deactivate,
    account,
    error,
    library
  } = useWeb3React();

  const isUnsupportedChain = error instanceof UnsupportedChainIdError;

  const connect = useCallback(() => {
    activate(connector);
    localStorage.setItem("walletConnected", "true");
  }, [activate]);

  const disconnect = () => {
    deactivate();
    localStorage.removeItem("walletConnected");
  };

  const getBalance = useCallback(async () => {
    const toSet = await library.eth.getBalance(account);
    setBalance((toSet / 1e18).toFixed(2));
  }, [library?.eth, account]);

  useEffect(() => {
    if (active) getBalance();
  }, [active, getBalance]);

  useEffect(() => {
    if (localStorage.getItem("walletConnected") === "true") connect();
  }, [connect]);

  if (active) {
    return (
      <div>
          💸 wallet connected {account}, now what!
          <br/>
          Balance: 🪙 {balance}
          <br/>
          <button onClick={disconnect}>
            Disconnect
          </button>
      </div>
    )

  } 
  return (
    <button
      onClick={connect}
      disabled={isUnsupportedChain}
    >
      {isUnsupportedChain ? "Unsupported Chain" : "Connect Wallet"}
    </button>
  );
}


export default Wallet;
