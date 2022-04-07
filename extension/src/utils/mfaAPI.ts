import MFAService from "hexagon-frontend/src/services/MFAService";
import CryptoService from "hexagon-shared/services/CryptoService";
import { Account, client, cryptoService } from "./serviceUtils";

export const mfaAPI = (function () {
    const module = {
        createMFA: async (
            account: Account,
            url: string,
            username: string,
            seed: string
        ) => {
            try {
                const mfaService = new MFAService(
                    cryptoService,
                    account,
                    client
                );

                await mfaService
                    .createMFA(url, username, seed)
                    .then((mfa) => console.log("mfa created"));
            } catch (err) {
                if (err.status === 409)
                    throw "MFA key already exists for account.";
                else throw "Unable to create MFA key.";
            }
        },
    };
    return module;
})();