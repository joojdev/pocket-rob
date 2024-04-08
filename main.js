const playButton = document.querySelector('#playButton')

playButton.addEventListener('click', async () => {
  if (playing) return
  playing = true
  playButton.textContent = '⌛'
  const code = javascript.javascriptGenerator.workspaceToCode(workspace)
  await eval(code)
  playButton.textContent = '▶'
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

function drawRob(drawX, drawY, facing, snapToGrid = true, surprised = false) {
  if ((drawX > 6 || drawY > 6 || drawX < 0 || drawY < 0) && snapToGrid) return
  
  let posX = drawX
  let posY = drawY
  
  if (snapToGrid) {
    posX = (drawX * 16) + drawX + 1
    posY = (drawY * 16) + drawY + 1
  }
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
  gameScreen.drawImage(spriteList[3], posX, posY - 3)
}

function clear() {
  gameScreen.drawImage(spriteList[0], 0, 0)
}

function draw(snapToGrid = true, surprised = false) {
  clear()
  drawRob(x, y, facing, snapToGrid, surprised)
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

  const xForecast = x + (xOffset * blocks)
  const yForecast = y + (yOffset * blocks)
  let surprised = false
  
  if (xForecast > 6) {
    blocks -= xForecast - 6
    surprised = true
  } else if (yForecast > 6) {
    blocks -= yForecast - 6
    surprised = true
  } else if (xForecast < 0) {
    blocks += xForecast
    surprised = true
  } else if (yForecast < 0) {
    blocks += yForecast
    surprised = true
  }

  for (let i = 0; i < blocks; i++) {
    let oldX = x
    let oldY = y

    x = (x * 16) + x + 1
    y = (y * 16) + y + 1

    for (let j = 0; j < 16; j ++) {
      x += xOffset
      y += yOffset
      draw(false)
      await delay(50)
    }

    x = oldX + xOffset
    y = oldY + yOffset
    draw()
    await delay(500)
  }

  if (surprised) {
    draw(true, true)
    await delay(500)
    draw()
    await delay(500)
    draw(true, true)
    await delay(500)
    draw()
    await delay(500)
    draw(true, true)
    await delay(500)
    draw()
    await delay(500)
  }
}