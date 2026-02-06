import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import api from "@/utils/axiosInstance";

// --------------------
// TYPES
// --------------------

export interface CreateOrderPayload {
  user: string;
  weightCategory: string;
  customerName: string;
  service: string;
  pickup: string;
  dropoff: string;
  paymentMethod: string;
  specialItems?: string;
  orderItem: string[];
}

// --------------------
// HOOK
// --------------------
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateOrderPayload) => {
      const res = await api.post("/orders", payload, {
        withCredentials: true,
      });

      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user-orders"],
      });

      Toast.show({
        type: "success",
        text1: "Order placed successfully",
        position: "top",
        topOffset: 60,
      });
    },

    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Failed to place order",
      });
    },
  });
};
