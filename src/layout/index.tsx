import { computed, defineComponent, onMounted, ref, watch } from "vue";
import styled from "vue3-styled-component";
import { useWallet } from "../store/wallet";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { mintStore } from "@/store/mint.contract";
import { NDrawer, NDrawerContent, NGi, NGrid, NIcon } from "naive-ui";
import { CloseFilled } from "@vicons/material";
import { ChevronRight12Regular } from "@vicons/fluent";
import { TelegramPlane, Twitter, Discord } from "@vicons/fa";

const Layout = () => {
  const Wrapper = styled.div`
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  `;
  const WrapperBody = styled.div`
    padding: 12px;
  `;
  const WraperHeader = styled("div")`
    display: flex;
    height: 60px;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: ${(props) => props.padding ?? "0 12px"};
    position: relative;
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

  const MoreItem = styled<any>("div")`
    background: #fff;
    width: 100%;
    position: absolute;
    top: 60px;
    z-index: 1;
    box-shadow: 0px 16px 11px -19px;
    height: ${(props: any) => props.height + "px" || "0px"};
    transition: height 200ms ease-in-out;
    display: flex;
    flex-direction: column;
    overflow: hidden;
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
      // router
      const router = useRouter();
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

      onMounted(() => {
        const config = localStorage.getItem("connected");
        if (config) {
          wallet.connect();
        }
      });

      return () => (
        <Wrapper id="wrapper">
          <WraperHeader>
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
              <img
                src="/assets/icon/menu.png"
                width={28}
                alt=""
                onClick={open}
              />
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

          <WrapperBody>
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
              <WraperHeader padding="0">
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
            </NDrawerContent>
          </NDrawer>
        </Wrapper>
      );
    },
  });
};
export default Layout();
