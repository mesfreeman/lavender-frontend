<template>
  <div>
    <Card>
      <Form :model="searchItem" inline @keydown.native.enter.prevent ="listLoad(true)">
        <FormItem>
            <Input type="text" v-model="searchItem.title" placeholder="模糊匹配标题">
                <span slot="prepend">标题</span>
            </Input>
        </FormItem>
        <FormItem>
            <Button type="primary" icon="ios-search" @click="listLoad(true)">查询</Button>
        </FormItem>
      </Form>
      <p slot="title">日签列表</p>
      <Table @on-sort-change="handleSortChange" :columns="columns" :data="tableData">
        <template slot-scope="{row}" slot="coverUrl">
          <Icon @mouseenter.native="imageShow(row.coverUrl)" type="ios-eye" size="24"></Icon>
        </template>
        <template slot-scope="{row}" slot="dailyUrl">
          <Icon @mouseenter.native="imageShow(row.dailyUrl)" type="ios-eye" size="24"></Icon>
        </template>
        <template slot-scope="{row}" slot="mediaId">
          <Tag v-if="row.mediaId" color="green">已同步</Tag>
          <Tag v-else color="red">未同步</Tag>
        </template>
        <template slot-scope="{row, index}" slot="action">
          <ButtonGroup shape="circle">
            <Button @click="modifyItem(row.id)" type="success">修改</Button>
            <Button type="warning" :loading="loading1[index]">
              <Poptip @on-ok="syncDailyItem(row.id, index)" title="你确定要同步吗？" :transfer="true" :confirm="true">同步</Poptip>
            </Button>
          </ButtonGroup>
        </template>
      </Table>
      <Page :total="summary.totalNum" :current="summary.pageIndex" show-sizer show-total @on-change="pageIndexChange" @on-page-size-change="pageSizeChange" class="page" />
    </Card>
    <Modal class="image" v-model="visible" :closable="false" footer-hide>
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
      loading1: [],
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 70,
          sortable: 'custom',
          sortType: 'desc'
        },
        {
          title: '标题',
          key: 'title',
          tooltip: true
        },
        {
          title: '日期',
          key: 'dailyDate',
          width: 100,
          sortable: 'custom'
        },
        {
          title: '封面图',
          slot: 'coverUrl',
          width: 90,
          align: 'center'
        },
        {
          title: '日签图',
          slot: 'dailyUrl',
          width: 90,
          align: 'center'
        },
        {
          title: '状态',
          slot: 'mediaId',
          width: 100
        },
        {
          title: '创建时间',
          key: 'createdAt',
          sortable: 'custom'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 170
        }
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
    this.listLoad(true)
  },
  methods: {
    handleSortChange (data) {
      this.searchItem.orderBy = data.key
      this.searchItem.orderDirection = data.order
      this.listLoad(false)
    },
    pageIndexChange (pageIndex) {
      this.searchItem.pageIndex = pageIndex
      this.listLoad(false)
    },
    pageSizeChange (pageSize) {
      this.searchItem.pageSize = pageSize
      this.listLoad(false)
    },
    imageShow (imgUrl) {
      this.imgUrl = imgUrl
      this.visible = true
    },
    listLoad (status) {
      if (status) this.searchItem.pageIndex = 1
      list(this.searchItem).then(res => {
        this.summary = res.data.result.summary
        this.tableData = res.data.result.list
      })
    },
    modifyItem (id) {
      this.$router.push({ name: '/tool/daily/modify', query: { id: id } })
    },
    syncDailyItem (id, index) {
      this.$set(this.loading1, index, true)
      syncDaily({ id: id }).then(res => {
        this.$Message.success(res.data.result.message)
        this.tableData[index].mediaId = res.data.result.mediaId
        this.$set(this.loading1, index, false)
      }).catch(err => {
        if (err) this.$set(this.loading1, index, false)
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
.image .ivu-modal-body {
  line-height: 0;
  padding: 0;
}
</style>
