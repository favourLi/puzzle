# 架构设计文档

## 项目目录结构

```
puzzle/
├── public/                 # 静态资源
│   └── default-image.jpg   # 默认拼图图片
├── src/
│   ├── assets/             # 需要编译的资源
│   ├── components/         # 组件目录
│   │   ├── ImageSelector.vue    # 图片选择组件
│   │   ├── DifficultySelector.vue # 难度选择器
│   │   ├── PuzzleBoard.vue      # 拼图游戏板
│   │   ├── PuzzlePiece.vue      # 单个拼图块
│   │   ├── Timer.vue            # 计时器
│   │   ├── GameStatus.vue       # 游戏状态显示
│   │   └── PreviewModal.vue     # 预览弹窗
│   ├── composables/        # 组合式函数
│   │   ├── usePuzzle.js    # 拼图核心逻辑
│   │   ├── useTimer.js     # 计时器逻辑
│   │   └── useDragDrop.js  # 拖拽逻辑
│   ├── stores/             # Pinia 状态管理
│   │   └── gameStore.js    # 游戏状态
│   ├── utils/              # 工具函数
│   │   ├── imageProcessor.js # 图片处理
│   │   └── shuffler.js     # 打乱算法
│   ├── App.vue             # 根组件
│   └── main.js             # 入口文件
├── index.html
├── package.json
└── vite.config.js
```

## 组件设计

### 1. ImageSelector 组件

**职责**：选择本地图片并预览

```
Props: -
Emits: select(imageData)
功能:
  - 支持点击选择本地图片
  - 图片格式验证（jpg, png, webp）
  - 图片大小限制（最大 5MB）
  - 选择后自动加载显示
  - 图片仅在本地处理，不上传服务器
```

### 2. DifficultySelector 组件

**职责**：选择游戏难度

```
Props: currentDifficulty
Emits: change(difficulty)
功能:
  - 三种难度选择（简单/中等/复杂）
  - 显示每种难度的网格数
  - 游戏进行中禁用选择
```

### 3. PuzzleBoard 组件

**职责**：拼图游戏主区域

```
Props: image, gridSize, pieces
Emits: piece-moved, complete
功能:
  - 渲染拼图网格
  - 处理拖拽事件
  - 高亮正确位置的拼图块
  - 完成检测
```

### 4. PuzzlePiece 组件

**职责**：单个拼图块

```
Props: piece, index, gridSize, imageWidth, imageHeight
Emits: drag-start, drag-end
功能:
  - 显示拼图块图像
  - 支持拖拽操作
  - 拖拽时的视觉效果
```

### 5. Timer 组件

**职责**：计时显示

```
Props: isRunning, startTime
Emits: -
功能:
  - 显示已用时间（分:秒）
  - 暂停/继续
```

### 6. GameStatus 组件

**职责**：显示游戏状态和操作

```
Props: moves, isComplete, difficulty
Emits: restart, preview, new-game
功能:
  - 显示移动次数
  - 预览按钮
  - 重新开始按钮
  - 完成时显示成绩
```

## 状态管理 (Pinia Store)

```javascript
// stores/gameStore.js
state: {
  // 游戏配置
  difficulty: 'easy',      // 'easy' | 'medium' | 'hard'
  gridSize: 3,             // 3 | 4 | 6

  // 图片相关
  image: null,             // 原始图片
  imageWidth: 0,
  imageHeight: 0,

  // 拼图状态
  pieces: [],              // 拼图块数组
  correctOrder: [],        // 正确顺序

  // 游戏进度
  moves: 0,                // 移动次数
  isPlaying: false,        // 游戏是否进行中
  isComplete: false,       // 是否完成

  // 计时
  startTime: null,
  endTime: null
}
```

## 核心算法

### 1. 图片切割算法

```javascript
function splitImage(image, gridSize) {
  const pieceWidth = image.width / gridSize
  const pieceHeight = image.height / gridSize
  const pieces = []

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      pieces.push({
        id: row * gridSize + col,
        currentIndex: row * gridSize + col,
        correctIndex: row * gridSize + col,
        // 用于 canvas 裁剪的坐标
        sx: col * pieceWidth,
        sy: row * pieceHeight,
        width: pieceWidth,
        height: pieceHeight
      })
    }
  }

  return pieces
}
```

### 2. 拼图块打乱算法

```javascript
function shufflePieces(pieces) {
  const shuffled = [...pieces]

  // Fisher-Yates 洗牌算法
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    // 交换 currentIndex
    [shuffled[i].currentIndex, shuffled[j].currentIndex] =
    [shuffled[j].currentIndex, shuffled[i].currentIndex]
  }

  // 确保打乱后不是已完成状态
  if (isComplete(shuffled)) {
    return shufflePieces(pieces) // 重新打乱
  }

  return shuffled
}
```

### 3. 拖拽交换逻辑

```javascript
function handleDrop(fromIndex, toIndex) {
  if (fromIndex === toIndex) return

  // 交换两个拼图块的位置
  const pieces = [...this.pieces]

  // 找到在 fromIndex 和 toIndex 位置的拼图块
  const fromPiece = pieces.find(p => p.currentIndex === fromIndex)
  const toPiece = pieces.find(p => p.currentIndex === toIndex)

  // 交换它们的 currentIndex
  fromPiece.currentIndex = toIndex
  toPiece.currentIndex = fromIndex

  this.pieces = pieces
  this.moves++

  // 检查是否完成
  checkCompletion()
}
```

### 4. 完成检测算法

```javascript
function checkCompletion() {
  const isComplete = this.pieces.every(
    piece => piece.currentIndex === piece.correctIndex
  )

  if (isComplete) {
    this.isComplete = true
    this.isPlaying = false
    this.endTime = Date.now()
  }

  return isComplete
}
```

## 数据流

```
用户选择本地图片
      ↓
ImageSelector emit select
      ↓
gameStore.setImage()
      ↓
用户选择难度
      ↓
gameStore.setDifficulty()
      ↓
gameStore.startGame()
  → splitImage() 切割图片（本地 Canvas 处理）
  → shufflePieces() 打乱拼图
      ↓
PuzzleBoard 渲染拼图
      ↓
用户拖拽拼图块
      ↓
handleDrop() 交换位置
      ↓
checkCompletion() 检测完成
      ↓
完成 → 显示成绩
```

**注意**：所有图片处理均在浏览器本地完成，不涉及服务器上传。

## 性能优化

1. **图片处理**：使用 Canvas 在客户端切割图片，避免服务器处理
2. **虚拟列表**：复杂模式下使用虚拟滚动优化渲染
3. **拖拽优化**：使用 `requestAnimationFrame` 优化拖拽动画
4. **图片缓存**：切割后的图片块使用 Blob URL 缓存
