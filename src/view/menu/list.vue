<template>
  <div>
    <Card>
      <p slot="title">菜单管理</p>
      <Button slot="extra" @click="addItem" type="primary">添加菜单</Button>
      <Table :columns="columns" :data="tableData">
        <template slot-scope="{row}" slot="icon">
          <Icon :type="row.icon" size="20" />
        </template>
        <template slot-scope="{row}" slot="title">
          <span v-html="row.title" />
        </template>
        <template slot-scope="{row}" slot="type">
          <Tag v-if="row.type == 'api'" color="cyan">接口</Tag>
          <Tag v-else color="blue">导航</Tag>
        </template>
        <template slot-scope="{row}" slot="status">
          <Tag v-if="row.status == 'normal'" color="green">正常</Tag>
          <Tag v-else color="red">禁用</Tag>
        </template>
        <template slot-scope="{row, index}" slot="action">
          <ButtonGroup shape="circle">
            <Button @click="modifyItem(row.id)" type="success">修改</Button>
            <Button type="error">
              <Poptip @on-ok="deleteItem(row.id)" title="你确定要删除吗？" :transfer="true" :confirm="true">删除</Poptip>
            </Button>
          </ButtonGroup>
        </template>
      </Table>
    </Card>

    <Modal v-model="changeVisible" :title="changeType=='add'?'添加菜单':'修改菜单'" draggable>
      <Form :model="formValidate" :label-width="50">
        <FormItem label="父级：">
          <Select v-model="formValidate.parentId" clearable>
            <Option v-for="item in tableData" :value="item.id" :key="item.id">{{ item.title }}</Option>
          </Select>
        </FormItem>
        <FormItem label="名称：">
          <Input v-model="formValidate.title" placeholder="菜单名称不允许重复"/>
        </FormItem>
        <FormItem label="类型：">
          <RadioGroup v-model="formValidate.type" type="button">
            <Radio label="api">接口</Radio>
            <Radio label="nav">导航</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem v-if="changeType==='modify'" label="状态：">
          <Select v-model="formValidate.status">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="图标：">
          <Input v-model="formValidate.icon" placeholder="暂仅支持ivew内部图标" style="width:90%; margin-right:10px;"/>
          <Icon :type="formValidate.icon" size="25"/>
        </FormItem>
        <FormItem label="路由：">
          <Input v-model="formValidate.route" placeholder="页面、链接或接口地址"/>
        </FormItem>
        <FormItem label="排序：">
          <Input v-model="formValidate.sort" :number="true" placeholder="数字越大越靠前"/>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" size="large" @click="handleCancle">取消</Button>
        <Button type="primary" size="large" @click="handleSubmit">确定</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { list, add, view, modify, deleteItem } from '@/api/menu'

export default {
  data () {
    return {
      changeVisible: false,
      changeType: 'add',
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
          key: 'id',
          width: 70
        },
        {
          title: '图标',
          slot: 'icon',
          width: 70
        },
        {
          title: '名称',
          slot: 'title'
        },
        {
          title: '路由',
          key: 'route'
        },
        {
          title: '排序',
          key: 'sort'
        },
        {
          title: '类型',
          slot: 'type'
        },
        {
          title: '状态',
          slot: 'status'
        },
        {
          title: '操作',
          slot: 'action',
          align: 'center',
          width: 150
        }
      ],
      tableData: [],
      formValidate: {}
    }
  },
  mounted () {
    this.listLoad()
  },
  methods: {
    listLoad () {
      list(this.searchItem).then(res => {
        this.tableData = res.data.result.list
      })
    },
    addItem () {
      this.changeVisible = true
      this.changeType = 'add'
      this.formValidate = {}
      this.formValidate.type = 'api'
    },
    modifyItem (id) {
      view({ id: id }).then(res => {
        this.changeVisible = true
        this.changeType = 'modify'
        this.formValidate = res.data.result
      })
    },
    deleteItem (id) {
      deleteItem({ id: id }).then(res => {
        this.$Message.success('删除成功')
        this.listLoad(false)
      })
    },
    handleCancle () {
      this.changeVisible = false
    },
    handleSubmit () {
      if (this.changeType === 'add') {
        add(this.formValidate).then(res => {
          this.changeVisible = false
          this.$Message.success('添加成功')
          this.listLoad(false)
        })
      } else {
        modify(this.formValidate).then(res => {
          this.changeVisible = false
          this.$Message.success('修改成功')
          this.listLoad(false)
        })
      }
    }
  }
}
</script>

<style>
.ivu-card-extra {
  top: 10px;
}
</style>
