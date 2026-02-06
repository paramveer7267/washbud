import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import api from "@/utils/axiosInstance";

type CancelOrderPayload = {
  _id: string;
  orderStatus?: string;
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ _id, orderStatus }: CancelOrderPayload) => {
      if (orderStatus && orderStatus !== "pending") {
        throw new Error("Only pickup pending orders can be cancelled.");
      }

      const res = await api.patch(
        `/orders/${_id}`,
        { orderStatus: "cancelled" },
        { withCredentials: true },
      );

      return res.data;
    },

    onSuccess: (_, variables) => {
      Toast.show({
        type: "success",
        text1: "Order cancelled successfully",
        position: "top",
        topOffset: 60,
      });

      queryClient.invalidateQueries({ queryKey: ["user-orders"] });
      queryClient.invalidateQueries({
        queryKey: ["order", variables._id],
      });
    },

    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1:
          error?.response?.data?.message ||
          error?.message ||
          "Failed to cancel order",
      });
    },
  });
};
