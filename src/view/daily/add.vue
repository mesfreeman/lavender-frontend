<template>
  <div>
    <Row :gutter="20">
      <Card shadow style="left:8px; width:560px; position:absolute;">
        <p slot="title">日签预览</p>
        <div class="view">
          <div class="dayCard">
            <div class="cover">
              <div class="bgCover">
                <img v-if="formValidate.coverUrl" :src="formValidate.coverUrl">
              </div>
              <div class="qrcCover">
                <img :src="qrcCover">
              </div>
            </div>
            <div class="content">{{formValidate.content}}</div>
            <div class="footer">
              <div class="from">From:《{{formValidate.title}}》</div>
              <div class="shotLine"></div>
              <div class="date">{{formValidate.dailyDate}}</div>
            </div>
          </div>
        </div>
      </Card>
      <Card shadow style="position:absolute; left:585px; right:20px; overflow:hidden;">
        <p v-if="formValidate.id" slot="title">修改日签</p>
        <p v-else slot="title">添加日签</p>
        <Row :gutter="20">
          <Form :model="formValidate" :label-width="80" ref="formValidate" :rules="ruleValidate">
            <FormItem label="标题" prop="title" style="margin-top: 16px;">
              <Input v-model="formValidate.title" style="width: 90%;"/>
            </FormItem>
            <FormItem label="日期">
              <DatePicker
                :value="formValidate.dailyDate"
                @on-change="handleChange"
                type="date"
                placeholder="请选择日期"
                style="width: 90%"
              ></DatePicker>
            </FormItem>
            <FormItem label="主图" prop="coverUrl">
              <Upload
                ref="upload"
                type="drag"
                action="/api/file/upload"
                style="width: 210px"
                :show-upload-list="false"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
              >
                <div style="height: 120px;">
                  <img
                    v-if="formValidate.coverUrl"
                    :src="formValidate.coverUrl"
                    class="previewImg"
                  >
                  <Icon
                    v-else
                    type="ios-cloud-upload"
                    size="52"
                    style="color: #3399ff; line-height: 120px;"
                  ></Icon>
                </div>
              </Upload>
              <Input v-model="formValidate.coverUrl" placeholder="主图地址" style="width: 210px; margin: 5px 10px 0px 0px;" />
              <Input v-model="keyword" search @on-search="handleSearch(keyword)" placeholder="关键词" style="width: 210px; margin: 5px 10px 0px 0px;" />
            </FormItem>
            <FormItem label="内容" prop="content">
              <Input
                v-model="formValidate.content"
                type="textarea"
                :autosize="{minRows: 5,maxRows: 20}"
                placeholder="请输入内容"
                style="width: 90%"
              ></Input>
            </FormItem>
            <FormItem>
              <Button @click="handleContent" :loading="loading1" type="primary" style="margin-right: 8px">采集内容</Button>
              <Button v-if="formValidate.id" @click="handleSubmit" :loading="loading2" type="primary">修改日签</Button>
              <Button v-else @click="handleSubmit" :loading="loading2" type="primary">添加日签</Button>
            </FormItem>
          </Form>
        </Row>
      </Card>
    </Row>
  </div>
</template>

<script>
import { add, modify, view, captureCover, captureNote } from '@/api/daily'
import qrcCover from '@/assets/images/qrc_cover.png'

export default {
  data () {
    return {
      qrcCover: qrcCover,
      keyword: '',
      loading1: false,
      loading2: false,
      formValidate: {
        id: this.$route.query.id,
        title: '',
        dailyDate: '',
        content: '',
        coverUrl: ''
      },
      ruleValidate: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不能为空', trigger: 'blur' }
        ],
        coverUrl: [
          { required: true, message: '封面图不能为空', trigger: 'change' }
        ]
      }
    }
  },
  mounted () {
    this.formValidate.dailyDate = this.formatDate(new Date())
    if (this.formValidate.id) {
      view({ id: this.formValidate.id }).then(res => {
        this.formValidate = res.data.result
      })
    }
  },
  methods: {
    handleChange (date) {
      this.formValidate.dailyDate = date
    },
    handleSuccess (res) {
      this.formValidate.coverUrl = res.result.url
    },
    handleSearch (keyword) {
      captureCover({ keyword: keyword }).then(res => {
        this.formValidate.coverUrl = res.data.result.coverUrl
      })
    },
    handleContent () {
      this.loading1 = true
      captureNote({}).then(res => {
        this.$Message.success('采集成功')
        this.loading1 = false
        this.formValidate.content = res.data.result.content
        this.formValidate.title = res.data.result.title
        if (res.data.result.coverUrl) {
          this.formValidate.coverUrl = res.data.result.coverUrl
        }
      }).catch(err => {
        if (err) this.loading1 = false
      })
    },
    handleSubmit () {
      this.loading2 = true
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          if (this.formValidate.id) {
            modify(this.formValidate).then(res => {
              this.loading2 = false
              this.$Message.success('日签修改成功')
              this.$router.push({ name: '/tool/daily/list' })
            }).catch(err => {
              if (err) this.loading1 = false
            })
          } else {
            add(this.formValidate).then(res => {
              this.loading2 = false
              this.$Message.success('日签添加成功')
              this.$router.push({ name: '/tool/daily/list' })
            }).catch(err => {
              if (err) this.loading2 = false
            })
          }
        } else {
          this.loading2 = false
          this.$Message.error('日签添加失败')
        }
      })
    },
    formatDate (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? '0' + m : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    }
  }
}
</script>

<style>
/* 预览区样式 */
.ivu-card-body {
  padding: 0px;
}
.view {
  font-family: Arial, Helvetica, sans-serif;
  background-color: #fefefe;
  padding: 30px;
  font-size: 18px;
  letter-spacing: 3px;
  width: 560px;
}
.dayCard {
  width: 500px;
  box-shadow: black 0 0 25px;
}
.bgCover {
  width: 100%;
  height: 296px;
  overflow: hidden;
  background-color: #009688;
  position: relative;
}
.bgCover img, .previewImg {
  width: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.qrcCover {
  position: absolute;
  top: 225px;
  left: 450px;
}
.qrcCover img {
  width: 66px;
}
.content {
  word-wrap:break-word;
  margin: 20px 28px;
  text-align: justify;
  line-height: 37px;
}
.footer {
  text-align: center;
  letter-spacing: 1px;
  font-size: 16px;
}
.from {
  color: #917b80;
  margin-bottom: 20px;
}
.shotLine {
  width: 11%;
  height: 2px;
  margin: 0 auto 18px;
  background-color: #1b93fb;
}
.date {
  padding-bottom: 30px;
  color: #1f9155;
}
</style>
