export default class Cell{
  constructor(puzzle, i){
    this.isEmpty = false;
    this.i = i;
    this.puzzle = puzzle;
    this.cellWidth = this.puzzle.width/this.puzzle.dimension;
    this.cellHeight = this.puzzle.height/this.puzzle.dimension;
    
    this.el = this.createDiv();
    puzzle.el.appendChild(this.el);

    // fi last div, leave it empty
    if (this.i === this.puzzle.dimension * this.puzzle.dimension - 1) {
      this.isEmpty = true;
      return
    }
    this.setImage();
  }

  setImage() {
    const {x, y} = this.getXY(this.i);
    const left = this.cellWidth * x;
    const top = this.cellHeight * y;
    this.el.style.backgroundImage = `url(${this.puzzle.imageSrc})`;
    this.el.style.backgroundPosition = `-${left}px -${top}px`;
    this.el.style.border = '1px solid #FFF';
  }

  createDiv() {
    const div = document.createElement("div");
    const {x, y} = this.getXY(this.i);
    const left = this.cellWidth * x;
    const top = this.cellHeight * y;
    // this.set
    
    div.style.backgroundSize = `${this.puzzle.width}px ${this.puzzle.height}px`;
    div.style.width = `${this.cellWidth}px`;
    div.style.height = `${this.cellHeight}px`;
    div.style.position = 'absolute';
    div.style.left = `${left}px`;
    div.style.top = `${top}px`;

    // add eventListeners
    div.onclick = () => {
      const status = this.puzzle.status;
      console.log('status', status)
      if (status === 'ready' || status === 'complete') {
        return
      }
      console.log('Init index: ', this.i);
      console.log('array index', this.puzzle.findPosition(this.i));
      console.log('empty index', this.puzzle.findEmpty());
      const curIndex = this.puzzle.findPosition(this.i);
      const emptyindex = this.puzzle.findEmpty();
      const {x, y} = this.getXY(curIndex);
      const {x: emptyX, y: emptyY} = this.getXY(emptyindex);
      console.log('x, y', x, y);
      console.log('emptyX, emptyY', emptyX, emptyY);
      if ((x === emptyX || y === emptyY) && (Math.abs(x-emptyX) === 1 || Math.abs(y-emptyY))) {
        console.log('I can swap');

        this.puzzle.swapCells(curIndex, emptyindex, true);
        this.puzzle.updateMove();
      }
    }
    
    return div;
  }

  setPosition(destination, animate=false, origin) {
    const {left, top} = this.getDimensionsFromIndex(destination);
    const {left: curLeft, top: curTop} = this.getDimensionsFromIndex(origin);

    if (animate) {
      console.log('set to animate');
      if (left !== curLeft) {
        this.animate(curLeft, left, 'horizontal');
      } else if (top !== curTop) {
        this.animate(curTop, top, 'vertical');
      }
    } else  {
      this.el.style.left = `${left}px`;
      this.el.style.top = `${top}px`;
    }
  }

  getDimensionsFromIndex(i) {
    const {x, y} = this.getXY(i);
    return {
      left: this.cellWidth * x,
      top: this.cellHeight * y
    }
  }

  getXY(i) {
    return {
      x: i % this.puzzle.dimension,
      y: Math.floor(i / this.puzzle.dimension)
    }
  }
  
  animate(origin, destination, dimension) {
    const animationDuration = 500;
    const frameRate = 10;

    let step = frameRate * Math.abs((destination - origin)/animationDuration);

    let id = setInterval(() => {
      if (origin < destination) {
        origin = Math.min(destination, origin + step);
        if (origin >= destination) {
          clearInterval(id)
        }
      } else {
        origin = Math.max(destination, origin - step)
        if (origin <= destination) {
          clearInterval(id)
        }
      }
    if (dimension === 'vertical') {
      this.el.style.top = `${origin}px`
    } else {
      this.el.style.left = `${origin}px`
    }
    
    }, frameRate)
  }


}
