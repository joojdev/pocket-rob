const playButton = document.querySelector('#playButton')

playButton.addEventListener('click', async () => {
  if (playing) return
  playing = true
  const code = javascript.javascriptGenerator.workspaceToCode(workspace)
  await eval(code)
  playing = false
})

const canvasElement = document.querySelector('#gameScreen')
const gameScreen = canvasElement.getContext('2d')

let spritesLoaded = 0

let spriteList = ['background', 'rob-sprite', 'sombra', 'aviso']

spriteList = spriteList.map((file) => {
  const image = new Image()
  image.src = `./sprites/${file}.png`

  image.onload = () => {
    spritesLoaded += 1

    if (spritesLoaded >= spriteList.length) {
      draw()
    }
  }

  return image
})

let x = 1
let y = 2
let facing = 'front'
let playing = false

function drawRob(x, y, facing, surprised) {
  if (x > 6 || y > 6 || x < 0 || y < 0) return

  const posX = (x * 16) + x + 1
  const posY = (y * 16) + y + 1
  let spriteX = 0
  let spriteY = 0

  switch (facing) {
    case 'back':
      spriteY = 16
      break
    case 'front':
      spriteY = 0
      break
    case 'left':
      spriteY = 32
      break
    case 'right':
      spriteY = 48
      break
  }
  gameScreen.drawImage(spriteList[2], posX, posY)
  gameScreen.drawImage(spriteList[1], spriteX, spriteY, 16, 16, posX, posY, 16, 16)
  if (!surprised) return
  gameScreen.drawImage(spriteList[3], posX, posY - 13)
}

function draw() {
  gameScreen.drawImage(spriteList[0], 0, 0)
  drawRob(x, y, facing, true)
}

const delay = async (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function turn(direction) {
  if (direction == 'left') {
    switch (facing) {
      case 'back':
        facing = 'left'
        break
      case 'front':
        facing = 'right'
        break
      case 'left':
        facing = 'front'
        break
      case 'right':
        facing = 'back'
        break
    }
  } else if (direction == 'right') {
    switch (facing) {
      case 'back':
        facing = 'right'
        break
      case 'front':
        facing = 'left'
        break
      case 'left':
        facing = 'back'
        break
      case 'right':
        facing = 'front'
        break
    }
  }

  draw()
  await delay(500)
}

async function walk(blocks) {
  let xOffset = 0
  let yOffset = 0

  switch (facing) {
    case 'back':
      yOffset = -1
      break
    case 'front':
      yOffset = 1
      break
    case 'left':
      xOffset = -1
      break
    case 'right':
      xOffset = 1
      break
  }

  for (let i = 0; i < blocks; i++) {
    x += xOffset
    y += yOffset

    draw()
    await delay(500)
  }
}