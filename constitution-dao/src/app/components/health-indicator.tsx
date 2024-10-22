"use client";

import React from "react";
import { Badge, badgeVariants } from "./ui/badge";
import { Skeleton } from "./ui/skeleton";
import { fetchTestnetStatus } from "@/api/general";
import { useQuery } from "@tanstack/react-query";

const HealthIndicator = () => {
  const [status, setStatus] = React.useState<boolean>(false);

  const { data: testnetStatus, isLoading: isStatusLoading } = useQuery({
    queryKey: ["testnetStatus"],
    queryFn: () => fetchTestnetStatus(),
    refetchInterval: 10000,
  });
  const { result, errors } = testnetStatus || {};

  React.useEffect(() => {
    if (result) {
      setStatus(true);
    } else if (errors?.includes("[p2p]")) {
      setStatus(true);
    } else {
      setStatus(false);
    }
  }, [result, errors]);

  return (
    <div className="flex items-center space-x-2 border rounded-lg p-2">
      <h3 className="text-sm">Testnet Status: </h3>
      <Badge
        variant={
          (isStatusLoading
            ? "secondary"
            : status
            ? "static-success"
            : "static-destructive") as keyof typeof badgeVariants
        }
      >
        {isStatusLoading ? (
          <Skeleton className="w-5 h-5" />
        ) : status ? (
          "Live"
        ) : (
          "Down"
        )}
      </Badge>
    </div>
  );
};

export default HealthIndicator;
