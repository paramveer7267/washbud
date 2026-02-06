import { useQuery } from "@tanstack/react-query";
import api from "@/utils/axiosInstance";

export interface OrderById {
  _id: string;
  orderId: string;
  user: string;
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

export const useGetOrderById = (id?: string) => {
  return useQuery<OrderById, Error, OrderById>({
    queryKey: ["order", id],
    enabled: !!id,

    queryFn: async () => {
      const res = await api.get(`/orders/order/${id}`, {
        withCredentials: true,
      });
      return res.data;
    },

    select: (data) => data,

    retry: 1,
  });
};
