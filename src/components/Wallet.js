import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { connector } from "../config/web3";
import { useCallback, useEffect, useState } from "react";
import useSpyDao from "../hooks/contracts"

const Wallet = () => {
  const spyDao = useSpyDao()
  // const [balance, setBalance] = useState(0);
  const [governanceTokenBalance, setGovernanceTokenBalance] = useState(0);
  const [hasMembership, setHasMembership] = useState();
  const [spyDaoMembershipImage, setSpyDaoMembershipImage] = useState();
  const [spyDaoGovernanceTokenImage, setSpyDaoGovernanceTokenImage] = useState();
  const {
    active,
    activate,
    deactivate,
    account,
    error,
    // library
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
    // const toSet = await library.eth.getBalance(account);
    const res = await spyDao.methods.balanceOfBatch([account, account], [1, 2]).call()
    setHasMembership(res[0] === '1')
    setGovernanceTokenBalance(res[1])
    // const res = await spyDao.methods.balanceOf(account, 0).call()
    
    console.log('res', res)
    // setBalance((toSet / 1e18).toFixed(2));
  }, [spyDao?.methods, account]);

  const getTokenImages = useCallback(async () => {
    const metaDataUriTemplate = await spyDao.methods.uri(0).call()
    setSpyDaoMembershipImage(metaDataUriTemplate.replace('{id}', '0000000000000000000000000000000000000000000000000000000000000001'))
    setSpyDaoGovernanceTokenImage(metaDataUriTemplate.replace('{id}', '0000000000000000000000000000000000000000000000000000000000000002'))
  }, [spyDao?.methods]);

  const onSubscribe = async () => {
    const res = await spyDao.methods.subscribe(account).send({
      from: account,
    }).call()
    console.log(account, res)
  };

  useEffect(() => {
    if (active) getBalance();
  }, [active, getBalance]);

  useEffect(() => {
    if (active) getTokenImages();
  }, [active, getTokenImages]);

  useEffect(() => {
    if (localStorage.getItem("walletConnected") === "true") connect();
  }, [connect]);

  if (active) {
    let membershipComponent=""
    if (!hasMembership) {
      return <div> Not a member yet <button onClick={onSubscribe}>Subscribe!</button></div>
    } else {
      membershipComponent = '🥳 You are a Member!'
    }
    return (
      <div>
        {membershipComponent}
        <br />
        💸 wallet connected, now what!
        <br />
        Governance Balance: 🪙 {governanceTokenBalance}
        <img src={spyDaoGovernanceTokenImage} alt={'governance token'}/>
        <br />
        membership batch
        <img src={spyDaoMembershipImage} alt={'membership'}/>
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
