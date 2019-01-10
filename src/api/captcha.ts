import { post } from '@/fn/ajax'

/**
 * 获取验证码图片信息
 */
export async function getCaptchaImage() {
  const { data: { imageCaptcha } } = await post('/captcha/images')

  // TODO: 应该去掉
  if (VAR.env == 'dev') {
    imageCaptcha.url = imageCaptcha.url.replace(/^(http:)?\/\//, 'https://')
  }

  return {
    id: imageCaptcha.ticket,
    img: imageCaptcha.url,
  }
}
