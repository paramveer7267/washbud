import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axiosInstance";

export const useGetOrderByOrderId = (orderId?: string | null) => {
  return useQuery({
    queryKey: ["order-by-orderId", orderId],
    queryFn: async () => {
      if (!orderId) return null;

      const res = await api.get(`/orders/order-id/${orderId}`);
      console.log("Fetched order by orderId:", res.data);
      return res.data;
    },
    enabled: !!orderId,
    retry: false, // ✅ avoid retry spam for invalid IDs
  });
};
