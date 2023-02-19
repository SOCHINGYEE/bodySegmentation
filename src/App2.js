import React, {useEffect, useRef} from 'react'
import barrageEffect from './barrage'
import "./index.scss"

export default function App2() {

const barrageRef = useRef()
const widthRef = useRef(0)
const heightRef = useRef(0)

useEffect(()=>{
    setCanvas()
},[])

function init(){
    const fontSize = 20
    const tunnelAmount = 4

    barrageRef.current = new barrageEffect.Barrage('canvas',widthRef.current,heightRef.current,tunnelAmount,fontSize)
    barrageRef.current.addText(['风景好美呀','绝了绝了','好想去','安排安排','醒醒醒醒，你没钱去'])
    setTimeout(()=>{
        barrageRef.current.addText(['年轻人','耗子尾子','耗耗反思','这是你该做的梦吗','醒醒醒醒，老实搬砖','再做梦别怪我捶你'])
    },500)
}

    function setCanvas(){
        let canvasStyle = document.getElementById('myCanvas')
        widthRef.current = canvasStyle.offsetWidth
        heightRef.current = canvasStyle.offsetHeight
        init()

    }


  return (
    <div className="barrage">
        <img src="https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" />
        <canvas id="canvas" />
        </div>
  )
}
