import Collection, { Item } from "@/components/card/market/collection";
import { marketStore } from "@/store/market.contract";
import { NCarousel } from "naive-ui";
import { computed, defineComponent, ref, watch } from "vue";
import styled from "vue3-styled-component";

const MarketHeader = styled("div")`
  background-size: cover;
  position: relative;

  &::after {
    position: absolute;
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url(${(props) => props.bg ?? ""});
    inset: 0px 0px -1px;
    transition: background 0.3s linear 0s;
    top: 0;
    left: 0;
    z-index: -1;
    background-position: center;
    background-size: cover;
    -webkit-filter: blur(60px);
    -moz-filter: blur(60px);
    -o-filter: blur(60px);
    -ms-filter: blur(60px);
    filter: blur(60px);
  }
`;
const Market = defineComponent({
  setup() {
    // store
    const useMarketStore = marketStore();
    // choose banner img
    const target = ref("/assets/marketBanner1.png");
    // get listed store
    const listed = ref<Item[]>([]);
    const source = computed<Item[]>(() => useMarketStore.listed);
    // all imgs
    const sources = [
      "/assets/marketBanner1.png",
      "/assets/marketBanner2.png",
      "/assets/marketBanner3.png",
      "/assets/marketBanner4.png",
      "/assets/marketBanner5.png",
    ];
    // event on which on view
    function onView(index: number) {
      target.value = sources[index];
    }
    /** before Buy */
    function BeforeBuy(item: Item) {
      listed.value = listed.value.filter((i) => i.id !== item.id);
    }

    watch(source, () => {
      listed.value = source.value;
    });
    // get market list
    useMarketStore.init();
    return () => (
      <div>
        <MarketHeader class="pt-[100px]" bg={target.value}>
          <NCarousel
            show-dots={false}
            centered-slides
            autoplay
            prev-slide-style="transform: translateX(17%)"
            next-slide-style="transform: translateX(-17%)"
            transition-style={{ transitionDuration: "500ms" }}
            on-update:current-index={onView}
          >
            {sources.map((item) => (
              <div class="carousel-item w-[300px] h-[300px] mx-auto">
                <img src={item} class="rounded-box" />
              </div>
            ))}
          </NCarousel>
        </MarketHeader>

        <select class="select w-[150px] max-w-xs mt-[36px]" disabled>
          <option>Trending</option>
        </select>

        <p class="my-[25px] font-bold text-lg">Today</p>

        <div class="hero min-h-screen bg-base-200 overflow-hidden">
          <div class="hero-content flex-col lg:flex-row">
            <img
              src="/assets/marketBga.png"
              class="max-w-sm rounded-lg shadow-2xl"
            />
            <div>
              <h1 class="text-5xl font-bold">Pet Trading Market!</h1>
              <p class="py-6">
                Come and trade your Nft!Participate in the transaction to enter
                the blogger group chat!Share Blogger's Nft Benefits
              </p>
              <a class="btn btn-primary" href="#info">
                Get Started
              </a>
            </div>
          </div>
        </div>

        <section id="info">
          {listed.value.map((item) => (
            <Collection Item={item} onBeforeBuy={BeforeBuy} />
          ))}
        </section>
      </div>
    );
  },
});
export default Market;
