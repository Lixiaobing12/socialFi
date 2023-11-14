import { Item } from "@/components/card/market/collection";
import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useWallet } from "./wallet";
import { ethers } from "ethers";
import MarketAbi from "@/utils/abi/Market.json";
import BigNumber from "bignumber.js";
import MintNftAbi from "@/utils/abi/MintNFT.json";

type listNftType = {
  nft: string;
  tokenId: number;
  payToken: string;
  price: BigNumber;
};
export const marketStore = defineStore("market", () => {
  const listed = ref([]);

  /** on listNft */
  async function listNft(value: listNftType) {
    const wallet = useWallet();
    const [provider, singer, account] = await wallet.connect();
    /** approve nft */
    const MintNftProvider = new ethers.Contract(
      import.meta.env.VITE_MINE_SOL,
      MintNftAbi,
      singer
    );
    const isApprovedForAll = await MintNftProvider.isApprovedForAll(
      account,
      import.meta.env.VITE_MARKET
    );
    if (!isApprovedForAll) {
      const tx = await MintNftProvider.setApprovalForAll(
        import.meta.env.VITE_MARKET,
        true
      );
      await tx.wait();
    }
    const MarketProvider = new ethers.Contract(
      import.meta.env.VITE_MARKET,
      MarketAbi,
      singer
    );
    let tx = await MarketProvider.listNft(
      value.nft,
      value.tokenId,
      value.payToken,
      value.price.toFixed(0)
    );
    await tx.wait();
    return true;
  }

  /** cancel listed */
  async function cancelListedNFT(value: { nft: string; tokenId: number }) {
    const wallet = useWallet();
    const [provider, singer] = await wallet.connect();
    const MarketProvider = new ethers.Contract(
      import.meta.env.VITE_MARKET,
      MarketAbi,
      singer
    );
    let tx = await MarketProvider.cancelListedNFT(value.nft, value.tokenId);
    await tx.wait();
    return true;
  }
  /** buy nft on market */
  async function BuyNft(item: Item) {
    const wallet = useWallet();
    const [provider, singer] = await wallet.connect();
    const MarketProvider = new ethers.Contract(
      import.meta.env.VITE_MARKET,
      MarketAbi,
      singer
    );
    let value: any = {};
    if (item.pay_token === "0x0000000000000000000000000000000000000002")
      value.value = BigNumber(item.price).times(1e18).toFixed(0);
    let tx = await MarketProvider.buyNFT(
      item.nft_address,
      item.token_id,
      item.pay_token,
      BigNumber(item.price).times(1e18).toFixed(0),
      value
    );
    await tx.wait();
    return true;
  }
  async function init() {
    try {
      const { data } = await axios.post("/api/nft/listed", {
        status: 1,
        page: 1,
        size: 99,
      });
      if (data.code === 0) listed.value = data.data || [];
    } catch (err) {
      console.log("axios error:", err);
    }
  }
  return { init, listed, BuyNft, listNft, cancelListedNFT };
});
