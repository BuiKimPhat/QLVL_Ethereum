import { useQuery } from "@apollo/client";
import { Contract } from "@ethersproject/contracts";
import { shortenAddress, useCall, useEthers, useLookupAddress, useEtherBalance, Localhost } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import { formatEther } from '@ethersproject/units';

import { Body, Button, Container, Header, Image, Link } from "./components";
import logo from "./ethereumLogo.png";

function WalletButton() {
  const [rendered, setRendered] = useState("");

  const { ens } = useLookupAddress();
  const { account, activateBrowserWallet, deactivate, error } = useEthers({ chainId: Localhost.chainId });

  useEffect(() => {
    if (ens) {
      setRendered(ens);
    } else if (account) {
      setRendered(shortenAddress(account));
    } else {
      setRendered("");
    }
  }, [account, ens, setRendered]);

  useEffect(() => {
    if (error) {
      console.error("Error while connecting wallet:", error.message);
    }
  }, [error]);

  return (
    <Button
      onClick={() => {
        if (!account) {
          activateBrowserWallet();
        } else {
          deactivate();
        }
      }}
    >
      {rendered === "" && "Connect Wallet"}
      {rendered !== "" && rendered}
    </Button>
  );
}

function App(props) {
  const { account, deactivate, chainId } = useEthers()
  const etherBalance = useEtherBalance(account)
  console.log("acc " + account)
  console.log(etherBalance)
  // if (!props.config.readOnlyUrls[chainId]) {
  //   return <p>Please use either Mainnet or Goerli testnet.</p>
  // }
  return (
    <Container>
      <Header>
        <WalletButton />
      </Header>
      <Body>
        {/* Remove the "hidden" prop and open the JavaScript console in the browser to see what this function does */}
        {/* <Button onClick={() => readOnChainData()}>
          Read On-Chain Balance
        </Button> */}
        <Image src={logo} alt="ethereum-logo" />
        <p>
          Edit <code>packages/react-app/src/App.js</code> and save to reload.
        </p>
        <Link href="https://reactjs.org">
          Learn React
        </Link>
        <Link href="https://usedapp.io/">Learn useDapp</Link>
        <Link href="https://thegraph.com/docs/quick-start">Learn The Graph</Link>
        {etherBalance && (
        <div className="balance">
          <br />
          Balance:
          <p className="bold">{formatEther(etherBalance)}</p>
        </div>
      )}
      </Body>
    </Container>
  );
}

export default App;
