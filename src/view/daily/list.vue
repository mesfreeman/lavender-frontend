<template>
  <div>
    <Card>
      <Form :model="searchItem" inline>
        <FormItem>
            <Input @keydown.native.enter.prevent ="listLoad" type="text" v-model="searchItem.title" placeholder="模糊匹配标题">
                <span slot="prepend">标题</span>
            </Input>
        </FormItem>
        <FormItem>
            <Button type="primary" icon="ios-search" @click="listLoad">搜索</Button>
        </FormItem>
      </Form>
      <p slot="title">日签列表</p>
      <Table :columns="columns" :data="tableData"/>
      <Page :total="summary.totalNum" show-sizer show-total @on-change="pageIndexChange" @on-page-size-change="pageSizeChange" class="page" />
    </Card>
    <Modal v-model="visible" footer-hide>
        <img :src="imgUrl" v-if="visible" style="width: 100%;">
    </Modal>
  </div>
</template>

<script>
import { list, syncDaily } from '@/api/daily'

export default {
  data () {
    return {
      visible: false,
      imgUrl: '',
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 70
        },
        {
          title: '标题',
          key: 'title',
          tooltip: true
        },
        {
          title: '日期',
          key: 'dailyDate',
          width: 100
        },
        {
          title: '封面图',
          key: 'coverUrl',
          width: 90,
          align: 'center',
          render: (h, params) => {
            return h('Icon', {
              attrs: {type: 'ios-eye', size: 24},
              on: {
                click: () => {
                  this.imgUrl = params.row.coverUrl
                  this.visible = true
                }
              }
            }, '')
          }
        },
        {
          title: '日签图',
          key: 'dailyUrl',
          width: 90,
          align: 'center',
          render: (h, params) => {
            return h('Icon', {
              attrs: {type: 'ios-eye', size: 24},
              on: {
                click: () => {
                  this.imgUrl = params.row.dailyUrl
                  this.visible = true
                }
              }
            }, '')
          }
        },
        {
          title: '状态',
          key: 'mediaId',
          width: 100,
          render: (h, params) => {
            let color = '#f29100'
            let content = '未同步'
            if (params.row.mediaId) {
              color = '#2d8cf0'
              content = '已同步'
            }
            return h('span', {
              style: { color: color}
            }, content)
          }
        },
        {
          title: '创建时间',
          key: 'createdAt'
        },
        {
          title: '操作',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('ButtonGroup', {
              attrs: {shape: 'circle'}
            },[
              h('Button', {
                attrs: {type: 'primary'},
                on: {
                  click: () => {
                    this.modifyItem(params.row.id)
                  }
                }
              }, '修改'),
              h('Button', {
                attrs: {type: 'warning'},
              }, [
                h('Poptip', {
                  props: {
                    transfer: true,
                    confirm: true,
                    title: '你确定要同步吗?'
                  },
                  on: {
                    'on-ok': () => {
                      this.syncDailyItem(params.row.id)
                    }
                  }
                }, '同步')
              ])
            ])
          }
        },
      ],
      searchItem: {
        title: '',
        pageIndex: 1,
        pageSize: 10
      },
      summary: {},
      tableData: []
    }
  },
  mounted () {
    this.listLoad()
  },
  methods: {
    pageIndexChange (pageIndex) {
      this.searchItem.pageIndex = pageIndex
      this.listLoad()
    },
    pageSizeChange (pageSize) {
      this.searchItem.pageSize = pageSize
      this.listLoad()
    },
    listLoad () {
      list(this.searchItem).then(res => {
        this.summary = res.data.result.summary
        this.tableData = res.data.result.list
      })
    },
    modifyItem (id) {
      this.$router.push({name: '/tool/daily/modify', query: {id: id}})
    },
    syncDailyItem (id) {
      const msg = this.$Message.loading({content: '同步中...', duration: 0});
      syncDaily({id: id}).then(res => {
        setTimeout(msg, 0);
        this.$Message.success(res.data.result.message);
      })
    }
  }
}
</script>

<style>
.page {
  margin-top: 10px;
  text-align: right;
}
</style>
