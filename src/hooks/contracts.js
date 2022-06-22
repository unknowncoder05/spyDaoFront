import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import SpyDaoArtifact from "../config/web3/artifacts/SpyDao";

const { address, abi } = SpyDaoArtifact;

const useSpyDao = () => {
  const { active, library, chainId } = useWeb3React();

  const contract = useMemo(() => {
    if (active) return new library.eth.Contract(abi, address[chainId]);
  }, [active, chainId, library?.eth?.Contract]);

  return contract;
};

export default useSpyDao;
