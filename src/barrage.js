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

        for(let i = 1;i<= mount;i++){
            this.tunnelAmout.push((this.fontSize+20)*i) // 可能会超出canvas高度！
        }
    }
}