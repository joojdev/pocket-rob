const toolbox = {
  'kind': 'flyoutToolbox',
  'contents': [
    {
      kind: 'block',
      type: 'walk_block'
    },
    {
      kind: 'block',
      type: 'turn_block'
    }
  ]
}

Blockly.Blocks['walk_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Andar")
        .appendField(new Blockly.FieldNumber(0, 1, 6), "blocks")
        .appendField("bloco(s)")
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(30)
    this.setTooltip("Esse bloco faz o ROB andar um bloco de cada vez.")
  }
}

javascript.javascriptGenerator.forBlock['walk_block'] = function(block, generator) {
  const blocks = block.getFieldValue('blocks')
  const code = `walk(${blocks})\n`
  return code
}

Blockly.Blocks['turn_block'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Vire à")
        .appendField(new Blockly.FieldDropdown([["esquerda ↺","left"], ["direita ↻","right"]]), "direction")
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(345)
    this.setTooltip("Este bloco faz o Rob virar para esquerda ou para a direita.")
  }
}

javascript.javascriptGenerator.forBlock['turn_block'] = function(block, generator) {
  const dropdown_direction = block.getFieldValue('direction')
  const code = `turn("${dropdown_direction}")\n`
  return code
}

Blockly.Blocks['factory_base'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Quando ▶ for pressionado")
    this.appendStatementInput("code")
        .setCheck(null)
    this.setColour(120)
    this.setTooltip("Tudo aqui dentro será executado quando o botão ▶ for pressionado!")
    this.setDeletable(false)
    this.setEditable(false)
  }
}

javascript.javascriptGenerator.forBlock['factory_base'] = function(block, generator) {
  const statements_code = generator.statementToCode(block, 'code');
  return statements_code
}

const workspace = Blockly.inject('codeEditor', { toolbox })

Blockly.serialization.blocks.append({ type: 'factory_base' }, workspace)
workspace.addChangeListener(Blockly.Events.disableOrphans)

const playButton = document.querySelector('#playButton')

playButton.addEventListener('click', () => {
  const code = javascript.javascriptGenerator.workspaceToCode(workspace)
  console.log(code)
})

const canvasElement = document.querySelector('#gameScreen')
const gameScreen = canvasElement.getContext('2d')

let spritesLoaded = 0

let spriteList = ['./background.png', './rob-sprite.png', './sombra.png']

spriteList = spriteList.map((path) => {
  const image = new Image()
  image.src = path

  image.onload = () => {
    spritesLoaded += 1

    if (spritesLoaded >= spriteList.length) {
      start()
    }
  }

  return image
})

function drawRob(x, y, direction) {
  if (x > 6 || y > 6 || x < 0 || y < 0) return

  const posX = (x * 16) + x + 1
  const posY = (y * 16) + y + 1
  let spriteX = 0
  let spriteY = 0

  switch (direction) {
    case 'back':
      spriteY = 16
      break
    case 'front':
      spriteY = 0
    case 'left':
      spriteY = 32
      break
    case 'right':
      spriteY = 48
      break
  }
  gameScreen.drawImage(spriteList[2], posX, posY)
  gameScreen.drawImage(spriteList[1], spriteX, spriteY, 16, 16, posX, posY, 16, 16)
}

function start() {
  gameScreen.drawImage(spriteList[0], 0, 0)
  drawRob(1, 2, 'up')
}

