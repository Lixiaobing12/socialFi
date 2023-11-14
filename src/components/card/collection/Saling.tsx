import { mintStore } from "@/store/mint.contract";
import { computed, defineComponent, onMounted, ref } from "vue";
import type { attributes, collection } from "@/store/mint.contract";
import { useRoute } from "vue-router";
import axios from "axios";
import { Item } from "../market/collection";

const Card = () => {
  return defineComponent({
    setup(props, { emit }) {
      // Route - get address
      const route = useRoute();
      const user = route.params?.address as string;
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
            user_addr: user,
            status: 1,
            page: 1,
            size: 99,
          });
          if (data.code === 0) listed.value = data.data || [];
          else loader.value = false;
          if (listed.value.length) {
            let promising: any[] = [];
            listed.value.forEach((item) => {
              promising.push(
                new Promise(async (resolve, reject) => {
                  await getResource(item);
                  resolve("");
                })
              );
            });
            await Promise.all(promising);
            loader.value = false;
          }
        } catch (err) {
          console.log("axios error:", err);
        }
      }
      init();
      return () => (
        <div class="carousel carousel-center max-w-md p-4 space-x-4 rounded-box">
          <div class="carousel-item">
            {loader.value ? (
              <div class="flex flex-col gap-4 w-52">
                <div class="skeleton h-32 w-full"></div>
                <div class="skeleton h-4 w-28"></div>
                <div class="skeleton h-4 w-full"></div>
                <div class="skeleton h-4 w-full"></div>
              </div>
            ) : (
              listed.value.map((item) => (
                <div class="card w-[300px] bg-base-100 shadow-xl my-[16px] mx-auto mr-[16px]">
                  <figure>
                    <img src={item.collection?.image} alt="Shoes" />
                  </figure>
                  <div class="card-body">
                    <h2 class="card-title flex">
                      {item.collection?.attributes[0].value} |
                      <div class="text-sm">{item.collection?.name}</div>
                    </h2>
                    <p>{item.collection?.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    },
  });
};
export default Card() as any;
