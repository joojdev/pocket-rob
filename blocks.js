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
    },
    {
      kind: 'block',
      type: 'repeat'
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
  const code = `await walk(${blocks});\n`
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
  const code = `await turn("${dropdown_direction}");\n`
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
  return `\
(async () => {
  ${statements_code}
})();
`
}

Blockly.Blocks['repeat'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Repita")
        .appendField(new Blockly.FieldNumber(2), "times")
        .appendField("vezes")
    this.appendStatementInput("code")
        .setCheck(null)
    this.setPreviousStatement(true, null)
    this.setNextStatement(true, null)
    this.setColour(300)
 this.setTooltip("Tudo aqui dentro será executado N vezes.")
  }
}

javascript.javascriptGenerator.forBlock['repeat'] = function(block, generator) {
  var number_times = block.getFieldValue('times')
  var statements_code = generator.statementToCode(block, 'code')
  var code = `\
for (_ in Array(${number_times}).fill()) {
  ${statements_code}
}
`
  return code
}

const workspace = Blockly.inject('codeEditor', { toolbox })

Blockly.serialization.blocks.append({ type: 'factory_base' }, workspace)
workspace.addChangeListener(Blockly.Events.disableOrphans)