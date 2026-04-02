/**
 * 打乱拼图块顺序 (Fisher-Yates 洗牌算法)
 * @param {Array} pieces - 拼图块数组
 * @returns {Array} 打乱后的拼图块数组
 */
export function shufflePieces(pieces) {
  const shuffled = pieces.map(p => ({ ...p }))

  // Fisher-Yates 洗牌算法
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    // 交换 currentIndex
    const tempIndex = shuffled[i].currentIndex
    shuffled[i].currentIndex = shuffled[j].currentIndex
    shuffled[j].currentIndex = tempIndex
  }

  // 检查是否已经完成
  if (isComplete(shuffled)) {
    return shufflePieces(pieces) // 重新打乱
  }

  // 检查是否有解 (对于简单的交换拼图，只要不是完成状态就有解)
  return shuffled
}

/**
 * 检查拼图是否完成
 * @param {Array} pieces - 拼图块数组
 * @returns {boolean}
 */
export function isComplete(pieces) {
  return pieces.every(piece => piece.currentIndex === piece.correctIndex)
}

/**
 * 计算逆序数 (用于判断拼图是否有解)
 * @param {Array} pieces - 拼图块数组
 * @returns {number}
 */
export function countInversions(pieces) {
  let inversions = 0
  const positions = pieces.map(p => p.currentIndex)

  for (let i = 0; i < positions.length - 1; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      if (positions[i] > positions[j]) {
        inversions++
      }
    }
  }

  return inversions
}
