import {Admin,Delegatee, AdminConfig, AgentConfig,listAllTools, getToolByName} from "@lit-protocol/agent-wallet"
import { LIT_NETWORK } from "@lit-protocol/constants";
import { LitNodeClient } from "@lit-protocol/lit-node-client";
const adminConfig: AdminConfig = {
    type: "eoa",
    privateKey: process.env.ETHEREUM_PRIVATE_KEY
};
const agentConfig: AgentConfig = {
    litNetwork: "datil-dev",
};

let admin: Admin;

/**
 * 新しいDelegateeを追加する関数
 * @param pkpTokenId - PKPのトークンID
 * @param delegateeAddress - 追加するDelegateeのアドレス
 */
async function addNewDelegatee(pkpTokenId: string, delegateeAddress: string) {
    try {
        const tx = await admin.addDelegatee(pkpTokenId, delegateeAddress);
        console.log("Delegatee追加成功:", tx);
        return tx;
    } catch (error) {
        console.error("Delegatee追加エラー:", error);
        throw error;
    }
}

/**
 * Delegateeにツールの使用を許可する関数
 * @param pkpTokenId - PKPのトークンID
 * @param toolIpfsCid - ツールのIPFS CID
 * @param delegateeAddress - Delegateeのアドレス
 */
async function permitToolToDelegatee(pkpTokenId: string, toolIpfsCid: string, delegateeAddress: string) {
    try {
        const tx = await admin.permitToolForDelegatee(pkpTokenId, toolIpfsCid, delegateeAddress);
        console.log("ツール許可成功:", tx);
        return tx;
    } catch (error) {
        console.error("ツール許可エラー:", error);
        throw error;
    }
}

/**
 * Delegateeを削除する関数
 * @param pkpTokenId - PKPのトークンID
 * @param delegateeAddress - 削除するDelegateeのアドレス
 */
async function removeDelegateeFromPkp(pkpTokenId: string, delegateeAddress: string) {
    try {
        const tx = await admin.removeDelegatee(pkpTokenId, delegateeAddress);
        console.log("Delegatee削除成功:", tx);
        return tx;
    } catch (error) {
        console.error("Delegatee削除エラー:", error);
        throw error;
    }
}

(async() => {
    admin = await Admin.create(adminConfig, agentConfig)
})();
