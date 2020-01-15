module.exports = {
  title: '电池管理系统',

  /**
   * @type {boolean} true | false
   * @description 是否显示右侧面板的设置
   */
  showSettings: false,

  /**
   * @type {boolean} true | false
   * @description 是否需要tagsView
   */
  tagsView: false,

  /**
   * @type {boolean} true | false
   * @description 是否固定头部
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description 是否在侧边栏中显示logo
   */
  sidebarLogo: true,

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
