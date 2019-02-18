<template>
  <div class="admin-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Icon type="ios-person" size="25" />
      <span class="adminName">{{ adminName ? adminName : '暂无' }}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="admin">个人中心</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './admin.less'
import { mapActions } from 'vuex'
export default {
  name: 'Admin',
  props: {
    adminName: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    handleClick (name) {
      switch (name) {
        case 'logout':
          this.handleLogOut().then(() => {
            this.$router.push({
              name: 'login'
            })
          })
          break
        case 'admin':
          this.$router.push({
            name: 'admin'
          })
          break
      }
    }
  }
}
</script>
