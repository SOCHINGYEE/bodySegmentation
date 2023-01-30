import "./App.css";

import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/selfie_segmentation';

import DPlayer from "dplayer";


import { useRef, useState, useEffect } from "react";
import { Form, Radio, Switch, Slider, message, Spin } from "antd";
import { clearWebGLContext } from "@tensorflow/tfjs-backend-webgl/dist/canvas_util";






function App() {

const [maskImageUrl,setMaskImageUrl] = useState('')
const [isMaskOpen,setIsMaskOpen] = useState(true)
const [loading,setLoading] = useState(true)

const dplayer = useRef(null)
const container = useRef(null)
const segmenter = useRef(null)
const animation = useRef(null)

useEffect(() => {

  dplayerInit()


}, [])

const danmaku = ["时 隔 四 年 依 然 经 典", "小小房间竟然人才辈出，实在是恐怖如斯", "《有生之年看到原版》", "以前的鲲鲲充满了自信和笑容", "梦开始的地方", "1.自我介绍", "这短暂的一分钟养活了多少up主（doge）", "万 恶 之 源", "《开 始 吟 唱》", "《名场面》", "《music》", "《经典咏流传》", "非物质文化遗产", "《文艺复兴》", "《白 带 异 常》", "梦开始的地方，我的梦回来了", "每一帧都是经典", "每一帧都是表情包诶", "《梦开始的地方》", "5.优雅转身", "前 方 高 能", "准备铁山靠", "《铁山靠》", "招式3:《铁 山 靠》", "坤法第一式：铁山靠", "小秘密：随便一帧都是经典画面", "《白鹤亮翅》", "跳水00:40", "《 老 肩 巨 滑 》", "《每天一遍，精神百倍》", "优雅，真的是优雅", "《经典永流传》", "《垂直握把》", "《起舞弄清影》", "每时每刻打开都有人在看系列", "《护裆派》", "《让我蠢蠢欲动》", "᭙ᦔꪀꪑᦔ，​", "这种感觉我从未有Cause I Got A Cush On You Who You", "武当（档）派", "爷不知道就他笑死了多少无辜的生命", "《国家宝藏》之家禽", "《无效定语从句》", "卧槽，每一帧都是万恶之源", "“鳖”", "每日一遍", "嘎子偷狗时代考察", "《亡之音》", "看见这个头型我就想笑", "最后亿遍", "期待的话，请多多为我投票吧！", "《作词作曲》", "你干嘛∽哈哈～哎呦", "糖果超甜", "笑死我了哈哈哈哈", "你是我的我是你的谁", "原版都这么滑稽哈哈哈", "你不要过来！！！", "《啥时候都有人》", "我的口头禅"]



// 加载模型
async function bodySegmentationInit(){
  try{

    const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
    const segmenterConfig = {
      runtime:'mediapipe',
      modelType:'genernal', // or landscape
      solutionPath:'https://unpkg.com/@mediapipe/selfie_segmentation', // 不写可能会用不了这个库
    }
    segmenter.current = await bodySegmentation.createSegmenter(model,segmenterConfig)
 
    dplayer.current?.notice('模型加载完成',3000)
    setLoading(false)
  
  }catch(e){
    dplayer.current?.notice(`模型加载失败${e}`,3000)
    setLoading(false)
  }
}

// 播放器初始化
  async function dplayerInit(){
  dplayer.current = new DPlayer({
    container:container.current,
    loop:true,
    video:{
      url: "https://dcdn.it120.cc/2022/11/04/87b7b5af-476c-4d2b-ae90-36724d66a407.mp4"
    },
    danmaku:true,
  })
  dplayer.current.video.setAttribute('crossorigin', 'anonymous') // /在发送跨域请求时不携带凭证（credential）信息 这里不写的话 canvas调用getImageData会报跨域的错误
  await segmenter.current?.dispose() //从内存中释放基础模型。
  await bodySegmentationInit()
 

  dplayer.current.on('play',async ()=>{
    animation.current = window.requestAnimationFrame(recognition)
  })

  dplayer?.current?.on('pause',()=>{
    cancelAnimationFrame(animation.current)
  })
}

// canvas压缩视频的每一帧
function compress(el){
  return new Promise(async resolve => {
  
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    // 原始尺寸
    const elRect = el.getBoundingClientRect(); //返回的是矩形的集合，表示了当前盒子在浏览器中的位置以及自身占据的空间的大小
    const originWidth = elRect.width;
    const originHeight = elRect.height;

    // 最大尺寸限制
    const maxWidth = 350;
    const maxHeight = 350;

    let targetWidth = originWidth
    let targetHeight = originHeight

    // 目标尺寸
    if(originHeight > maxHeight || originWidth > maxWidth){
      if(originWidth / originHeight > maxWidth / maxHeight){
        // 更宽
        targetWidth = maxWidth
        targetHeight = Math.round(maxWidth*(originHeight/originWidth))
      }else {
        targetHeight = maxHeight
        targetWidth = Math.round(maxWidth*(originWidth/originHeight))
      }
    }
    // canvas对图片进行缩放
    canvas.width = targetWidth
    canvas.height = targetHeight

    // 清除画布
    context.clearRect(0,0,targetWidth,targetHeight)

    // 压缩
    context.drawImage(el,0,0,targetHeight,targetHeight)
  
    const imageData = context.getImageData(0,0,targetWidth,targetHeight)
    resolve(imageData)
  })
}

function imgLoad(src){
  return new Promise((resolve,reject) => {
    const img = new Image();
    img.src = src
    img.onload = () => resolve(img)

    img.onerror = (e) => reject(`图片加载失败${e}`)
  })
}

function randomDanmaku() {
  const danmaku = ["时 隔 四 年 依 然 经 典", "小小房间竟然人才辈出，实在是恐怖如斯", "《有生之年看到原版》", "以前的鲲鲲充满了自信和笑容", "梦开始的地方", "1.自我介绍", "这短暂的一分钟养活了多少up主（doge）", "万 恶 之 源", "《开 始 吟 唱》", "《名场面》", "《music》", "《经典咏流传》", "非物质文化遗产", "《文艺复兴》", "《白 带 异 常》", "梦开始的地方，我的梦回来了", "每一帧都是经典", "每一帧都是表情包诶", "《梦开始的地方》", "5.优雅转身", "前 方 高 能", "准备铁山靠", "《铁山靠》", "招式3:《铁 山 靠》", "坤法第一式：铁山靠", "小秘密：随便一帧都是经典画面", "《白鹤亮翅》", "跳水00:40", "《 老 肩 巨 滑 》", "《每天一遍，精神百倍》", "优雅，真的是优雅", "《经典永流传》", "《垂直握把》", "《起舞弄清影》", "每时每刻打开都有人在看系列", "《护裆派》", "《让我蠢蠢欲动》", "᭙ᦔꪀꪑᦔ，​", "这种感觉我从未有Cause I Got A Cush On You Who You", "武当（档）派", "爷不知道就他笑死了多少无辜的生命", "《国家宝藏》之家禽", "《无效定语从句》", "卧槽，每一帧都是万恶之源", "“鳖”", "每日一遍", "嘎子偷狗时代考察", "《亡之音》", "看见这个头型我就想笑", "最后亿遍", "期待的话，请多多为我投票吧！", "《作词作曲》", "你干嘛∽哈哈～哎呦", "糖果超甜", "笑死我了哈哈哈哈", "你是我的我是你的谁", "原版都这么滑稽哈哈哈", "你不要过来！！！", "《啥时候都有人》", "我的口头禅"] || [new Date().toLocaleString(), '测试测试测试测试测试测试'];//弹幕文字
  const colors = ['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#e54256', '#ffe133', '#64DD17', '#D500F9'];
  const types = ['top','bottom','right'];

  const randomItem = arr => arr[Math.random() * arr.length | 0];
  dplayer.current?.danmaku?.draw({
    text: randomItem(danmaku),
    color: randomItem(colors),
    type: randomItem(types), //滚动
  })
}

// 识别
async function recognition(){
  
  try{
    const subtitles_container = container.current?.querySelector(".dplayer-danmaku")
    randomDanmaku()
    if(segmenter.current && isMaskOpen){
      const canvas = document.createElement("canvas")
      const context = canvas.getContext('2d')

     // 压缩视频
      const imageData = await compress(dplayer.current.video)
      

      const segmentationConfig = {
        flipHorizontal: false,
        multiSegmentation: false,
        segmentBodyParts: true,
        segmentationThreshold: 1,
      }
      const people = await segmenter.current.segmentPeople(imageData,segmentationConfig)
      
      // 官网默认的配置
      const foregroundColor = { r: 0, g: 0, b: 0, a: 0 }; //用于可视化属于人的像素的前景色 (r,g,b,a)。
      const backgroundColor = { r: 0, g: 0, b: 0, a: 255 }; //用于可视化不属于人的像素的背景颜色 (r,g,b,a)。
      const drawContour = false; //是否在每个人的分割蒙版周围绘制轮廓。
      const foregroundThresholdProbability = 0.3
      const backgroundDarkeningMask = await bodySegmentation.toBinaryMask(people,foregroundColor,backgroundColor,drawContour,foregroundThresholdProbability)
    
      canvas.width = backgroundDarkeningMask.width
      canvas.height = backgroundDarkeningMask.height
      context.putImageData(backgroundDarkeningMask,0,0)
      const base64Image = canvas.toDataURL("image/png") // 黑白蒙层
      setMaskImageUrl(base64Image)
      const { width, height } = dplayer.current.video.getBoundingClientRect()
      
      //加载图片到缓存中（如果不加载到缓存中，会导致mask-image失效，因为图片还没有加载到页面上，新的图片已经添加上去了，会导致图片一直是个空白）
      await imgLoad(base64Image)

      subtitles_container.style = `-webkit-mask-image: url(${base64Image});-webkit-mask-size: ${width}px ${height}px;`
      animation.current = requestAnimationFrame(recognition)
    }
    else{

      cancelAnimationFrame(animation.current)
    }

  }catch(e){
    message.error(e)
  }
}




  return (
    <div className="App">
      <div className="container">
        {loading && <div className="loading-container">
          <Spin spinning={loading} />
        </div>}
        <div ref={container} style={{maxWidth:'150px'}}></div>
        <br />

        <Form labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        style={{ maxWidth: 600 }}>
          <Form.Item label="智能放挡弹幕" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item label="模型分类" tooltip="尺寸越大，识别越准确，同时性能也更差">
            <Radio.Group>
              <Radio value={1}>144*256*3</Radio>
              <Radio value={2}>256*256*3</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="阈值">
          <Slider defaultValue={30} />
          </Form.Item>
        </Form>

        {maskImageUrl && <img src={maskImageUrl} alt="蒙层图片" />}
      </div>


    
      
    </div>
  );
}

export default App;
