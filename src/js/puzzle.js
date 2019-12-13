import Cell from './cell'
export default class Puzzle {
  constructor(el, imageSrc, width) {
    this.parentEl = el;
    this.imageSrc = imageSrc;
    this.width = width;
    this.cells = [];
    this.dimension = 3;
    this.playButton = document.querySelector('button');
    this.movesSpan = document.querySelector('#move');
    this.timeSpan = document.querySelector('#time');
    this.message = document.querySelector('.message');
    this.dimensionSelector = document.querySelector('#change-dimension');
    this.tick = this.tick.bind(this);
    console.log('this.dimensionSelector', this.dimensionSelector);
    //
    this.status = "ready";
    this.move = 0;
    this.time = 0;
    // 
    
    this.init();
    const img = new Image();
    img.onload = () => {
      this.height = img.height * this.width/img.width;
      this.el.style.width = `${this.width}px`;
      this.el.style.height = `${this.height}px`;

      this.setUp();
    }
    img.src = this.imageSrc;
  }

  

  init() {
    this.el = this.createWrapper();
    this.parentEl.appendChild(this.el);
    const _this = this;
    this.dimensionSelector.onchange = function() {
      _this.reshuffle();
    }
    this.playButton.onclick = function() {
      _this.shuffle();
      _this.updateGameStatus("playing");
      _this.updateMove(false);
    }
  }

  reshuffle() {
    // console.log('reshuffling');
    // console.log('this.dimension', this.dimensionSelector.value);
    // this.dimension = this.dimensionSelector.value
    // // remove current cells and set up again
    // const cells = document.querySelector('.cells').childNodes;
    // console.log('cells', cells);
    // for (let i = 0; i < cells.length - 1; i++) {
    //   console.log('cells: ', cells[i].parentNode);
    //   // cells[i].parentNode.removeChild(cells[i]);
    // }
    // // this.setUp();
  }

  createWrapper() {
    const div = document.createElement("div");
    div.classList.add("cells");
    div.style.position = 'relative';
    div.style.margin = '0 auto';
    return div;
  }

  setUp() {
    this.cells = [];
    for (let i = 0; i < this.dimension * this.dimension; i++) {
      this.cells.push(new Cell(this, i))
    }
    console.log('this.cells.length', this.cells.length);
  }

  shuffle() {
    this.shuffling = true;
    for (let i = this.cells.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        this.swapCells(i, j, false);
    }
    this.shuffling = false;
    return this.cells;
  }

  findPosition(i) {
    return this.cells.findIndex(cell => cell.i === i);
  }

  findEmpty() {
    return this.cells.findIndex(cell => cell.isEmpty)
  }

  isSolved() {
    for (let i = 0; i < this.cells.length; i++) {
      if (i !== this.cells[i].i) {
        return false
      }
    }
    return true;
  }

  swapCells(i, j, animate) {
    this.cells[i].setPosition(j, animate, i);
    this.cells[j].setPosition(i);
    [this.cells[i], this.cells[j]] = [this.cells[j], this.cells[i]];
    // console.log('this.cells', this.cells)
    if (!this.shuffling && this.isSolved()) {
      console.log('this.is solved');
      this.updateGameStatus("complete");
    }
  }

  updateGameStatus(status) {
    console.log('this.status', this.status);
    console.log('status', status);
    if(this.status === 'ready' && status == 'playing' || this.status === 'complete' && status == 'playing') {
      this.startTimer();
      this.playButton.textContent = 'Reset';
    }
    if (this.status === 'playing' && status === 'complete') {
      this.stopTimer();
      this.showMessage("Completed");
      this.playButton.textContent = 'Play';
    }
    if(this.status === 'playing' && status === 'playing') {
      this.stopTimer()
      this.startTimer()
    }
    this.status = status;
  }

  updateMove(increment=true) {
    console.log('increamenting');
    if (increment) {
      this.move++;
    } else {
      this.move = 0;
    }
    this.movesSpan.textContent = `Move ${this.move}`;
  };

  tick() {
    this.time++;
    this.timeSpan.textContent = `Time ${this.time}`;
  }

  startTimer() {
    this.time = 0;
    this.tickId = setInterval(this.tick, 1000)
  }

  stopTimer() {
    clearInterval(this.tickId)
  }

  showMessage(message) {
    console.log('complete');
    if(message !== '') {
      this.message.textContent = message;
    } else {
      this.message.textContent = '';
    }
  }


}
