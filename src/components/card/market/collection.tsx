import { attributes, collection } from "@/store/mint.contract";
import axios from "axios";
import { defineComponent, onMounted, ref } from "vue";
import { Ethereum } from "@vicons/fa";
import { NIcon, useMessage } from "naive-ui";
import { RouterLink } from "vue-router";
import { marketStore } from "@/store/market.contract";

export type Item = {
  Seller: string;
  create_at: string;
  id: string;
  json_url: string;
  nft_address: string;
  pay_token: string;
  price: number;
  status: number;
  timer: number;
  token_id: number;
  transaction_at: string;
  collection?: collection;
};
const Collection = defineComponent({
  props: ["Item"],
  setup(props, { emit }) {
    const item = props.Item as Item;
    const useMarketStore = marketStore();
    /** naive ui message */
    const message = useMessage();
    /** buy loading */
    const loader = ref(false);
    /** buy */
    async function BuyNft() {
      try {
        loader.value = true;
        await useMarketStore.BuyNft(item);
        loader.value = false;
        message.success("Buy Successful!");
        emit("BeforeBuy", item);
      } catch (err) {
        loader.value = false;
        message.error("Something was error");
        console.log("Buy Nft error: ", err);
      }
    }
    /** get json include nft img */
    async function getResource() {
      let json: string = item.json_url;
      json = json
        .replace("https://aipet.hm-swap.com", import.meta.env.VITE_IMG_URI)
        .replace("/static", "")
        .replace(".comc", ".com");
      const resource = await axios.get(json);
      item.collection = {
        tokenid: item.token_id,
        image: resource.data.image.replace(
          "https://aipet.hm-swap.com",
          import.meta.env.VITE_IMG_URI
        ),
        name: resource.data.name,
        description: resource.data.description,
        attributes: resource.data.attributes as attributes[],
      };
    }
    onMounted(() => {
      setTimeout(() => {
        getResource();
      }, 1500);
    });
    return () => (
      <>
        {item.collection ? (
          <div class="card w-[90vw] bg-base-100 shadow-xl my-[16px] mx-auto">
            <figure>
              <img src={item.collection.image} alt="Shoes" />
            </figure>
            <div class="card-body">
              <h2 class="card-title flex">
                {item.collection.attributes[0].value} |
                <div class="text-sm">{item.collection.name}</div>
              </h2>
              <p>{item.collection.description}</p>

              <div class="flex items-center mt-[20px]">
                <div class="avatar">
                  <div class="w-[30px] rounded-xl">
                    <img src="/assets/market1.png" />
                  </div>
                </div>
                <a class="link link-accent truncate ml-[10px]">
                  <RouterLink to={`/user/${item.Seller}`}>
                    #{item.Seller}
                  </RouterLink>
                </a>
              </div>
              <div class="card-actions justify-end flex align-middle items-center">
                {item.pay_token ===
                "0x0000000000000000000000000000000000000002" ? (
                  <NIcon size={25}>
                    <Ethereum />
                  </NIcon>
                ) : (
                  <img src="/assets/icon/iGs.png" width={25} alt="" />
                )}
                <h3 class="font-bold">{item.price.toFixed(4)}</h3>

                <button
                  class="btn btn-primary"
                  onClick={() => {
                    !loader.value && BuyNft();
                  }}
                >
                  {loader.value && (
                    <span class="loading loading-spinner text-accent"></span>
                  )}
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div class="flex flex-col gap-4 w-full my-[20px]">
            <div class="skeleton h-32 w-full"></div>
            <div class="skeleton h-4 w-28"></div>
            <div class="skeleton h-4 w-full"></div>
            <div class="skeleton h-4 w-full"></div>
          </div>
        )}
      </>
    );
  },
});
export default Collection as any;
