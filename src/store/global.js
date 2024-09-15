export const global = {
  state: () => ({
    donate_is_show: false,
    message: {
      show: false,
      content: '',
      type: ''
    }
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
    },
    open_error_message(content) {
      this.message.show = true
      this.message.content = content
      this.message.type = 'error'
    },
    open_success_message(content) {
      this.message.show = true
      this.message.content = content
      this.message.type = 'success'
    },
    close_message() {
      this.message.show = false
    }
  }
}
