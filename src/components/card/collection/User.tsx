import { mintStore } from "@/store/mint.contract";
import { computed, defineComponent, onMounted, ref } from "vue";
import styled from "vue3-styled-component";
import type { collection } from "@/store/mint.contract";
import { useRoute } from "vue-router";

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
      // Route - get address
      const route = useRoute();
      const user = route.params?.address as string;
      const useMintStore = mintStore();
      const items = ref<collection[]>([]);
      // get user info
      useMintStore.UserInfo(user).then((data) => {
        items.value = data;
        console.log("data: ",data)
      });
      return () => (
        <div class="carousel carousel-center max-w-md p-4 space-x-4 rounded-box">
          <div class="carousel-item">
            {items.value.map((item) => (
              <div class="card w-[300px] bg-base-100 shadow-xl my-[16px] mx-auto mr-[16px]">
                <figure>
                  <img src={item.image} alt="Shoes" />
                </figure>
                <div class="card-body">
                  <h2 class="card-title flex">
                    {item.attributes[0].value} |
                    <div class="text-sm">{item.name}</div>
                  </h2>
                  <p>{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    },
  });
};
export default Card() as any;
