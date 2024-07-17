import { defineStore } from 'pinia';

export const useitemsTemplateStore = defineStore('itemsTemplate', {
  state: () => ({
    itemsTemplate: [],
  }),

  actions: {
    setItemsTemplate(payload) {
      this.itemsTemplate = payload;
    },
  },
});
