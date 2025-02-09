import {Delegatee} from "@lit-protocol/agent-wallet"

import dotenv from "dotenv";
dotenv.config();
import {ethers} from "ethers";
import { LIT_RPC, LIT_ABILITY } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { LocalStorage } from "node-localstorage";
import {
    LitAccessControlConditionResource,
    createSiweMessage,
    generateAuthSig,
  } from "@lit-protocol/auth-helpers";


console.log('process.env.ETHEREUM_PRIVATE_KEY',process.env.ETHEREUM_PRIVATE_KEY)
const ethersSigner = new ethers.Wallet(
    process.env.ETHEREUM_PRIVATE_KEY!,
    new ethers.providers.JsonRpcProvider(LIT_RPC.CHRONICLE_YELLOWSTONE)
);

const litNodeClient = new LitNodeClient({
    litNetwork: LIT_NETWORK.DatilTest,
    debug: false,
    storageProvider: {
        provider: new LocalStorage("../lit_storage.db"),
    },
});

export async function starSession() {

    await litNodeClient.connect();

    const sessionSignatures = await litNodeClient.getSessionSigs({
    chain: "ethereum",
    expiration: new Date(Date.now() + 1000 * 60 * 10 ).toISOString(), // 10 minutes
    //   capabilityAuthSigs: [capacityDelegationAuthSig], // Unnecessary on datil-dev
    resourceAbilityRequests: [
        {
        resource: new LitAccessControlConditionResource("*"),
        ability: LIT_ABILITY.AccessControlConditionDecryption,
        },
    ],
    authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
    }) => {
        const toSign = await createSiweMessage({
        uri,
        expiration,
        resources: resourceAbilityRequests,
        walletAddress: ethersSigner.address,
        nonce: await litNodeClient.getLatestBlockhash(),
        litNodeClient,
        });

        console.log("uri")
        console.log('walletAddress', ethersSigner.address)

        return await generateAuthSig({
        signer: ethersSigner,
        toSign,
        });
    },
    });

    console.log('sessionSignatures',sessionSignatures)
}
