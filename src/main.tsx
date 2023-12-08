import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import { DHConnectProvider } from "@daohaus/connect";
import { HausThemeProvider } from "@daohaus/ui";
import { HAUS_NETWORK_DATA } from "@daohaus/keychain-utils";

import { Routes } from "./Routes";

import "./App.css";

// import { Buffer } from "buffer";
// // This solves an issue when using WalletConnect and intercept Txs to create dao proposals
// // Related open issue: https://github.com/WalletConnect/walletconnect-monorepo/issues/748
// window.Buffer = window.Buffer || Buffer;

const supportedNetorks = {
  "0x5": HAUS_NETWORK_DATA["0x5"],
  // "0x1": HAUS_NETWORK_DATA["0x1"],
  "0xa": HAUS_NETWORK_DATA["0xa"],
};

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <DHConnectProvider networks={supportedNetorks}>
          <HausThemeProvider>
            <Routes />
          </HausThemeProvider>
        </DHConnectProvider>
      </QueryClientProvider>
    </HashRouter>
  </React.StrictMode>
);
