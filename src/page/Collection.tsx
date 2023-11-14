import Collection, { CollectionItem } from "@/components/card/collection";
import Chat from "@/components/card/collection/Chat";
import MySale from "@/components/card/collection/mySale";
import { marketStore } from "@/store/market.contract";
import { collection, mintStore } from "@/store/mint.contract";
import { useWallet } from "@/store/wallet";
import BigNumber from "bignumber.js";
import {
  NGi,
  NGrid,
  NInputNumber,
  NModal,
  NRadio,
  NSpin,
  useMessage,
} from "naive-ui";
import { computed, defineComponent, ref, watch } from "vue";
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
  const OverflowImg = styled("img")`
    width: ${(props) => (props?.width ? props.width + "px" : "200px")};
    height: ${(props) => (props?.width ? props.width + "px" : "200px")};
    box-shadow: 0px 0px 10px 0px #e6dbdb;
    margin: 20px auto;
    border-radius: 15px;
  `;
  const OverflowDiv = styled.div`
    width: 200px;
    height: 200px;
    box-shadow: 0px 0px 10px 0px #e6dbdb;
    margin: 20px auto;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-centent: center;
  `;
  const ButGroup = styled(Flex)`
    margin: 20px auto;
    width: 100%;
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

  const ActiveBlock = styled.div`
    position: absolute;
    width: 100px;
    height: 5px;
    background: repeating-linear-gradient(
      56deg,
      rgba(68, 206, 246, 0.5),
      rgba(68, 206, 246, 0.5) 14px,
      white 16px,
      white 22px
    );
    bottom: 0;
  `;

  const List = styled.ul`
    width: 100%;
  `;
  const ListItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const FlexRelative = styled.div`
    position: relative;
  `;
  const TalkRoundBtn = styled.div`
    background: rgb(101 219 181);
    border-radius: 5px;
    position: absolute;
    top: 15px;
    right: -40px;
    color: #fff;
    padding: 0 10px;
  `;

  const Card = styled.div`
    width: 80vw;
    margin: 0 auto;
    background: #fff;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    padding: 12px;
    position: relative;
  `;

  const Bold = styled.span`
    font-size: 30px;
    color: #000;
    font-family: serif;
    font-weight: bold;
  `;
  const H2Span = styled(Bold)`
    font-size: 24px;
    margin-right: 10px;
    margin-bottom: 16px;
  `;

  const GiFlexCol = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-centent: center;
  `;
  const TipBtn = styled.div`
    background: rgb(101 219 181);
    color: #fff;
    padding: 3px 15px;
    border-radius: 5px;
    width: 100px;
    text-align: center;
    margin: 16px auto;
  `;
  return defineComponent({
    setup() {
      const chating = ref(false);
      const chatRef = ref<any>(null);
      const useMintStore = mintStore();
      const message = useMessage();
      const useMarketStore = marketStore();
      /** sall loading */
      const loading = ref(false);
      const wallet = useWallet();
      /** open price modal */
      const showModal = ref(false);
      /** setup price info */
      const priceSource = ref({
        igs: "",
        eth: "",
        type: "",
      });
      const type = ref(0);
      /** isSale */
      const isSale = ref(false);
      const chageType = async (value: number) => {
        type.value = value;
      };
      const target = ref<collection | null>(null);

      const selectCollection = (item: collection, _isSale: boolean = false) => {
        isSale.value = _isSale;
        target.value = item;
      };
      const open = () => {
        chating.value = true;
        chatRef.value?.pushTarget(target.value);
        chatRef.value?.open();
      };
      /** off thi nft */
      async function CancelListed() {
        try {
          loading.value = true;
          const bool = await useMarketStore.cancelListedNFT({
            nft: import.meta.env.VITE_MINE_SOL,
            tokenId: target.value?.tokenid,
          });
          loading.value = false;
          window.location.reload();
        } catch (err) {
          console.log(err);
          loading.value = false;
          message.warning("Something was error!");
        }
      }
      /** onSall nft */
      async function onSell() {
        if (!priceSource.value.type) return;
        if (priceSource.value.type === "eth" && !priceSource.value.eth) return;
        if (priceSource.value.type === "igs" && !priceSource.value.igs) return;
        try {
          loading.value = true;
          const payToken =
            priceSource.value.type === "eth"
              ? "0x0000000000000000000000000000000000000002"
              : import.meta.env.VITE_IGS;

          const price =
            priceSource.value.type === "eth"
              ? BigNumber(priceSource.value.eth).times(1e18)
              : BigNumber(priceSource.value.igs).times(1e18);
          const bool = await useMarketStore.listNft({
            nft: import.meta.env.VITE_MINE_SOL,
            tokenId: target.value?.tokenid,
            payToken,
            price,
          });
          showModal.value = false;
          loading.value = false;
          window.location.reload();
        } catch (err) {
          console.log(err);
          loading.value = false;
          message.warning("Something was error!");
        }
      }

      return () => (
        <>
          <Wrapper>
            <Chat
              ref={chatRef}
              onChange={(e: any) => {
                chating.value = e;
              }}
            />
            <Flex>
              <Avant src="/assets/market1.png"></Avant>
              <div>
                <h1>
                  {wallet.wallet.account.substring(0, 6) +
                    "..." +
                    wallet.wallet.account.substring(38)}
                </h1>
                <p>collection:{useMintStore.collection.length}</p>
                <p>balance:{wallet.wallet.balance.div(1e18).toFixed(3)} ETH</p>
              </div>
            </Flex>
            {target.value ? (
              !isSale.value ? (
                <FlexRelative>
                  <TalkRoundBtn
                    class="animate__animated animate__pulse animate__fast"
                    onClick={open}
                  >
                    Talk With Pet
                  </TalkRoundBtn>
                  <OverflowImg src={target.value.image}></OverflowImg>
                </FlexRelative>
              ) : (
                <FlexRelative>
                  <OverflowImg src={target.value.image}></OverflowImg>
                </FlexRelative>
              )
            ) : (
              <OverflowDiv>
                <OverflowImg src="/assets/loader.gif" width={100}></OverflowImg>
              </OverflowDiv>
            )}
            {target.value && (
              <List>
                {target.value.attributes.map((attr) => (
                  <ListItem>
                    <h4>{attr.trait_type}: </h4>
                    <h5>{attr.value}</h5>
                  </ListItem>
                ))}
                <ListItem>
                  <h4>name: </h4>
                  <h5>{target.value.name}</h5>
                </ListItem>
                <ListItem>
                  <h4>description: </h4>
                  <h5>
                    {target.value.description
                      ? target.value.description
                      : "not description"}
                  </h5>
                </ListItem>
                <ListItem>
                  {isSale.value ? (
                    <button
                      class="btn btn-sm btn-accent"
                      onClick={CancelListed}
                    >
                      {loading.value && (
                        <span class="loading loading-spinner text-accent text-white"></span>
                      )}
                      Off the shelf
                    </button>
                  ) : (
                    <button
                      class="btn btn-sm btn-accent"
                      onClick={() => {
                        showModal.value = true;
                      }}
                    >
                      Sell
                    </button>
                  )}
                </ListItem>
              </List>
            )}

            {/* <ButGroup> */}
            <Btn onClick={chageType.bind(null, 0)}>
              <img src="/assets/icon/vitamins.svg" alt="" />
              Collections
            </Btn>
            <Collection onChange={selectCollection} />

            <Btn onClick={chageType.bind(null, 0)}>
              <img src="/assets/icon/sale.svg" alt="" />
              on Sale
            </Btn>
            <MySale onChange={selectCollection} />

            <Btn onClick={chageType.bind(null, 1)}>
              <img src="/assets/icon/food.svg" />
              Food
            </Btn>
            {/* <Food /> */}
            <p>Coming Soon!</p>
          </Wrapper>

          <NModal v-model:show={showModal.value} auto-focus={false}>
            <Card>
              <H2Span>Selling price</H2Span>

              <div class="flex items-center my-[12px]">
                <div class="mr-[12px]">Type: </div>
                <NRadio
                  checked={priceSource.value.type === "eth"}
                  onClick={() => {
                    priceSource.value.type = "eth";
                  }}
                  value="eth"
                >
                  <div class="flex items-center">
                    <img src="/assets/icon/eth.webp" width={30} alt="" /> eth
                  </div>
                </NRadio>
                <NRadio
                  checked={priceSource.value.type === "iGs"}
                  onClick={() => {
                    priceSource.value.type = "iGs";
                  }}
                  value="iGs"
                >
                  <div class="flex items-center">
                    <img
                      src="/assets/icon/iGs.png"
                      class="mr-[5px]"
                      width={30}
                      alt=""
                    />{" "}
                    iGs
                  </div>
                </NRadio>
              </div>

              <div class="flex items-center my-[12px]">
                <div class="mr-[12px]">Value: </div>
                {priceSource.value.type === "eth" ? (
                  <NInputNumber
                    v-model:value={priceSource.value.eth}
                    placeholder=""
                    show-button={false}
                    clearable
                  />
                ) : (
                  <NInputNumber
                    v-model:value={priceSource.value.igs}
                    placeholder=""
                    show-button={false}
                    clearable
                  />
                )}
              </div>
              <TipBtn onClick={onSell}>
                {loading.value && (
                  <span class="loading loading-spinner text-accent text-white"></span>
                )}
                Sell
              </TipBtn>
            </Card>
          </NModal>
        </>
      );
    },
  });
};

export default Collections();
