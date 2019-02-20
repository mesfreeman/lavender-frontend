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
  </div>
</template>

<script>
import { list } from "@/api/daily";

export default {
  data () {
    return {
      columns: [
        { title: 'ID', key: 'id' },
        { title: '标题', key: 'title' },
        { title: '日期', key: 'dailyDate' },
        {
          title: '封面图',
          key: 'coverUrl' ,
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.coverUrl,
                alt: '封面图',
                style: 'width: 30px;'
              }
            }, '')
          }
        },
        {
          title: '日签图',
          key: 'dailyUrl',
          align: 'center',
          render: (h, params) => {
            return h('Button', {
              attrs: {type:'primary', shape:'circle'},
              // style: {width: '20px'}
            }, '查看')
          }
        },
        { title: '创建时间', key: 'createdAt' },
        { title: '操作', key: 'action'}
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
