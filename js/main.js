import Player     from './player/index'
import Enemy      from './npc/enemy'
import BackGround from './runtime/background'
import GameInfo   from './runtime/gameinfo'
import Music      from './runtime/music'
import DataBus    from './databus'

let ctx   = canvas.getContext('2d')
let databus = new DataBus()

/**
 * 游戏主函数
 */
export default class Main {
  constructor() {
    this.restart()

    // 初始化事件监听
    this.initEvent()
  }

  restart() {
    databus.reset()

    canvas.removeEventListener(
      'touchstart',
      this.touchHandler
    )

    this.bg       = new BackGround(ctx)
    this.player   = new Player(ctx)
    this.gameinfo = new GameInfo()
    // this.music    = new Music()

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }

  /**
   * 随着帧数变化的敌机生成逻辑
   * 帧数取模定义成生成的频率
   */
  enemyGenerate() {
    if ( databus.frame % 30 === 0 ) {
      let enemy = databus.pool.getItemByClass('enemy', Enemy)
      enemy.init(6)
      databus.enemys.push(enemy)
    }
  }

  // 全局碰撞检测
  collisionDetection() {
    let that = this
    if(!databus.enemys.length) {
      return 
    }

    for ( let i = 0, il = databus.enemys.length; i < il;i++ ) {
      let enemy = databus.enemys[i]
      
      if ( enemy.isCollideWith() ) {
          databus.gameOver = true 
          break
      }
    }
  }


  //游戏结束后的触摸事件处理逻辑
  touchEventHandler(e) {
     e.preventDefault()

    let x = e.touches[0].clientX
    let y = e.touches[0].clientY

    let area = this.gameinfo.btnArea

    if (   x >= area.startX
        && x <= area.endX
        && y >= area.startY
        && y <= area.endY  )
      this.restart()
    }

    /**
     * canvas重绘函数
     * 每一帧重新绘制所有的需要展示的元素
     */
    render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      this.bg.render(ctx)

      databus.enemys.forEach((item) => {
        item.drawToCanvas(ctx)
      })

      databus.animations.forEach((ani) => {
        if ( ani.isPlaying ) {
          ani.aniRender(ctx)
        }
      })

      this.gameinfo.renderGameScore(ctx, databus.score)
  }

  // 游戏逻辑更新主函数
  update() {
    this.bg.update()
    let isAddScore = false
    databus.enemys.forEach((item, i) => {
      item.update()
    })

    this.enemyGenerate()

    this.collisionDetection()

  }

  initEvent() {
    canvas.addEventListener('touchstart', ((e) => {
      e.preventDefault()
      let x = e.touches[0].clientX
      let y = e.touches[0].clientY
      databus.enemys.forEach((item, i) => {
        if(this.player.checkIsFingerOnAir(item.x, item.y, item.width, item.height, x, y) ){
          item.visible = false
          databus.score  += 1
        }
      })
    }).bind(this))

    canvas.addEventListener('touchend', ((e) => {
      e.preventDefault()
      this.x = -10000
      this.y = -10000
      this.touched = false
    }).bind(this))
  }

  // 实现游戏帧循环
  loop() {
    databus.frame++

    this.update()
    this.render()

    // 游戏结束停止帧循环
    if ( databus.gameOver ) {
      this.gameinfo.renderGameOver(ctx, databus.score)

      this.touchHandler = this.touchEventHandler.bind(this)
      canvas.addEventListener('touchstart', this.touchHandler)

      return
    }

    window.requestAnimationFrame(
      this.loop.bind(this),
      canvas
    )
  }
}
