import "./App.css";

import * as bodySegmentation from '@tensorflow-models/body-segmentation';
import '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import '@mediapipe/selfie_segmentation';

import hh from './hh.jpg'

import { useEffect } from "react";




function App() {


 useEffect(()=>{

  init()
 },[])


  async function init(){
    const foregroundColor = { r: 0, g: 0, b: 0, a: 0 }; //用于可视化属于人的像素的前景色 (r,g,b,a)。
    const backgroundColor = { r: 0, g: 0, b: 0, a: 255 }; //用于可视化不属于人的像素的背景颜色 (r,g,b,a)。
    const drawContour = false; //是否在每个人的分割蒙版周围绘制轮廓。

    const opacity = 0.7;
  
    const maskBlurAmount = 0;
    try {

      const model = bodySegmentation.SupportedModels.MediaPipeSelfieSegmentation;
      const segmenterConfig = {
        runtime:'mediapipe',
        solutionPath: 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
        modelType: 'general',
      }
  
       const segmenter = await bodySegmentation.createSegmenter(model,segmenterConfig)
      // const segmenter1 = await bodySegmentation.createSegmenter(bodySegmentation.SupportedModels.BodyPix)
      
    const img = document.getElementById('image');


    const segmentationConfig = {
      flipHorizontal:false,
      multiSegmentation: false,
      segmentBodyParts:true,
      segmentationThreshold: 1,
    }
    const segmentation = await segmenter.segmentPeople(img,segmentationConfig);
  //  const segmentation1 = await segmenter1.segmentPeople(img,{multiSegmentation:false,segmentBodyParts:true})

   



    // 包含具有指定不透明度的掩码的ImageData,通常使用toBinaryMask
    // canvas要绘制的画布，image应用口罩的原始图像，maskImage包含掩码的图像数据，maskOpacity在图像顶部绘制口罩时的不透明度，默认值是0.7,0-1之间浮动，maskBlurAmout模糊面具的像素数量，默认值算0,0-20之间，flipHorizontal结果应该水平翻转，默认值是false
    
     const coloredPartImage = await bodySegmentation.toBinaryMask(segmentation,foregroundColor, backgroundColor, drawContour, 0.2); //将像素着色为前景而不是背景的最小概率：0.2
    // const coloredPartImage1 = await bodySegmentation.toColoredMask(segmentation1,bodySegmentation.bodyPixMaskValueToRainbowColor,{r:255,g:255,b:255,a:255})

    const canvas = document.getElementById('canvas');



    //Once you have the imageData object from toBinaryMask you can use the drawMask function to render it to a canvas of your choice.
    await bodySegmentation.drawMask(canvas,img,coloredPartImage,opacity,maskBlurAmount,false)
    // await bodySegmentation.drawMask(canvas,img,coloredPartImage1,opacity,maskBlurAmount,false)

    }catch(e){
      console.log(e,33);
    }


 
  }

  
  return (
    <div className="App">

      <img id="image" alt="甄嬛" src={hh} />

      <canvas id="canvas" />

    
      
    </div>
  );
}

export default App;
