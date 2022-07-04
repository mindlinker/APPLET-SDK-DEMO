Component({
  properties: {
    height: {
      type: Number,
      value: 72,
    },
    locked: Boolean,
  },
  methods: {
    clickTitle() {
      this.triggerEvent('clickTitle');
    },
    back() {
      this.triggerEvent('back');
    },
  },
});
