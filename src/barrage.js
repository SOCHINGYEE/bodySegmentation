/* eslint-disable import/no-anonymous-default-export */
class Barrage{
    constructor(canvas,canvasWidth,canvasHeight,tunnelAmout,fontSize){
        this.canvas = document.getElementById(canvas)
        this.context = this.canvas.getContext('2d')
 
        this.canvas.height = canvasHeight
        this.canvas.width = canvasWidth

        this.barrageList = [] // 正在展示的弹幕

        this.textList = [] // 待发送的弹幕

        this.fontSize = fontSize
        this.context.font = `${this.fontSize}px STheiti, SimHei`

        this.tunnelAmout = [] 

        this.initTop(tunnelAmout) //防止弹幕在Y轴重叠，可根据实际情况调整数量

        this.draw = false
    }


    initTop(mount){
        // 最多存在的弹幕行数
        const maxTunnelAmount = (this.canvasHeight / (this.fontSize + 20)) | 0 // +20是因为行间间隔
        // 如果传入的行数大于最多弹幕行数，取最多弹幕行数
        // eslint-disable-next-line no-unused-expressions
        maxTunnelAmount < mount ? mount = maxTunnelAmount : 0

        // 弹幕行数
        for(let i = 1;i<= mount;i++){
            this.tunnelAmout.push((this.fontSize+20)*i) 
        }
    }

    drawBarrage(){
        this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight)
        //提前清除无用的弹幕，保证绘制弹幕时所有弹幕都是存在于页面上的，如果边绘制弹幕边清除数据，因为数组下标的改变会引起弹幕闪烁
        for(let i=0;i<this.barrageList.length;i++){
            if(this.barrageList[i]?.left + this.barrageList[i]?.width <= 0 ){
                this.barrageList.splice(i,-1) //剔除已经出屏幕的弹幕
            }
        }
        // 绘制
        this.barrageList.forEach((val)=>{
            this.context.fillStyle = val.color
            this.context.fillText(`${val.value}`,val.left,val.top)
            // occupation为占用top的标志, 弹幕右边界出现在屏幕内（刚好完整展示）
            if(val.occupation && val.left + val.width <= this.canvas.width){
                this.consumeText(val)
            }
            val.left -= 2 //speed
        })
        this.barrageList?.length === 0 ? this.draw = false : requestAnimationFrame(this.drawBarrage.bind(this))
    }

    consumeText(val){
        val.occupation = false
        // 释放top
        setTimeout(()=>{
            this.tunnelAmout.push(val.top) //防止x轴的重叠

            // 检查是否有待发送的弹幕
            if(this.textList?.length !== 0){
                this.barrageList.push(this.initText(this.textList.splice(0,1)[0]))
            }
        },500)
    }

    // 初始化弹幕对象
    initText(val){
        let value = val
        let color = ['#E0FFFF','#FFE1FF','#FFB5C5','#F0FFF0','#BFEFFF','#63B8FF','#FFFFFF']
        let barrageText = {
            value,
            top:this.tunnelAmout.splice(0,1)[0],
            left:this.canvasWidth, // 弹幕起点
            color:color[Math.floor(Math.random()*6)],
            offset:Math.ceil(Math.random()*3),
            width:Math.ceil(this.context.measureText(value).width),
            occupation:true, // 防止X轴的重叠

        }
        return barrageText
    }

    // 如果有top可以使用，直接将数据添加至this.barrageList中进行绘制，其他数据添加至this.textList中等待绘制
    addText(textList){
        if(this.draw){
            // 判断是否有剩余的tunnelMount可用
            if(this.tunnelAmout.length !== 0) {
                let willShowTextList = textList.splice(0,this.tunnelAmout.length) // ?
                for(const val of willShowTextList){
                    this.barrageList.push(this.initText(val))
                }
            }
            this.textList.push(...textList) //待绘制的弹幕列表
        }else{
            this.textList.push(...textList)
            this.draw = true
            this.runBarrage()
        }
    }

    runBarrage(){
        // 根据弹幕top数初始化第一次展示的数据
        this.textList.splice(0,this.tunnelAmout.length).forEach((val)=>{
            this.barrageList.push(this.initText(val))
        })
        this.drawBarrage()
    }
}

export default {
    Barrage
}