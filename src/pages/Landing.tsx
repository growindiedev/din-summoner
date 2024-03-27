
import { useDHConnect } from "@daohaus/connect";
import styled from "styled-components";
import { BiColumnLayout, Button, Link } from "@daohaus/ui";
import { Link as RouterLink } from "react-router-dom";
import { supportedNetorks } from "../main";
import { ADMIN_URL } from "../utils/constants";

const LinkButton = styled(RouterLink)`
  text-decoration: none;
`;

const ExternalLinkButton = styled(Link)`
  text-decoration: none;
  color: unset;
  &:hover {
    text-decoration: none;
  }
`;


const Landing = () => {
  const { chainId, isConnected } = useDHConnect();

  return (
    <>
      {chainId && chainId in supportedNetorks ? (
        <BiColumnLayout 
        subtitle="Welcome to the DIN summoner"
        title="DIN- Decentralized Information Netowrk"
        left={(
          <div>
            <h1>Create Topic Hub</h1>
            <p>
              Create a topic hub to organize and fund projects, events, and more.
            </p>
            <LinkButton to="/summon/topic">
              <Button variant="outline">Summon a Topic</Button>
            </LinkButton>
          </div>
        )}
          right={(
            <div>
              <h2>Create Personal Hub</h2>
              <p>
                The fun starts with your own personal hub.
              </p>
              <p>TODO: if a personal hub already exists display info and a link to it here, otherwise link to summon form. This may need to be queried through dao name or tag, and summoner</p>

              <LinkButton to={`/summon/personal`} >
                <Button variant="outline">Summon a Personal Hub</Button>
              </LinkButton>
              <ExternalLinkButton
                showExternalIcon={true}
                target="_blank"
                href={`${ADMIN_URL}`}
              >
                Continue To Topic List
              </ExternalLinkButton>
            </div>
          )}
        />

      ) :
        (
          <div>
            {!isConnected && (<><h1>Not Connected</h1>
              <p>
                Please connect your wallet to continue.
              </p>
            </>
            )}
            {isConnected && (
              <h1>Unsupported Network. Switch to sepolia</h1>
            )}
            <ExternalLinkButton
                showExternalIcon={true}
                target="_blank"
                href={`${ADMIN_URL}`}
              >
                Continue To Topic List
              </ExternalLinkButton>
          </div>)
      }

    </>

  );
};

export default Landing;
