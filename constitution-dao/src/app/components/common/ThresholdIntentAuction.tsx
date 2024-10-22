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
import { Clock, Loader2 } from "lucide-react";
import { useCountdown } from "@/src/hooks/useCountdown";
import useContractStore from "@/src/stores/contract-store";
import useWalletStore from "@/src/stores/wallet-store";
import { Skeleton } from "../ui/skeleton";

const ThresholdIntentAuction = () => {
  const {
    deadline,
    totalRaised,
    contribution,
    isThresholdMet,
    isAuctionWon,
    setContribution,
    loading: contractLoading,
    handleContribute,
    handleRefund,
    progressEstimate,
  } = useContractStore();

  const {
    walletConnected,
    address,
    isWrongNetwork,
    connectWallet,
    switchNetwork,
    loading: walletLoading,
  } = useWalletStore();

  const timeLeft = useCountdown(deadline);

  useEffect(() => {
    if (!walletConnected) {
      connectWallet();
    }

    return () => {
      const contractStore = useContractStore.getState();
      contractStore.cleanup();
    };
  }, []);

  const loading = contractLoading || walletLoading;

  if (loading) {
    <Skeleton className="w-full h-96" />;
  }

  if (!walletConnected && !isWrongNetwork && !loading) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-lg mx-auto">
          <CardContent className="flex flex-col items-center gap-4">
            <p>Please connect your wallet to participate in the auction</p>
            <Button onClick={connectWallet}>Connect Wallet</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isWrongNetwork) {
    return (
      <div className="container mx-auto p-4">
        <Card className="max-w-lg mx-auto">
          <CardContent className="flex flex-col items-center gap-4">
            <p>Please switch to the correct network</p>
            <Button onClick={switchNetwork}>Switch Network</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <h1 className="text-2xl font-bold">TEN Threshold Intent Auction</h1>
          <p className="text-sm text-gray-500">
            Powered by TEN&apos;s Shared Private State
          </p>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <AlertTitle>TEN Features Showcase</AlertTitle>
            <AlertDescription>
              Experience smartly transparent auctions with MEV protection and
              shared private state.
            </AlertDescription>
          </Alert>
          <div className="mb-4 space-y-2">
            <p>
              <span className="font-semibold">Connected Account:</span>{" "}
              {address}
            </p>
            <p>
              <span className="font-semibold">Total Raised:</span> {totalRaised}{" "}
              ETH
            </p>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-semibold">Time Remaining:</span>
              <span
                className={`${
                  timeLeft === "Auction ended" ? "text-red-500" : ""
                }`}
              >
                {timeLeft}
              </span>
            </div>
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
              Estimated Progress (TEN&apos;s Shared Private State)
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
              disabled={timeLeft === "Auction ended"}
            />
            <Button
              onClick={handleContribute}
              disabled={loading || timeLeft === "Auction ended"}
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
          <div className="flex flex-col gap-2 w-full items-center">
            <p className="text-sm text-gray-500 mb-2">
              Request a refund if the auction is unsuccessful.
            </p>
            <Button
              onClick={handleRefund}
              disabled={isAuctionWon || loading || timeLeft !== "Auction ended"}
              className="w-full"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Request Refund"
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ThresholdIntentAuction;
