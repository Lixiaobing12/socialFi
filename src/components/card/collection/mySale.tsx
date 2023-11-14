import { mintStore } from "@/store/mint.contract";
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import styled from "vue3-styled-component";
import type { attributes, collection } from "@/store/mint.contract";
import { useWallet } from "@/store/wallet";
import { Item } from "../market/collection";
import axios from "axios";

export type CollectionItem = {
  img: string;
  tokenId: number;
};
const Card = () => {
  const Grid = styled.div`
    display: flex;
    overflow: auto;

    &::-webkit-scrollbar {
      display: none;
    }
  `;
  const Flex = styled.div`
    position: relative;
  `;
  const Img = styled.img`
    width: 138px;
    height: 138px;
    margin: 5px;
    border-radius: 15px;
  `;
  const Tokenid = styled.div`
    position: absolute;
    bottom: 10px;
    right: 10px;
  `;
  return defineComponent({
    setup(props, { emit }) {
      const click = (item: collection) => {
        emit("change", item, true);
      };
      const wallet = useWallet();
      // Route - get address
      const user = computed(() => wallet.wallet.account);
      // user saling's nfts
      const listed = ref<Item[]>([]);
      // loading
      const loader = ref(false);
      /** get json include nft img */
      async function getResource(item: Item) {
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

      // get user saling nft
      async function init() {
        try {
          loader.value = true;
          const { data } = await axios.post("/api/nft/listed", {
            user_addr: user.value,
            status: 1,
            page: 1,
            size: 99,
          });
          if (data.code !== 0) loader.value = false;
          if (Array.isArray(data.data) && data.data.length) {
            let promising: any[] = [];
            data.data.forEach((item: Item) => {
              promising.push(
                new Promise(async (resolve, reject) => {
                  await getResource(item);
                  resolve("");
                })
              );
            });
            await Promise.all(promising);
            listed.value = data.data;
            loader.value = false;
          }
        } catch (err) {
          console.log("axios error:", err);
        }
      }
      watch(user, () => {
        Number(user.value) && init();
      });
      onMounted(() => {
        Number(user.value) && init();
      });

      return () => (
        <Grid>
          {listed.value.map((item) => (
            <Img
              src={item.collection?.image}
              width={130}
              onClick={click.bind(null, item.collection as collection)}
            />
          ))}
        </Grid>
      );
    },
  });
};
export default Card() as any;
