/**
 * 切割图片为拼图块
 * @param {string} imageUrl - 图片 URL
 * @param {number} gridSize - 网格大小 (3, 4, 6)
 * @returns {Promise<{pieces: Array, pieceImages: Array}>}
 */
export async function splitImage(imageUrl, gridSize) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const pieceWidth = img.width / gridSize
      const pieceHeight = img.height / gridSize
      const pieces = []
      const pieceImages = []

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const index = row * gridSize + col

          // 创建 canvas 裁剪图片
          const canvas = document.createElement('canvas')
          canvas.width = pieceWidth
          canvas.height = pieceHeight
          const ctx = canvas.getContext('2d')

          ctx.drawImage(
            img,
            col * pieceWidth,  // 源图 x
            row * pieceHeight, // 源图 y
            pieceWidth,        // 源图宽度
            pieceHeight,       // 源图高度
            0,                 // 目标 x
            0,                 // 目标 y
            pieceWidth,        // 目标宽度
            pieceHeight        // 目标高度
          )

          pieces.push({
            id: index,
            currentIndex: index,
            correctIndex: index
          })

          pieceImages.push({
            id: index,
            url: canvas.toDataURL('image/png')
          })
        }
      }

      resolve({ pieces, pieceImages })
    }

    img.onerror = () => {
      reject(new Error('图片加载失败'))
    }

    img.src = imageUrl
  })
}

/**
 * 读取本地文件为 Data URL
 * @param {File} file - 文件对象
 * @returns {Promise<{url: string, width: number, height: number}>}
 */
export function readImageFile(file) {
  return new Promise((resolve, reject) => {
    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      reject(new Error('请选择 JPG、PNG 或 WebP 格式的图片'))
      return
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      reject(new Error('图片大小不能超过 5MB'))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        resolve({
          url: e.target.result,
          width: img.width,
          height: img.height
        })
      }

      img.onerror = () => {
        reject(new Error('图片文件损坏，请重新选择'))
      }

      img.src = e.target.result
    }

    reader.onerror = () => {
      reject(new Error('读取文件失败'))
    }

    reader.readAsDataURL(file)
  })
}
