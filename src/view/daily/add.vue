<template>
  <div>
    <Row :gutter="20">
      <i-col :md="24" :lg="9" style="margin-bottom: 20px;">
        <Card shadow>
          <p slot="title">日签预览</p>
          <Row :gutter="20">
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
          </Row>
        </Card>
      </i-col>
      <i-col :md="24" :lg="15" style="margin-bottom: 20px;">
        <Card shadow>
          <p slot="title">日签编辑</p>
          <Row :gutter="20">
            <Form :model="formValidate" :label-width="80" ref="formValidate" :rules="ruleValidate">
              <FormItem label="标题" prop="title">
                <Input v-model="formValidate.title" style="width: 430px"/>
              </FormItem>
              <FormItem label="日期" prop="dailyDate">
                <DatePicker
                  :value="formValidate.dailyDate"
                  @on-change="handleChange"
                  type="date"
                  placeholder="请选择日期"
                  style="width: 430px"
                ></DatePicker>
              </FormItem>
              <FormItem label="封面图" prop="coverUrl">
                <Upload
                  ref="upload"
                  type="drag"
                  action="/api/file/upload"
                  style="width: 200px"
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
              </FormItem>
              <FormItem label="内容" prop="content">
                <Input
                  v-model="formValidate.content"
                  type="textarea"
                  :autosize="{minRows: 5,maxRows: 20}"
                  placeholder="请输入内容"
                  style="width: 430px;"
                ></Input>
              </FormItem>
              <FormItem>
                <Button type="primary" @click="handleSubmit" style="margin-left: 8px">生成日签</Button>
              </FormItem>
            </Form>
          </Row>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import { add } from "@/api/daily";
import qrcCover from "@/assets/images/qrc_cover.png";

export default {
  data() {
    return {
      qrcCover: qrcCover,
      formValidate: {
        title: "",
        dailyDate: "",
        content: "",
        coverUrl: ""
      },
      ruleValidate: {
        title: [
          { required: true, message: "标题不能为空", trigger: "blur" }
        ],
        dailyDate: [
          { required: false, message: "日期不能为空", trigger: "change" }
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "blur" }
        ],
        coverUrl: [
          { required: true, message: "封面图不能为空", trigger: "change" }
        ]
      }
    };
  },
  methods: {
    handleChange(date) {
      this.formValidate.dailyDate = date
    },
    handleSuccess(res) {
      this.formValidate.coverUrl = res.result.url;
    },
    handleSubmit() {
       this.$refs.formValidate.validate((valid) => {
          if (valid) {
            add(this.formValidate).then(res => {
              this.$Message.success('Success!');
            })
          } else {
            this.$Message.error('生成失败');
          }
      })
    }
  }
};
</script>

<style>
/* 预览区样式 */
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
