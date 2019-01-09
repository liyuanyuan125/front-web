import { get } from '@/fn/ajax'

/**
 * 获取验证码图片信息
 */
export async function getCaptchaImage() {
  const { data } = await get('/customer/captchas/image')

  if (VAR.env == 'dev') {
    data.img = data.img.replace(/^(http:)?\/\//, 'https://')
  }

  return data as { id: string, img: string }
}
