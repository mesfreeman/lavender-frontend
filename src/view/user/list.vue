<template>
  <div>
    <Card>
      <Form :model="searchItem" inline @keydown.native.enter.prevent="listLoad()" :label-width="40">
        <FormItem label="ID:" :label-width="25">
          <Input type="text" v-model="searchItem.id" placeholder="用户ID"></Input>
        </FormItem>
        <FormItem label="手机号:" :label-width="54">
          <Input type="text" v-model="searchItem.mobile" placeholder="手机号"></Input>
        </FormItem>
        <FormItem label="名称:">
          <Input type="text" v-model="searchItem.name" placeholder="模糊匹配昵称和姓名"></Input>
        </FormItem>
        <FormItem label="最后登录时间:" :label-width="90">
          <DatePicker @on-change="handleLoginedAtChange" :options="dateOptions" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="选择最后登录时间"></DatePicker>
        </FormItem>
        <FormItem label="创建时间:" :label-width="70">
          <DatePicker @on-change="handleCreatedAtChange" :options="dateOptions" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="选择创建时间"></DatePicker>
        </FormItem>
        <FormItem :label-width="0">
          <Button type="primary" icon="ios-search" @click="listLoad()">查询</Button>
        </FormItem>
      </Form>
      <p slot="title">用户列表</p>
      <Table @on-sort-change="handleSortChange" :columns="columns" :data="tableData">
        <template slot-scope="{row}" slot="avatarUrl">
          <img :src="row.avatarUrl" style="height: 40px"/>
        </template>
        <template slot-scope="{row}" slot="status">
          <Tag v-if="row.status == 'normal'" color="success">正常</Tag>
          <Tag v-else color="error">禁用</Tag>
        </template>
        <template slot-scope="{row}" slot="source">
          <span v-if="row.source == 'WXMNP'">微信小程序</span>
          <span v-else-if="row.source == 'WXGZH'">微信公众号</span>
          <span v-else>客户端注册</span>
        </template>
      </Table>
      <Page :total="summary.totalNum" show-sizer show-total @on-change="pageIndexChange" @on-page-size-change="pageSizeChange" class="page"/>
    </Card>
  </div>
</template>

<script>
import { list } from "@/api/user";

export default {
  data() {
    return {
      dateOptions: {
        disabledDate(date) {
          return date && date.valueOf() > Date.now();
        }
      },
      columns: [
        {
          title: "ID",
          key: "id",
          width: 70,
          sortable: "custom",
          sortType: "desc"
        },
        {
          title: "昵称",
          key: "nickName"
        },
        {
          title: "姓名",
          key: "realName"
        },
        {
          title: "头像",
          slot: "avatarUrl"
        },
        {
          title: "手机号",
          key: "mobile"
        },
        {
          title: "来源",
          slot: "source",
        },
        {
          title: "状态",
          slot: "status",
        },
        {
          title: "最后登录时间",
          key: "loginedAt",
          sortable: "custom"
        },
        {
          title: "创建时间",
          key: "createdAt",
          sortable: "custom"
        }
      ],
      searchItem: {
        pageIndex: 1,
        pageSize: 10
      },
      summary: {},
      tableData: []
    };
  },
  mounted() {
    this.listLoad()
  },
  methods: {
    handleLoginedAtChange(date) {
      this.searchItem.loginedAtAfter = date[0]
      this.searchItem.loginedAtBefore = date[1]
    },
    handleCreatedAtChange(date) {
      this.searchItem.createdAtAfter = date[0]
      this.searchItem.createdAtBefore = date[1]
    },
    handleSortChange(data) {
      this.searchItem.orderBy = data.key
      this.searchItem.orderDirection = data.order
      this.listLoad()
    },
    pageIndexChange(pageIndex) {
      this.searchItem.pageIndex = pageIndex
      this.listLoad()
    },
    pageSizeChange(pageSize) {
      this.searchItem.pageSize = pageSize
      this.listLoad()
    },
    listLoad() {
      list(this.searchItem).then(res => {
        this.summary = res.data.result.summary
        this.tableData = res.data.result.list
      });
    }
  }
};
</script>

<style>
.page {
  margin-top: 10px;
  text-align: right;
}
</style>
