<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const vnodes = []
    let src = ''
    try {
      src = require(`@/assets/menu/${icon}.png`)
    } catch (err) {
      console.log(err)
    }
    if (icon) {
      // vnodes.push(<svg-icon icon-class={icon}/>)
      vnodes.push(<img class='munu-img-icon' src={src} />)
    }

    if (title) {
      vnodes.push(<span slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>
<style lang="scss">
.munu-img-icon{
  width:16px;
  height:16px;
  margin-right:8px;
}
</style>
