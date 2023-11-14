import {
  VNodeRef,
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from "vue";
import styled from "vue3-styled-component";
import { useWallet } from "../store/wallet";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { mintStore } from "@/store/mint.contract";
import { NDrawer, NDrawerContent, NGi, NGrid, NIcon } from "naive-ui";
import { CloseFilled,MenuOpenTwotone } from "@vicons/material";
import { ChevronRight12Regular } from "@vicons/fluent";
import { TelegramPlane, Twitter, Discord } from "@vicons/fa";

const Layout = () => {
  const Wrapper = styled.div`
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  `;
  const WrapperBody = styled("div")`
    padding: ${(props) => props.padding ?? "12px"};
    padding-top: ${(props) => props.top ?? "60px"};
  `;
  const WraperHeader = styled("div")`
    background: ${(props) => props.bg ?? "transparent"};
    display: flex;
    height: 60px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: ${(props) => props.padding ?? "0 12px"};
    position: fixed;
    top: 0;
    z-index: 999;
    left:0;
    right:0;

    h1 {
      font-size: 20px;
      font-weight: bold;
    }
  `;
  const FlexEnd = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;

    img {
      margin-right: 10px;
    }
  `;
  const But = styled.div`
    background: rgb(101 219 181);
    color: #fff;
    padding: 3px 15px;
    border-radius: 5px;
  `;
  const SmallSpan = styled.span`
    font-size: 12px;
  `;
  const ItemAnimate = styled.div`
    border-bottom: 1px solid rgb(226 226 226);
    padding: 16px 16px;
    font-weight: bold;
    text-indent: 1em;
    font-size: 1.2em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1;

    div {
      display: flex;
    }
  `;
  const Items = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
  `;
  return defineComponent({
    setup() {
      const wallet = useWallet();
      const useMintStore = mintStore();
      const isConnect = computed(() => wallet.wallet.isConnect);
      // setHeader background
      const headerBackground = ref<string | null>(null);
      // router
      const router = useRouter();
      // route
      const route = useRoute();
      // open drawer
      const isOpen = ref(false);
      const open = () => {
        // height.value = height.value ? 0 : 150;
        isOpen.value = true;
      };

      // goto url && close drawer
      const navigate = (path: string) => {
        isOpen.value = false;
        router.push(path);
      };

      const connect = () => {
        wallet.connect();
        localStorage.setItem("connected", "true");
      };
      watch(isConnect, () => {
        useMintStore.init();
      });

      // 滚动事件
      function doScroll(event: any) {
        if (
          event.target.scrollingElement.scrollTop > 0 &&
          !headerBackground.value
        )
          headerBackground.value = "#fff";
        else if (event.target.scrollingElement.scrollTop === 0)
          headerBackground.value = null;
      }

      onMounted(() => {
        const config = localStorage.getItem("connected");
        document.addEventListener("scroll", doScroll);
        if (config) {
          wallet.connect();
        }
      });

      onUnmounted(() => {
        document.removeEventListener("scroll", doScroll);
      });

      return () => (
        <Wrapper id="wrapper">
          <WraperHeader bg={headerBackground.value}>
            <RouterLink to="/">
              <img src="/assets/logo.png" width={50} alt="" />
            </RouterLink>
            {/* <h1>PurrfectBonds</h1> */}
            <FlexEnd>
              <img
                src="/assets/icon/search.svg"
                width={28}
                alt=""
                onClick={() => {
                  router.push("/");
                }}
              />
              <img src="/assets/icon/book.svg" width={28} alt="" />
              <NIcon size={30} onClick={open} class="mr-[10px]">
                <MenuOpenTwotone/>
              </NIcon>
              <But onClick={connect}>
                {wallet.wallet.isConnect ? (
                  <SmallSpan>
                    {wallet.wallet.account.substring(0, 4) +
                      "..." +
                      wallet.wallet.account.substring(38)}
                  </SmallSpan>
                ) : (
                  "Connect"
                )}
              </But>
            </FlexEnd>
          </WraperHeader>

          <WrapperBody top={/market/.exec(route.path) ? '0' : null}>
            <router-view />
          </WrapperBody>

          <NDrawer
            v-model:show={isOpen.value}
            placement="right"
            width="100%"
            auto-focus={false}
            close-on-esc
          >
            <NDrawerContent
              footer-style={{
                "padding-bottom": "25px",
              }}
              v-slots={{
                footer: () => (
                  <NGrid cols={4} x-gap={12} y-gap={12}>
                    <NGi></NGi>
                    <NGi span={2}>
                      <Items>
                        <img src="/assets/icon/book.svg" width={35} alt="" />
                        <NIcon size={30}>
                          <Twitter />
                        </NIcon>
                        <NIcon size={30}>
                          <TelegramPlane />
                        </NIcon>
                        <NIcon size={30}>
                          <Discord />
                        </NIcon>
                      </Items>
                    </NGi>
                    <NGi></NGi>
                  </NGrid>
                ),
              }}
            >
              <WraperHeader>
                <RouterLink to="/">
                  <img src="/assets/logo.png" width={50} alt="" />
                </RouterLink>
                <FlexEnd>
                  <img
                    src="/assets/icon/search.svg"
                    width={28}
                    alt=""
                    onClick={() => {
                      router.push("/");
                    }}
                  />

                  <NIcon
                    onClick={() => {
                      isOpen.value = false;
                    }}
                    size={25}
                  >
                    <CloseFilled />
                  </NIcon>
                </FlexEnd>
              </WraperHeader>
              <WrapperBody padding="0" top="45px">
                <ItemAnimate
                  class="animate__animated animate__fadeInLeft"
                  onClick={navigate.bind(null, "/")}
                >
                  <div>
                    <img src="/assets/icon/home.png" alt="" width={25} />
                    Home
                  </div>
                  <NIcon>
                    <ChevronRight12Regular />
                  </NIcon>
                </ItemAnimate>
                <ItemAnimate
                  class="animate__animated animate__fadeInRight"
                  onClick={navigate.bind(null, "/collection")}
                >
                  <div>
                    <img src="/assets/icon/collection.png" alt="" width={25} />
                    My Collections
                  </div>
                  <NIcon>
                    <ChevronRight12Regular />
                  </NIcon>
                </ItemAnimate>
                <ItemAnimate
                  class="animate__animated animate__fadeInLeft"
                  onClick={navigate.bind(null, "/community")}
                >
                  <div>
                    <img src="/assets/icon/community.png" alt="" width={25} />
                    Community
                  </div>
                  <NIcon>
                    <ChevronRight12Regular />
                  </NIcon>
                </ItemAnimate>
                <ItemAnimate
                  class="animate__animated animate__fadeInRight"
                  onClick={navigate.bind(null, "/market")}
                >
                  <div>
                    <img src="/assets/icon/market.png" alt="" width={25} />
                    Marketplace
                  </div>
                  <NIcon>
                    <ChevronRight12Regular />
                  </NIcon>
                </ItemAnimate>
                <ItemAnimate class="animate__animated animate__fadeInLeft">
                  <div>
                    <img src="/assets/icon/rank.png" alt="" width={25} />
                    Rank
                  </div>
                </ItemAnimate>
              </WrapperBody>
            </NDrawerContent>
          </NDrawer>
        </Wrapper>
      );
    },
  });
};
export default Layout();
