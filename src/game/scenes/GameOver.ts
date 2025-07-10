import { Scene } from 'phaser';

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameover_text : Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create (data: { score: number })
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameover_text = this.add.text(512, 320, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.add.text(512, 400, `Gems Collected: ${data.score}`, {
            fontFamily: 'Arial', fontSize: 32, color: '#ffff00',
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {
            this.scene.start('MainMenu');
        });

        this.input.keyboard!.on('keydown-ENTER', () => {
            this.scene.start('MainMenu');
        });
    }
}
