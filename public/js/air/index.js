import install from '/js/libs/airui/dist/package/index.js'
// import './dist/package/page-wc/index.js'
install(['icon-wc', 'tree-wc'])
var app = new Vue({
  el: '#app',
  data () {
    var _this = this
    return {
      msg: 'Hello Vue!',
      tree: [{
        title: '入门教程',
        link: '',
        childs: [{
          title: '安装',
          link: ''
        }, {
          title: '使用',
          link: ''
        }]
      }, {
        title: 'Components',
        link: '',
        childs: [{
          title: 'Navigation(导航类)',
          link: '',
          childs: [{
            title: 'Page'
          },{
            title: 'Tree'
          }]
        }]
      }]
    }
  },
  methods: {
    select (ev) {
      console.log(ev)
      this.msg = 'Tree'
    }
  },
  mounted () {

  }
})