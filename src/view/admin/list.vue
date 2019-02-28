<template>
  <div>
    <Card>
      <Form :model="searchItem" inline @keydown.native.enter.prevent="listLoad(true)" :label-width="40">
        <FormItem label="ID:" :label-width="25">
          <Input type="text" v-model="searchItem.adminId" placeholder="管理员ID"></Input>
        </FormItem>
        <FormItem label="名称:">
          <Input type="text" v-model="searchItem.name" placeholder="模糊匹配昵称和姓名"></Input>
        </FormItem>
        <FormItem label="状态:">
          <Select v-model="searchItem.status" clearable>
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem :label-width="0">
          <Button type="primary" icon="ios-search" @click="listLoad(true)">查询</Button>
        </FormItem>
      </Form>
      <p slot="title">系统用户</p>
      <Button slot="extra" @click="createItem" type="primary">创建</Button>
      <Table @on-sort-change="handleSortChange" :columns="columns" :data="tableData">
        <template slot-scope="{row}" slot="status">
          <Tag v-if="row.status == 'normal'" color="green">正常</Tag>
          <Tag v-else color="red">禁用</Tag>
        </template>
        <template slot-scope="{row, index}" slot="action">
          <ButtonGroup shape="circle">
            <Button @click="viewItem(row.adminId)" type="primary">查看</Button>
            <Button @click="modifyItem(row.adminId)" type="success">修改</Button>
          </ButtonGroup>
        </template>
      </Table>
      <Page :total="summary.totalNum" show-sizer show-total @on-change="pageIndexChange" @on-page-size-change="pageSizeChange" class="page"/>
    </Card>
    <Modal v-model="viewVisible" title="查看" draggable footer-hide>
      <Row class="view-row">
        <Col span="12">ID：{{formValidate.adminId}}</Col>
        <Col span="12">昵称：{{formValidate.nickName}}</Col>
      </Row>
      <Row class="view-row">
        <Col span="12">姓名：{{formValidate.realName}}</Col>
        <Col span="12">手机号：{{formValidate.mobile}}</Col>
      </Row>
      <Row class="view-row">
        <Col span="12">邮箱：{{formValidate.email}}</Col>
        <Col span="12">状态：
          <Tag v-if="formValidate.status == 'normal'" color="green">正常</Tag>
          <Tag v-else color="red">禁用</Tag>
        </Col>
      </Row>
      <Row class="view-row">
        <Col span="24">角色：
          <Tag v-for="(item, key) in formValidate.roles" :key="key" color="primary">{{item}}</Tag>
        </Col>
      </Row>
      <Row class="view-row">
        <Col span="12">创建时间：{{formValidate.createdAt}}</Col>
        <Col span="12">更新时间：{{formValidate.updatedAt}}</Col>
      </Row>
      <Row class="view-row">
        <Col span="24">最后登录时间：{{formValidate.loginedAt}}</Col>
      </Row>
    </Modal>
    <Modal v-model="modifyVisible" title="修改" draggable>
      <Form :model="formValidate" :label-width="40">
        <FormItem label="ID">
          <Input v-model="formValidate.adminId" disabled/>
        </FormItem>
        <FormItem label="昵称">
          <Input v-model="formValidate.nickName"/>
        </FormItem>
        <FormItem label="邮箱">
          <Input v-model="formValidate.email" type="email"/>
        </FormItem>
        <FormItem label="状态">
          <Select v-model="formValidate.status">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="角色">
          <Select v-model="formValidate.roleIds" multiple>
            <Option v-for="(item, key) in roleList" :value="key" :key="key">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem label="密码">
          <Input v-model="formValidate.password"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="handleCancle()">取消</Button>
        <Button type="primary" size="large" @click="handleSubmit()">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { list, viewProfile, modifyProfile } from '@/api/admin'
import { liteList } from '@/api/role'

export default {
  data () {
    return {
      viewVisible: false,
      modifyVisible: false,
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
      roleList: [],
      columns: [
        {
          title: 'ID',
          key: 'adminId',
          width: 70,
          sortable: 'custom',
          sortType: 'desc'
        },
        {
          title: '昵称',
          key: 'nickName',
          sortable: 'custom'
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
          width: 90,
          sortable: 'custom'
        },
        {
          title: '最后登录时间',
          key: 'loginedAt',
          sortable: 'custom'
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
          align: 'center',
          width: 150
        }
      ],
      searchItem: {
        pageIndex: 1,
        pageSize: 10
      },
      summary: {},
      tableData: [],
      formValidate: {}
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
    listLoad (status) {
      if (status) this.searchItem.pageIndex = 1
      list(this.searchItem).then(res => {
        this.summary = res.data.result.summary
        this.tableData = res.data.result.list
      })
    },
    viewItem (adminId) {
      this.viewVisible = true
      viewProfile({ adminId: adminId }).then(res => {
        this.formValidate = res.data.result
      })
    },
    createItem () {
      this.$Message.info('暂不支持')
    },
    modifyItem (adminId) {
      viewProfile({ adminId: adminId }).then(res => {
        this.modifyVisible = true
        let roleIds = []
        for (var index in res.data.result.roles) {
          roleIds.push(index)
        }
        this.formValidate.roleIds = roleIds
        this.formValidate.adminId = res.data.result.adminId
        this.formValidate.nickName = res.data.result.nickName
        this.formValidate.email = res.data.result.email
        this.formValidate.status = res.data.result.status
      })
      liteList({}).then(res => {
        this.roleList = res.data.result.list
      })
    },
    handleCancle () {
      this.modifyVisible = false
    },
    handleSubmit () {
      modifyProfile(this.formValidate).then(res => {
        this.modifyVisible = false
        this.$Message.success('修改成功')
        this.listLoad(false)
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
  line-height: 35px;
}
.ivu-card-extra {
  top: 10px;
}
</style>
