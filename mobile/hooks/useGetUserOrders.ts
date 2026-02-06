import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axiosInstance";

export interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  service: string;
  weightCategory: string;
  pickup: string;
  dropoff: string;
  paymentMethod: string;
  orderStatus: string;
  specialItems?: string;
  orderItem?: string[];
  createdAt: string;
  updatedAt: string;
}

export const useGetUserOrders = (id?: string) => {
  return useQuery({
    queryKey: ["user-orders", id],
    enabled: !!id,

    queryFn: async () => {
      const res = await api.get(`/orders/user/${id}`, {
        withCredentials: true,
      });

      return res.data;
    },
  });
};
