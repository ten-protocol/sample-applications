"use client";

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

// ABI and contract address would be imported here
const CONTRACT_ADDRESS = "../../assets/contract/address.json";
const CONTRACT_ABI =
  "../../assets/contract/artifacts/contracts/ConstitutionDAO.sol/ThresholdIntentAuction.json";

const ThresholdIntentAuction = () => {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [totalRaised, setTotalRaised] = useState(0);
  const [threshold, setThreshold] = useState(0);
  const [deadline, setDeadline] = useState(0);
  const [contribution, setContribution] = useState("");
  const [isThresholdMet, setIsThresholdMet] = useState(false);
  const [isAuctionWon, setIsAuctionWon] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log("🚀 ~ init ~ provider:", provider);
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

        // Fetch initial contract state
        updateContractState(contract);
      }
    };

    init();
  }, []);

  const updateContractState = async (contract: any) => {
    const totalRaised = await contract.getTotalRaised();
    console.log("🚀 ~ updateContractState ~ totalRaised:", totalRaised);
    const threshold = await contract.threshold();
    console.log("🚀 ~ updateContractState ~ threshold:", threshold);
    const deadline = await contract.getDeadline();
    console.log("🚀 ~ updateContractState ~ deadline:", deadline);
    const isThresholdMet = await contract.isThresholdMet();
    console.log("🚀 ~ updateContractState ~ isThresholdMet:", isThresholdMet);
    const isAuctionWon = await contract.isAuctionWon();
    console.log("🚀 ~ updateContractState ~ isAuctionWon:", isAuctionWon);

    setTotalRaised(ethers.utils.formatEther(totalRaised));
    setThreshold(ethers.utils.formatEther(threshold));
    setDeadline(deadline.toNumber());
    setIsThresholdMet(isThresholdMet);
    setIsAuctionWon(isAuctionWon);
  };

  const handleContribute = async () => {
    if (contract && contribution) {
      try {
        const tx = await contract.contribute({
          value: ethers.utils.parseEther(contribution),
        });
        await tx.wait();
        updateContractState(contract);
        setContribution("");
      } catch (error) {
        console.error("Error contributing:", error);
      }
    }
  };

  const handleRefund = async () => {
    if (contract) {
      try {
        const tx = await contract.refund();
        await tx.wait();
        updateContractState(contract);
      } catch (error) {
        console.error("Error requesting refund:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">ThresholdIntentAuction</h1>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p>Connected Account: {account}</p>
            <p>Total Raised: {totalRaised} ETH</p>
            <p>Threshold: {threshold} ETH</p>
            <p>Deadline: {new Date(deadline * 1000).toLocaleString()}</p>
            <p>Threshold Met: {isThresholdMet ? "Yes" : "No"}</p>
            <p>Auction Won: {isAuctionWon ? "Yes" : "No"}</p>
          </div>
          <Progress value={(totalRaised / threshold) * 100} className="mb-4" />
          <div className="flex gap-2 mb-4">
            <Input
              type="number"
              placeholder="Contribution amount (ETH)"
              value={contribution}
              onChange={(e) => setContribution(e.target.value)}
            />
            <Button onClick={handleContribute}>Contribute</Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRefund} disabled={isAuctionWon}>
            Request Refund
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ThresholdIntentAuction;
