import Saling from "@/components/card/collection/Saling";
import Collection from "@/components/card/collection/User";
import { collection, mintStore } from "@/store/mint.contract";
import { useWallet } from "@/store/wallet";
import { computed, defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";
import styled from "vue3-styled-component";

const Collections = () => {
  const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px 0;

    h1 {
      font-weight: bold;
    }

    p {
      text-indent: 0.5em;
    }
  `;
  const Flex = styled.div`
    display: flex;
    align-items: center;
    align-self: flex-start;
  `;
  const Avant = styled<any>("img")`
    width: ${(props) => (props.size ? props.size + "px" : "60px")};
    height: ${(props) => (props.size ? props.size + "px" : "60px")};
    border-radius: 50%;
    margin-right: 12px;
    border: 1px solid #e6dbdb;
  `;
  const Btn = styled.div`
    width: 100px;
    line-height: 40px;
    display: flex;
    align-items: center;
    align-self: flex-start;
    position: relative;

    img {
      width: 20px;
    }
  `;
  return defineComponent({
    setup() {
      // Route - get address
      const route = useRoute();
      // user address
      const user = route.params?.address as string;
      // user collections length
      const length = ref(0);
      const useMintStore = mintStore();
      const type = ref(0);
      const chageType = async (value: number) => {
        type.value = value;
      };
      const target = ref<collection | null>(null);
      const selectCollection = (item: collection) => {
        target.value = item;
      };
      // get user info
      useMintStore.UserInfo(user).then((data) => {
        length.value = data.length;
      });
      return () => (
        <Wrapper>
          <Flex>
            <Avant src="/assets/market1.png"></Avant>
            <div>
              <h1>{user.substring(0, 6) + "..." + user.substring(38)}</h1>
              <p>collection:{length.value}</p>
            </div>
          </Flex>
          {/* <ButGroup> */}
          <Btn onClick={chageType.bind(null, 0)} class="mt-[20px]">
            <img src="/assets/icon/vitamins.svg" alt="" />
            Collections
          </Btn>
          {length.value ? (
            <Collection />
          ) : (
            <div class="flex flex-col gap-4 w-52">
              <div class="skeleton h-32 w-full"></div>
              <div class="skeleton h-4 w-28"></div>
              <div class="skeleton h-4 w-full"></div>
              <div class="skeleton h-4 w-full"></div>
            </div>
          )}

          <p class="my-[25px] font-bold text-lg">On sale</p>
          <Saling />
        </Wrapper>
      );
    },
  });
};

export default Collections();
