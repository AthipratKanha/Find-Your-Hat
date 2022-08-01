const prompt = require('prompt-sync')({ sigint: true });
const clear = require('clear-screen');
const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field = [[]]) {
    this.field = field;
    this.start = {
      x: 0,
      y: 0
    };
    this.hatPos = {
      x: 0,
      y: 0
    };
    this.locationX = 0;
    this.locationY = 0;
  }

  // สุ่มตำแหน่งบนสนาม
  // ขอบเขตที่กำหนด
  setPos(offLimit = { x: 0, y: 0 }) {
    const pos = {
      x: 0,
      y: 0
    }
    do {
      pos.x = Math.floor(Math.random() * this.field[0].length);
      pos.y = Math.floor(Math.random() * this.field.length);
    } while (pos.x === offLimit.x && pos.y === offLimit.y);
    return pos;
  }

  // สุ่มจุดเริ่มต้น
  setStart() {
    this.start = this.setPos();
    this.locationX = this.start.x;
    this.locationY = this.start.y;
    this.field[this.start.y][this.start.x] = pathCharacter;
  }

  // ตั้งค่าเป้าหมาย(หมวก)
  setHat() {
    this.hatPos = this.setPos(this.start)
    this.field[this.hatPos.y][this.hatPos.x] = hat;
  }
  runGame(hard = false) {
    // กำหนดจุดเริ่ม
    this.setStart();
    // กำหนดหมวก
    this.setHat();

    let playing = true;
    while (playing) {
      this.print();
      this.getInput();

      if (!this.isInBounds()) {
        console.log('Loses by landing on (and falling in) a hole.');
        playing = false;
        break;
      } else if (this.isHole()) {
        console.log('Loses by landing on (and falling in) a hole.');
        playing = false;
        break;
      } else if (this.isHat()) {
        console.log('Wins by finding their hat.');
        playing = false;
        break;
      }

      // โหมดยากให้สร้างหลุมเพิ่ม
      if (hard) {
        if (Math.random() > 0.1) {
          this.addHoles();
        }
      }

      // อัพเดตแผนที่ปัจจุบัน
      this.field[this.locationY][this.locationX] = pathCharacter;
    }
  }

  print() {
    clear();
    this.field.forEach(element => console.log(element.join('')));
  }

  getInput() {
    const input = prompt('Which way? ').toUpperCase();
    switch (input) {
      case 'W': //ขึ้น
        this.locationY -= 1;
        break;
      case 'S': //ลง
        this.locationY += 1;
        break;
      case 'A': //ซ้าย
        this.locationX -= 1;
        break;
      case 'D': //ขวา
        this.locationX += 1;
        break;
      default:
        console.log('Enter W, A, S or D');
        this.getInput();
        break;
    }
  }

  isInBounds() {
    return (
      this.locationY >= 0 &&
      this.locationX >= 0 &&
      this.locationY < this.field.length &&
      this.locationX < this.field[0].length
    );
  }

  isHat() {
    return this.field[this.locationY][this.locationX] === hat;
  }

  isHole() {
    return this.field[this.locationY][this.locationX] === hole;
  }

  addHoles() {
    // กำหนดหลุมเพิ่ม
    const numHoles = Math.floor(Math.random() * 3) + 1;
    for (let i = 1; i <= numHoles; i++) {
      let holePos = {
        x: 0,
        y: 0
      };
      do {
        holePos = this.setPos(this.hatPos);
      } while (holePos.x === this.locationX && holePos.y === this.locationY);
      this.field[holePos.y][holePos.x] = hole;
    }
  }

  static generateField(fieldH, fieldW, percentage = 0.1) {
    const field = new Array(fieldH).fill(0).map(element => new Array(fieldW));
    for (let y = 0; y < fieldH; y++) {
      for (let x = 0; x < fieldW; x++) {
        const prob = Math.random();
        field[y][x] = prob > percentage ? fieldCharacter : hole
      }
    }
    return field;
  }
}

const myField = new Field(Field.generateField(10, 15, 0.2), true);
myField.runGame(true);

