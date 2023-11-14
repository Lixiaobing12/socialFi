import { defineStore } from "pinia";
import { useWallet } from "./wallet";
import MintNftAbi from "@/utils/abi/MintNFT.json";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { ref } from "vue";
import axios from "axios";

export type attributes = {
  value: string;
  trait_type: string;
};
export type collection = {
  tokenid: any;
  attributes: attributes[];
  image: string;
  name: string;
  description: string;
};

export const mintStore = defineStore("mint", () => {
  let timer: NodeJS.Timeout | null;
  const collection = ref<collection[]>([]);

  const mint = async (uri: string) => {
    const wallet = useWallet();
    const [provider, singer, account] = await wallet.connect();
    const MintNftProvider = new ethers.Contract(
      (import.meta as any).env.VITE_MINE_SOL,
      MintNftAbi,
      singer
    );
    const price = await MintNftProvider.cost();
    console.log("price", price.toString());
    return MintNftProvider.mint(
      account,
      (import.meta as any).env.VITE_IMG_URI + uri,
      {
        value: price.toString(),
      }
    );
  };

  const NextTokenId = async () => {
    const wallet = useWallet();
    const [provider] = await wallet.connect();
    const MintNftProvider = new ethers.Contract(
      import.meta.env.VITE_MINE_SOL,
      MintNftAbi,
      provider
    );
    return (await MintNftProvider.getNextId()).toNumber() + 1;
  };

  /** get User info */
  const UserInfo = async (account: string) => {
    const wallet = useWallet();
    const [provider] = await wallet.connect();
    const MintNftProvider = new ethers.Contract(
      import.meta.env.VITE_MINE_SOL,
      MintNftAbi,
      provider
    );

    const tokenIds: any[] = await MintNftProvider.tokensOfOwner(account);

    const collections: collection[] = [];

    const promisies: any[] = [];
    if (tokenIds.length) {
      tokenIds.forEach((tokenid) => {
        promisies.push(
          new Promise(async (resolve, reject) => {
            try {
              let json: string = await MintNftProvider.tokenURI(
                tokenid.toNumber()
              );
              json = json
                .replace(
                  "https://aipet.hm-swap.com",
                  import.meta.env.VITE_IMG_URI
                )
                .replace("/static", "")
                .replace(".comc", ".com");
              const resource = await axios.get(json);
              collections.push({
                tokenid: tokenid.toNumber(),
                image: resource.data.image.replace(
                  "https://aipet.hm-swap.com",
                  import.meta.env.VITE_IMG_URI
                ),
                name: resource.data.name,
                description: resource.data.description,
                attributes: resource.data.attributes as attributes[],
              });
              resolve("");
            } catch (err) {
              console.log("err: ", err);
              reject();
            }
          })
        );
      });
    }
    await Promise.all(promisies);
    return collections;
  };
  const init = async () => {
    const wallet = useWallet();
    const [provider, singer, account] = await wallet.connect();
    async function func() {
      const data = await UserInfo(account);
      const ids = collection.value.map<number>(item=>{
        return item.tokenid
      })
      data.forEach(item=>{
        if(!ids.includes(item.tokenid)){
          collection.value.push(item)
        }
      })
    }
    func();
    if (timer) clearInterval(timer);
    timer = setInterval(func, 10 * 1000);
  };
  return { mint, NextTokenId, init, collection, UserInfo };
});
