Component({
  properties: {
    show: Boolean,
    title: String,
    menu: Array,
  },
  methods: {
    clickMenu(e) {
      const { id, data } = e.target.dataset;
      this.triggerEvent('clickMenu', { id, data });
    },
    onClickWrapper() {
      this.triggerEvent('hide');
    },
  },
});
