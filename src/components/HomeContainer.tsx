import { DHLayout, useDHConnect } from "@daohaus/connect";
import { TXBuilder } from "@daohaus/tx-builder";
import { H4 } from "@daohaus/ui";
import { Outlet, useLocation } from "react-router-dom";
import { TARGET_DAO } from "../targetDao";
import { CurrentDaoProvider, useDaoData } from "@daohaus/moloch-v3-hooks";

export function HomeContainer() {
  const location = useLocation();
  const { provider, address } = useDHConnect();
  const { dao } = useDaoData({
    daoId: TARGET_DAO[import.meta.env.VITE_TARGET_KEY].ADDRESS,
    daoChain: TARGET_DAO[import.meta.env.VITE_TARGET_KEY].CHAIN_ID,
  });

  return (
    <DHLayout
      pathname={location.pathname}
      navLinks={[
        { label: "Home", href: `/` },
        { label: "Dao Overview", href: "/dao" },
        { label: "Safes", href: "/safes" },
        { label: "Settings", href: "/settings" },
      ]}
      leftNav={<H4>{dao?.name}</H4>}
    >
      <CurrentDaoProvider
        targetDao={{
          daoChain: TARGET_DAO[import.meta.env.VITE_TARGET_KEY].CHAIN_ID,
          daoId: TARGET_DAO[import.meta.env.VITE_TARGET_KEY].ADDRESS,
        }}
      >
        <TXBuilder
          provider={provider}
          chainId={TARGET_DAO[import.meta.env.VITE_TARGET_KEY].CHAIN_ID}
          daoId={TARGET_DAO[import.meta.env.VITE_TARGET_KEY].ADDRESS}
          safeId={TARGET_DAO[import.meta.env.VITE_TARGET_KEY].SAFE_ADDRESS}
          appState={{ dao, memberAddress: address }}
        >
          <Outlet />
        </TXBuilder>
      </CurrentDaoProvider>
    </DHLayout>
  );
}

export default HomeContainer;
