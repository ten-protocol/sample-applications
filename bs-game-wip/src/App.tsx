import "./App.css";
import MetaMask from "@/components/MetaMask/MetaMask";
import MessageLog from "@/components/MessageLog/MessageLog";
import Graveyard from "./components/Graveyard/Graveyard";
import BattleGrid from "./components/BattleGrid/BattleGrid";
import logo from "@/assets/white_logotype.png"
import PrizePool from "./components/PrizePool/PrizePool";
import CellsRemaining from "./components/CellsRemaining/CellsRemaining";
import ProcessingNotification from "./components/ProcessingNotification/ProcessingNotification";
import {useState, useEffect} from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import {trackEvent} from "./lib/trackEvent";
import {useWalletStore} from "./stores/walletStore";
import {useMessageStore} from "./stores/messageStore";

function App() {

  const [setProvider, address, setAddress] = useWalletStore((state) => [
    state.setProvider,
    state.address,
    state.setAddress,
  ]);
  const addNewMessage = useMessageStore((state) => state.addNewMessage);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    connectToMetaMask();
  }, [address]);

  const connectToMetaMask = async () => {
    try {
      const provider = await detectEthereumProvider();
      //TODO: If we want to only support metamask there is a 'isMetaMask' property on the provider object
      if (provider) {
        setProvider(provider);
        const chainId = await provider.request({ method: "eth_chainId" });
        if (chainId !== "0x1bb") {
          addNewMessage(
              'Not connected to Ten ! Connect at <a href="https://testnet.ten.xyz/" target="_blank" rel="noopener noreferrer">https://testnet.ten.xyz/</a> '
          );
          return;
        }

        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });

        setAddress(accounts[0]);
        addNewMessage("Connected to wallet ! Account: " + accounts[0]);
        setInitialized(true)

        trackEvent("connect_wallet", {
          value: accounts[0],
        });

      } else {
        addNewMessage("Please install MetaMask!", "ERROR");
        setInitialized(true)
      }
    } catch (err) {
      console.error("Error:", err.message);
      setInitialized(true)
    }
  };

  if (!initialized) {
    return null
  }

  return (
    <>
      <div className="mb-10">
        <img src={logo} alt="test" width={120}/>
      </div>
        <div className="grid grid-cols-[220px_1fr_220px] gap-6">
          <div>
            <Graveyard />
          </div>
          <div className="overflow-hidden">
            <BattleGrid/>
          </div>
          <div className="flex flex-col gap-4">
            <MetaMask />
            <PrizePool/>
            <CellsRemaining/>
          </div>
            <div className="col-span-3">
                <MessageLog />
            </div>
        </div>
      <ProcessingNotification/>
    </>
  );
}

export default App;
