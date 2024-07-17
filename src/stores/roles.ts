import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      RoleId: '',
      UserId: '',
      Role: '',
      Email: '',
    },
  }),

  getters: {
    returnUserRole(state) {
      return state.user;
    },
  },

  actions: {
    addUserRole(info) {
      this.user.RoleId = info.RoleId;
      this.user.Role = info.Role;
      this.user.UserId = info.UserId;
      this.user.Email = info.Email;
    },
  },
});
