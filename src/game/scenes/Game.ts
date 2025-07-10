import { Scene, Physics, Types, GameObjects } from 'phaser';

export class Game extends Scene
{
    player!: Physics.Arcade.Sprite;
    cursors!: Types.Input.Keyboard.CursorKeys;
    background: GameObjects.Image;
    meteorGroup!: Physics.Arcade.Group;
    gemGroup!: Physics.Arcade.Group;
    lastMeteorY: number = -1;
    score = 0;
    scoreText!: GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.background = this.add.image(512, 384, 'background');

        this.player = this.physics.add.sprite(200, 300, 'player');
        this.player.setScale(0.3)
        this.player.setCollideWorldBounds(true);
        this.player.body?.setSize(480, 330);
        
        this.cursors =  this.input.keyboard!.createCursorKeys();

        this.meteorGroup = this.physics.add.group();
        this.gemGroup = this.physics.add.group();


        this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: this.spawnMeteor,
            callbackScope: this
        });

        this.time.addEvent({
          delay: 3560,
          loop: true,
          callback: this.spawnGem,
          callbackScope: this
        });

        this.physics.add.overlap(this.player, this.meteorGroup, this.handleCollision, undefined, this);
        this.physics.add.overlap(this.player, this.gemGroup, (player, gem) => {
          this.collectGem(player as Phaser.Physics.Arcade.Sprite, gem as Phaser.Physics.Arcade.Sprite);
        }, undefined, this);
        this.physics.add.collider(this.gemGroup, this.meteorGroup);

        this.scoreText = this.add.text(16, 16, 'Gems: 0', {
          fontSize: '20px',
          color: '#ffffff'
        });
        this.score = 0;
    }

    update() {
        this.player.setVelocity(0);
    
        if (this.cursors.left?.isDown) {
          this.player.setVelocityX(-300);
        } else if (this.cursors.right?.isDown) {
          this.player.setVelocityX(300);
        }
    
        if (this.cursors.up?.isDown) {
          this.player.setVelocityY(-300);
        } else if (this.cursors.down?.isDown) {
          this.player.setVelocityY(300);
        }
    }

    spawnMeteor() {
        let y = Phaser.Math.Between(50, 700);

        while (Math.abs(y - this.lastMeteorY) < 100) {
            y = Phaser.Math.Between(50, 700);
        }
        
        this.lastMeteorY = y;

        const meteor = this.meteorGroup.create(1050, y, 'meteor') as Physics.Arcade.Sprite;

        meteor.setScale(0.2);
        meteor.setVelocityX(-200);
        meteor.setImmovable(true);
        meteor.setCollideWorldBounds(false);
        meteor.body?.setSize(450, 430)
        meteor.body?.setOffset(250, 250);
    }

    spawnGem() {
      let y = Phaser.Math.Between(50, 700);
      let tries = 10;
    
      while (tries > 0) {
        const overlaps = this.physics.overlapRect(1050, y, 50, 50, true, true).some(obj =>
          this.meteorGroup.contains(obj.gameObject)
        );
    
        if (!overlaps) {
          break;
        }
    
        y = Phaser.Math.Between(50, 700);
        tries--;
      }
    
      const gem = this.gemGroup.create(1050, y, 'gemstone') as Phaser.Physics.Arcade.Sprite;
    
      gem.setScale(0.1);
      gem.setVelocityX(-200);
      gem.setImmovable(true);
      gem.setCollideWorldBounds(false);
      gem.body?.setSize(400, 480)
    }
    

    collectGem(_playerObj: Phaser.GameObjects.GameObject, gemObj: Phaser.GameObjects.GameObject) {
      const gem = gemObj as Phaser.Physics.Arcade.Sprite;
  
      gem.destroy();
      this.score += 1;
      this.scoreText.setText('Gems: ' + this.score);
    }
  
  

    handleCollision() {
        this.scene.start('GameOver', { score: this.score });
      }
}
