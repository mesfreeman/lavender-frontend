<template>
  <div>
    <Card>
      <Form :model="searchItem" inline @keydown.native.enter.prevent ="listLoad()" :label-width="40">
          <FormItem label="ID:" :label-width="25">
              <Input type="text" v-model="searchItem.adminId" placeholder="管理员ID"></Input>
          </FormItem>
          <FormItem label="名称:">
              <Input type="text" v-model="searchItem.name" placeholder="模糊匹配昵称和真实姓名"></Input>
          </FormItem>
          <FormItem label="状态:">
            <Select v-model="searchItem.status" clearable>
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem :label-width="0">
              <Button type="primary" icon="ios-search" @click="listLoad()">查询</Button>
          </FormItem>
      </Form>
      <p slot="title">系统用户</p>
      <Table :columns="columns" :data="tableData">
        <template slot-scope="{row}" slot="status">
          <Tag v-if="row.status == 'normal'" color="primary">正常</Tag>
          <Tag v-else color="error">禁用</Tag>
        </template>
        <template slot-scope="{row, index}" slot="action">
          <ButtonGroup shape="circle">
            <Button @click="viewItem(row.adminId)" type="primary">查看</Button>
            <Button @click="modifyItem(row.adminId)" type="warning">修改</Button>
          </ButtonGroup>
        </template>
      </Table>
      <Page :total="summary.totalNum" show-sizer show-total @on-change="pageIndexChange" @on-page-size-change="pageSizeChange" class="page" />
    </Card>
    <Modal v-model="viewVisible" title="查看" draggable>
      <Row class="view-row">
        <Col span="12">ID: {{formValidate.adminId}}</Col>
        <Col span="12">昵称: {{formValidate.nickName}}</Col>
      </Row>
      <Row class="view-row">
        <Col span="12">姓名: {{formValidate.realName}}</Col>
        <Col span="12">手机号: {{formValidate.mobile}}</Col>
      </Row>
      <Row class="view-row">
        <Col span="12">邮箱: {{formValidate.email}}</Col>
        <Col span="12">状态: {{formValidate.status}}</Col>
      </Row>
      <Row class="view-row">
        角色：xx
      </Row>

    </Modal>
  </div>
</template>

<script>
import { list, viewProfile } from '@/api/admin'

export default {
  data () {
    return {
      viewVisible: false,
      statusList: [
        {
          value: 'normal',
          label: '正常'
        },
        {
          value: 'disable',
          label: '禁用'
        }
      ],
      columns: [
        {
          title: 'ID',
          key: 'adminId',
          width: 70
        },
        {
          title: '昵称',
          key: 'nickName'
        },
        {
          title: '姓名',
          key: 'realName'
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '状态',
          slot: 'status',
          width: 90
        },
        {
          title: '最后登录时间',
          key: 'loginedAt'
        },
        {
          title: '创建时间',
          key: 'createdAt'
        },
        {
          title: '最后更新时间',
          key: 'updatedAt'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center'
        }
      ],
      searchItem: {
        title: '',
        pageIndex: 1,
        pageSize: 10
      },
      summary: {},
      tableData: [],
      formValidate: {}
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
    viewItem (adminId) {
      this.viewVisible = true
      viewProfile({adminId: adminId}).then(res => {
        this.formValidate = res.data.result
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
        this.$set(this.loading1, index, false)
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
.view-row {
  margin: 6px 0px;
}
</style>
