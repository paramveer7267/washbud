import { useMutation } from "@tanstack/react-query";
import api from "@/utils/axiosInstance";
import { useAuthUserStore } from "@/store/authUser";

export const useDeleteUser = () => {
  const { logout, user } = useAuthUserStore();

  return useMutation({
    mutationFn: async () => {
      const res = await api.delete(`/user/${user?._id}`);
      return res.data;
    },

    onSuccess: async () => {
      // Clear auth + user state
      await logout();
    },
  });
};
