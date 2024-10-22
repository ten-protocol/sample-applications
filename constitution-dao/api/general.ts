import { httpRequest } from "@/api";
import { apiRoutes } from "@/src/routes";
import { ResponseDataInterface } from "@/src/lib/types/common";

export const fetchTestnetStatus = async (): Promise<
  ResponseDataInterface<boolean>
> => {
  return await httpRequest<ResponseDataInterface<boolean>>({
    method: "get",
    url: apiRoutes.getHealthStatus,
  });
};
