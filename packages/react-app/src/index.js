import "./index.css";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { DAppProvider, Mainnet, Goerli, Localhost } from "@usedapp/core";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

// IMPORTANT, PLEASE READ
// To avoid disruptions in your app, change this to your own Infura project id.
// https://infura.io/register
// const INFURA_PROJECT_ID = "b939125df2104f29a33ad6e97bc6d456";
// const config = {
// readOnlyChainId: Mainnet.chainId,
//   readOnlyUrls: {
//     [Mainnet.chainId]: "https://mainnet.infura.io/v3/" + INFURA_PROJECT_ID,
//     [Goerli.chainId]: "https://goerli.infura.io/v3/" + INFURA_PROJECT_ID
//   },
// }

const config = {
  readOnlyChainId: Localhost.chainId,
  readOnlyUrls: {
    [Localhost.chainId]: 'http://127.0.0.1:8545',
  },
  multicallAddresses: {
    [Localhost.chainId]: "0xa6dF0C88916f3e2831A329CE46566dDfBe9E74b7",
  }
}
// You should replace this url with your own and put it into a .env file
// See all subgraphs: https://thegraph.com/explorer/
// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   uri: "https://api.studio.thegraph.com/query/36698/qlvt/0.0.1",
// });

ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={config}>
      {/* <ApolloProvider client={client}> */}
        <App />
      {/* </ApolloProvider> */}
    </DAppProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);
