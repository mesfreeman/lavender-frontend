<template>
  <div>
    <Card>
      <Form :model="searchItem" inline>
        <FormItem>
            <Input @keydown.native.enter.prevent ="loadList" type="text" v-model="searchItem.title" placeholder="模糊匹配标题">
                <span slot="prepend">标题</span>
            </Input>
        </FormItem>
        <FormItem>
            <Button type="primary" icon="ios-search" @click="loadList">搜索</Button>
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
import { list } from '@/api/daily'

export default {
  data () {
    return {
      visible: false,
      imgUrl: '',
      columns: [
        { title: 'ID', key: 'id', width: '70px' },
        { title: '标题', key: 'title' },
        { title: '日期', key: 'dailyDate', width: '100px' },
        {
          title: '封面图',
          key: 'coverUrl',
          width: '90px',
          align: 'center',
          render: (h, params) => {
            return h('Icon', {
              attrs: {
                type: 'ios-eye',
                size: '24'
              },
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
          width: '90px',
          align: 'center',
          render: (h, params) => {
            return h('Icon', {
              attrs: {
                type: 'ios-eye',
                size: '24'
              },
              on: {
                click: () => {
                  this.imgUrl = params.row.dailyUrl
                  this.visible = true
                }
              }
            }, '')
          }
        },
        { title: '创建时间', key: 'createdAt' },
        { title: '操作', key: 'action' }
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
    this.loadList()
  },
  methods: {
    loadList () {
      list(this.searchItem).then(res => {
        this.summary = res.data.result.summary
        this.tableData = res.data.result.list
      })
    },
    pageIndexChange (pageIndex) {
      this.searchItem.pageIndex = pageIndex
      this.loadList()
    },
    pageSizeChange (pageSize) {
      this.searchItem.pageSize = pageSize
      this.loadList()
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
