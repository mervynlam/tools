export const global = {
  state: () => ({
    donate_is_show: false
  }),
  getters: {
    donateIsShow: (state) => state.donate_is_show
  },
  actions: {
    open_donate() {
      this.donate_is_show = true
    },
    close_donate() {
      this.donate_is_show = false
    }
  }
}
