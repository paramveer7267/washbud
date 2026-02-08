import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axiosInstance";

export const useGetOrderByOrderId = (orderId?: string | null) => {
  return useQuery({
    queryKey: ["order-by-orderId", orderId],
    queryFn: async () => {
      if (!orderId) return null;

      const res = await api.get(`/orders/order-id/${orderId}`);
      return res.data;
    },
    enabled: !!orderId,
    retry: false,
  });
};
