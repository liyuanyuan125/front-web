/// 阿里 OSS 分片并行上传、断点续传，参考：
/// https://help.aliyun.com/document_detail/64047.html
/// @author zhangpeng
/// @date 2019-08-21

import EventClass from '@/fn/EventClass'
import deepExtend from 'deep-extend'
import { CancelableEvent } from '@/util/types'
import { get } from '@/fn/ajax'
import OSS from 'ali-oss'
import { devLog, devError, devInfo } from '@/util/dev'
import { dot } from '@/util/dealData'
import md5 from 'md5'
import { random } from '@/fn/string'
import tryParseJson from '@/fn/tryParseJson'
import triple from '@/ui/triple'

/**
 * Oss 项，用于识别不同的文件
 * 从 File 对象中摘取，参见：
 * https://developer.mozilla.org/en-US/docs/Web/API/File
 */
export interface OssItem {
  name: string
  size: number
  type: string
  lastModified: number
}

/**
 * 放入本地存储中的信息
 */
export interface Track extends OssItem {
  /** 文件名 */
  fileName: string
  /** 百分比，0 ~ 100 */
  percent: number
  /** oss checkpoint 对象 */
  checkpoint: any
  /** 最近修改时间，毫秒数 */
  lastTime: number
}

/**
 * 获取 oss 一系列参数结果
 */
export interface Token {
  /** oss 参数 region */
  region?: string
  /** oss 参数 bucket */
  bucket?: string
  /** oss 参数 stsToken */
  stsToken: string
  /** oss 参数 accessKeyId */
  accessKeyId: string
  /** oss 参数 accessKeySecret */
  accessKeySecret: string
}

/**
 * 获取 token 的函数
 */
export type GetToken = () => Promise<Token>

/** 断点续传使用策略函数参数 */
export interface UseCacheParam {
  /** 文件本身 */
  file: File
  /** 缓存中的数据 */
  track: Track
}

/**
 * 断点续传使用策略函数，返回：
 * - yes    使用断点续传
 * - no     不使用断点续传，执行重新上传
 * - cancel 取消上传（即中断上传）
 */
export type UseCache = (param: UseCacheParam) => Promise<'yes' | 'no' | 'cancel'>

/**
 * 上传选项
 */
export interface Options {
  /** 获取 token 的函数 */
  getToken?: GetToken
  /** 发生错误后的最大重试次数 */
  maxTryCount?: number
  /** 重试超时毫秒数 */
  retryTimeout?: number
  /** Track 过期时间，毫秒数 */
  expireTime?: number
  /**
   * 断点续传使用策略函数
   */
  useCache?: UseCache
}

const defaultOptions: Options = {
  async getToken() {
    const {
      data: {
        region,
        bucket,
        securityToken: stsToken,
        accessKeyId,
        accessKeySecret
      }
    } = await get('/file/sts/aiadsFileBucketToken')
    return {
      region,
      bucket,
      stsToken,
      accessKeyId,
      accessKeySecret
    }
  },
  maxTryCount: 3,
  retryTimeout: 3000,
  expireTime: 24 * 60 * 60 * 1000,
  // 默认的断点续传策略
  useCache: async ({ track }) => {
    return new Promise(async resolve => {
      const { percent } = track
      const percentText = +percent.toFixed(1)
      const yes = await triple(`发现该文件上次已上传到 ${percentText}%`, {
        yesText: '断点续传',
        noText: '重新上传',
        onCancel: () => resolve('cancel')
      })
      resolve(yes ? 'yes' : 'no')
    })
  }
}

const getOssItem = (file: File) => {
  const item: OssItem = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified
  }
  return item
}

const getHash = (value: any) => {
  const json = JSON.stringify(value)
  const hash = md5(json)
  return hash
}

const newTrack = (item: OssItem, hash: string) => {
  // 保留扩展名
  const ext = item.name ? item.name.replace(/^[^.]+/, '') : ''
  const track: Track = {
    ...item,
    // 预防重复，会被覆盖
    fileName: random('upload', hash) + ext,
    percent: 0,
    checkpoint: null,
    lastTime: Date.now()
  }
  return track
}

const storageKeyPrefix = '@ossuploadtrack'

// 清除 localStorage 内已过期的 Track
const cleanTracks = (expireTime: number) => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(storageKeyPrefix)) {
      const json = localStorage.getItem(key)
      const item = tryParseJson(json)
      if (item != null && item.lastTime > 0) {
        const dtime = Date.now() - item.lastTime
        if (dtime > expireTime) {
          localStorage.removeItem(key)
        }
      }
    }
  })
}

// 将 track 保存在本地存储
const saveTrack = (track: Track, hash: string) => {
  const json = JSON.stringify(track)
  devLog('saveTrack', track, json)
  const key = storageKeyPrefix + hash
  localStorage.setItem(key, json)
}

// 从本地存储中获取 track
const getTrack = (hash: string) => {
  const key = storageKeyPrefix + hash
  const json = localStorage.getItem(key)
  const track = tryParseJson(json) as Track | null
  return track
}

// 从本地存储中获取 track
const delTrack = (hash: string) => {
  const key = storageKeyPrefix + hash
  localStorage.removeItem(key)
}

interface UploadIntent {
  tryCount: number
  item: OssItem
  hash: string
  track: Track
}

/**
 * 本组件特定的事件对象
 */
export interface OssUploaderEvent {
  file: File
}

/** 已经获取 token 事件 */
export interface AfterGetTokenEvent extends OssUploaderEvent {
  token: Token
}

/**
 * 进度事件对象
 */
export interface ProgressEvent extends OssUploaderEvent {
  /** 进度百分比，0 ~ 100 */
  percent: number
  /** oss checkpoint 对象 */
  checkpoint: any
}

/**
 * 上传成功事件对象
 */
export interface DoneEvent extends OssUploaderEvent {
  /** 上传后的 url */
  url: string
  /** 服务器返回的原始结果 */
  result: any
}

/**
 * 上传失败事件对象
 */
export interface FailEvent extends OssUploaderEvent {
  /** 异常对象 */
  exception: any
}

/** 即将重试事件对象 */
export interface BeforeRetryEvent extends OssUploaderEvent, CancelableEvent {
  /** 第几次重试，最初的一次，作为第 0 次 */
  tryCount: number
  /** 重试的最大个数 */
  maxTryCount: number
}

/**
 * Oss 上传
 */
export default class OssUploader extends EventClass {
  private options: Options

  private client: OSS | null = null

  private file: File | null = null

  private isPausedInner: boolean = false

  public constructor(options = {} as Options) {
    super()
    this.options = deepExtend({}, defaultOptions, options)
  }

  public get isPaused() {
    return this.isPausedInner
  }

  /**
   * 上传文件
   * @param file 文件对象
   */
  public async upload(
    file: File,
    /* 选项是内部参数 */
    {
      // resume 模式，不判断，直接恢复
      resume = false
    }: any = {}
  ) {
    const { expireTime, useCache } = this.options
    cleanTracks(expireTime!)

    const item = getOssItem(file)
    const hash = getHash(item)
    const cachedTrack = getTrack(hash)

    let track = newTrack(item, hash)

    if (cachedTrack != null) {
      // 当缓存中的数据存在时，执行断点续传使用策略函数
      const cacheResult = resume
        ? 'yes'
        : await useCache!({ file, track: cachedTrack })

      if (cacheResult == 'cancel') {
        return
      }

      if (cacheResult == 'yes') {
        // 恢复 file，本地存储（JSON）无法保存 file 引用
        cachedTrack.checkpoint.file = file
        track = cachedTrack
      }
    }

    this.uploadWork(file, {
      tryCount: 0,
      item,
      hash,
      track
    })
  }

  async uploadWork(
    file: File,
    {
      tryCount = 0,
      item,
      hash,
      track
    }: UploadIntent
  ) {
    const { getToken, maxTryCount, retryTimeout } = this.options

    try {
      if (tryCount == 0) {
        // 发出开始事件，这个是全局的开始
        this.emit('begin')
        this.setIsPaused(false)
      }

      // 发出将要获取 token 事件
      this.emit('beforeGetToken')
      const token = await getToken!()
      // 发出已经获取 token 事件
      const afterGetTokenEvent: AfterGetTokenEvent = { file, token }
      this.emit('afterGetToken', afterGetTokenEvent)

      const client = this.client = new OSS(token)

      // 将 file 保存下来，以便 pause 后 resume
      this.file = file

      const { fileName, checkpoint: savedCheckPoint } = track

      // 发出准备事件（multipartUpload 会进行分片等耗时操作）
      this.emit('prepare')
      const result = await client.multipartUpload(fileName, file, {
        // 支持从 checkpoint 恢复
        checkpoint: savedCheckPoint,
        progress: (p, checkpoint) => {
          const percent = p * 100
          const progressEvent: ProgressEvent = {
            file,
            percent,
            checkpoint,
          }
          this.emit('progress', progressEvent)
          track.percent = percent
          track.checkpoint = checkpoint
          track.lastTime = Date.now()
          saveTrack(track, hash)
          devLog('=> p', p, ' checkpoint', checkpoint)
        }
      })

      const url = dot(result, 'res.requestUrls[0]')
      devLog(url, result)

      // 发出上传成功 done 事件
      const doneEvent: DoneEvent = { file, url, result }
      this.emit('done', doneEvent)

      delTrack(hash)
    } catch (ex) {
      // 判断是否是取消
      if (ex && ex.status == 0 && ex.name == 'cancel') {
        return
      }

      // 发出上传失败 fail 事件
      const failEvent: FailEvent = { file, exception: ex }
      this.emit('fail', failEvent)
      devError('[OssUploader] upload fail:', ex)

      // 重试逻辑
      const nextTryCount = tryCount + 1

      if (nextTryCount <= maxTryCount!) {
        // 发出 beforeRetry 事件，该事件可以通过设置 anceled 拦截接下来的操作
        const beforeRetryEvent: BeforeRetryEvent = {
          file,
          canceled: false,
          tryCount: nextTryCount,
          maxTryCount: maxTryCount!
        }
        this.emit('beforeRetry', beforeRetryEvent)
        if (beforeRetryEvent.canceled) {
          // 发出结束事件，这个是全局的结束
          this.emit('end')
          return
        }

        setTimeout(() => {
          devInfo('[OssUploader] tryCount:', nextTryCount, '/', maxTryCount)

          this.uploadWork(file, {
            tryCount: nextTryCount,
            item,
            hash,
            track
          })
        }, retryTimeout)
      } else {
        // 发出结束事件，这个是全局的结束
        this.emit('end')
      }
    }
  }

  /**
   * 暂停上传
   */
  public pause() {
    const client = this.client as any
    if (client != null) {
      // cancel 方法未在文档中说明
      client.cancel()
      this.setIsPaused(true)
    }
  }

  /**
   * 恢复上传
   */
  public resume() {
    const client = this.client
    if (client != null) {
      this.upload(this.file!, { resume: true })
    }
  }

  private setIsPaused(value: boolean) {
    if (value != this.isPausedInner) {
      this.isPausedInner = value
      this.emit('isPausedChanged', value)
    }
  }
}
