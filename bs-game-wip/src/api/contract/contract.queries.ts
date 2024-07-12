import { useQuery } from "@tanstack/react-query";

import { dummyCall } from "./contract.api";

export const query = useQuery({ queryKey: ["test"], queryFn: dummyCall });
