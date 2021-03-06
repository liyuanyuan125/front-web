<template>
  <div>
    <Modal v-model="value.visibleInforma" title="变更开户信息" width="700">
      <div class="digtext">
        说明：如有需要可对以下账号信息进行变更，账号变更申请提交后将由平台进行审核，
        账号变更期间不会影响账号的正常使用。
      </div>
      <Form ref="form" :model="form" :label-width="90" :rules="formRules" class="edit-input">
        <FormItem label="公司名称" prop="companyName" v-if="value.dataList.company.companyType == 1">
          <Input v-model="form.companyName" placeholder="请输入公司名称" :maxlength="40"></Input>
        </FormItem>
        <FormItem label="资质类型" prop="qualificationType">
          <Select v-model="form.qualificationType" placeholder="请选择资质类型" style="width:400px" >
            <Option 
              v-if="value.dataList.company.companyType == 1"
              v-for="item in value.dataList.qualificationTypeList"
              :value="item.code"
              :key="item.code"
            >{{ item.desc }}</Option>

            <Option 
              v-else
              v-for="item in value.dataList.personQualificationTypeList"
              :value="item.code"
              :key="item.code"
            >{{ item.desc }}</Option>

          </Select>
        </FormItem>

        <FormItem label="资质编号" prop="qualificationCode">
          <Input v-model="form.qualificationCode" placeholder="请输入资质编号"></Input>
        </FormItem>

        <FormItem label="资质图片" prop="imageList">
          <div class="upload-wrap">
            <Upload
              v-model="form.imageList"
              :max-count="3"
              multiple
              accept="images/*"
              confirm-on-del
            />
            <div class="upload-tip">支持1或3张，格式为jpg/jpeg/png，大小不超过5M的图片</div>
          </div>
        </FormItem>

      </Form>
      <div slot="footer" class="btn-center-footer">
        <Button class="button-cancel ok" @click="value.visibleInforma = false">取消</Button>
        <Button type="primary" class="button-ok ok" @click="changeData('form')">变更数据</Button>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import ViewBase from '@/util/ViewBase'
import Upload, { FileItem } from '@/components/upload'
import { changeCompanyList } from '@/api/account'

@Component({
  components: {
    Upload
  }
})
export default class Change extends ViewBase {
  @Prop({ type: Object }) value!: any

  form: any = {
    imageList: []
  }

  mounted() {
    const company = this.value.dataList.company
    this.form = {
      companyName: company.name,
      qualificationType: company.qualificationType || '',
      qualificationCode: company.qualificationCode,
      imageList: company.images || []
    }
  }
  get formRules() {
    return {
      companyName: [
        {
          require: true,
          trigger: 'blur',
          validator(rule: any, value: string[], callback: any) {
            !value ? callback(new Error('请输入公司名称')) : callback()
          }
        }
      ],
      qualificationType: [
        {
          require: true,
          trigger: 'blur',
          validator(rule: any, value: string[], callback: any) {
            !value ? callback(new Error('请选择资质类型')) : callback()
          }
        }
      ],
      qualificationCode: [
        {
          require: true,
          trigger: 'blur',
          validator(rule: any, value: string[], callback: any) {
            !value ? callback(new Error('请输入资质编号')) : callback()
          }
        }
      ],
      imageList: [
        {
          require: true,
          trigger: 'change',
          validator(rule: any, value: string[], callback: any) {
            value.length == 0 ? callback(new Error('请选择上传图片')) : callback()
          }
        }
      ]
    }
  }

  async changeData(form: any) {
    const valid = await (this.$refs[form] as any).validate()
    if (!valid) {
      return
    }
    try {
      const imageList = (this.form.imageList || []).map((item: any) => item.fileId)
      await changeCompanyList({
        ...this.form,
        imageList
      })
      this.$emit('updataChangeList')
    } catch (ex) {
      this.handleError(ex)
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/site/lib.less';
@import '~@/views/account/less/common.less';
@import '~@/views/account/less/formInput.less';
.upload-wrap {
  position: relative;
  margin-top: 10px;
  width: 400px;
}

/deep/ .ivu-modal-header {
  border-bottom: 0;
  padding: 10px 13px;
}

/deep/ .ivu-modal-body {
  font-size: 14px;
  color: #444;
  .digtext {
    margin: 0 115px 25px;
    padding: 10px;
    color: rgba(68, 68, 68, 1);
    background: rgba(230, 247, 255, 1);
    border-radius: 2px;
    border: 1px solid rgba(145, 213, 255, 1);
    line-height: 23px;
  }
  .ivu-form-item {
    margin-left: 78px;
  }
}

.item-type {
  margin-top: 3px;
}

.ok {
  width: 200px;
  height: 50px;
  background: rgba(0, 32, 45, 1);
  border-radius: 25px;
  color: #fff;
  border: 0;
}

/deep/ .ivu-modal-footer {
  padding-bottom: 30px;
}

/deep/ .ivu-checkbox + span {
  margin-left: 3px;
}

/deep/.ivu-modal-header-inner {
  text-align: center;
  line-height: 38px;
  height: 30px;
}

/deep/ .ivu-modal-close {
  z-index: 1;
  font-size: 12px;
  position: absolute;
  right: -17px;
  top: -18px;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  border-radius: 50%;
  border: 2px solid #00202d;
  color: #fff;
  width: 30px;
  height: 30px;
}

/deep/ .ivu-modal-close .ivu-icon-ios-close {
  font-size: 30px;
  font-weight: bold;
  color: #00202d;
  transition: color 0.2s ease;
  position: relative;
  top: -1px;
  left: -2px;
}

/deep/ .ivu-modal-close .ivu-icon-ios-close:hover {
  color: #00202d;
}
</style>

