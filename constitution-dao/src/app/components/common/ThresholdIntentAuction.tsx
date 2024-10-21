import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/src/app/components/ui/card";
import { Button } from "@/src/app/components/ui/button";
import { Input } from "@/src/app/components/ui/input";
import { Progress } from "@/src/app/components/ui/progress";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/src/app/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "../ui/use-toast";

const CONTRACT_ADDRESS = "0xDB8445Fd7704A2C43de03692523b2373B1E6A3A5";
const CONTRACT_ABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_threshold",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_durationInDays",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "bidAmount",
        type: "uint256",
      },
    ],
    name: "AuctionWon",
    type: "event",
  },
  {
    inputs: [],
    name: "contribute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "contributor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ContributionMade",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "bidAmount",
        type: "uint256",
      },
    ],
    name: "placeBid",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "refund",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "contributor",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "RefundIssued",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "totalAmount",
        type: "uint256",
      },
    ],
    name: "ThresholdReached",
    type: "event",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "contributor",
        type: "address",
      },
    ],
    name: "getContribution",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getDeadline",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalRaised",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isAuctionWon",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "isThresholdMet",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const TENThresholdIntentAuction = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [totalRaised, setTotalRaised] = useState(0);
  const [deadline, setDeadline] = useState(0);
  const [contribution, setContribution] = useState("");
  const [isThresholdMet, setIsThresholdMet] = useState(false);
  const [isAuctionWon, setIsAuctionWon] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressEstimate, setProgressEstimate] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
          );
          setContract(contract);

          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccount(accounts[0]);

          await updateContractState(contract);
          toast({
            title: "Connected",
            description: "Successfully connected to the Ethereum network.",
            variant: "success",
          });
        } catch (error) {
          console.error("Error initializing:", error);
          toast({
            title: "Connection Error",
            description:
              "Failed to connect to the Ethereum network. Please check your wallet.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Wallet Not Found",
          description:
            "Please install an Ethereum wallet like MetaMask to use this dApp.",
          variant: "warning",
        });
      }
    };

    init();
  }, []);

  const updateContractState = async (contract) => {
    try {
      const totalRaised = await contract.getTotalRaised();
      const deadline = await contract.getDeadline();
      const isThresholdMet = await contract.isThresholdMet();
      const isAuctionWon = await contract.isAuctionWon();

      setTotalRaised(ethers.utils.formatEther(totalRaised));
      setDeadline(deadline.toNumber());
      setIsThresholdMet(isThresholdMet);
      setIsAuctionWon(isAuctionWon);

      // Simulate progress based on threshold met status
      setProgressEstimate(isThresholdMet ? 100 : Math.random() * 99);
    } catch (error) {
      console.error("Error updating contract state:", error);
      toast({
        title: "Update Error",
        description: "Failed to update contract state. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleContribute = async () => {
    if (contract && contribution) {
      try {
        setLoading(true);
        const tx = await contract.contribute({
          value: ethers.utils.parseEther(contribution),
        });
        await tx.wait();
        await updateContractState(contract);
        setContribution("");
        toast({
          title: "Contribution Successful",
          description: `You have successfully contributed ${contribution} ETH.`,
          variant: "success",
        });
      } catch (error) {
        console.error("Error contributing:", error);
        toast({
          title: "Contribution Failed",
          description:
            "There was an error processing your contribution. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRefund = async () => {
    if (contract) {
      try {
        setLoading(true);
        const tx = await contract.refund();
        await tx.wait();
        await updateContractState(contract);
        toast({
          title: "Refund Requested",
          description: "Your refund request has been processed successfully.",
          variant: "info",
        });
      } catch (error) {
        console.error("Error requesting refund:", error);
        toast({
          title: "Refund Failed",
          description:
            "There was an error processing your refund request. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">TEN ThresholdIntentAuction</h1>
          <p className="text-sm text-gray-500">
            Powered by TEN's Shared Private State
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTitle>TEN Features Showcase</AlertTitle>
            <AlertDescription>
              Experience privacy-preserving auctions with MEV protection and
              secure random number generation.
            </AlertDescription>
          </Alert>
          <div className="mb-4 space-y-2">
            <p>
              <span className="font-semibold">Connected Account:</span>{" "}
              {account}
            </p>
            <p>
              <span className="font-semibold">Total Raised:</span> {totalRaised}{" "}
              ETH
            </p>
            <p>
              <span className="font-semibold">Deadline:</span>{" "}
              {new Date(deadline * 1000).toLocaleString()}
            </p>
            <p>
              <span className="font-semibold">Threshold Met:</span>{" "}
              {isThresholdMet ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-semibold">Auction Won:</span>{" "}
              {isAuctionWon ? "Yes" : "No"}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-sm font-semibold mb-2">
              Estimated Progress (TEN's Secure RNG)
            </p>
            <Progress value={progressEstimate} className="h-2" />
            <p className="text-xs text-gray-500 mt-1">
              Note: Actual progress is private
            </p>
          </div>
          <div className="flex gap-2 mb-4">
            <Input
              type="number"
              placeholder="Contribution amount (ETH)"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
              className="flex-grow"
            />
            <Button
              onClick={handleContribute}
              disabled={loading}
              className="w-32"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Contribute"
              )}
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleRefund}
            disabled={isAuctionWon || loading}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Request Refund"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TENThresholdIntentAuction;
